import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { Address, CalldataEncodable } from "genlayer-js/types";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as Address;

const readClient = createClient({ chain: testnetBradbury });

// Simple cache + in-flight dedupe to avoid hammering the RPC (rate limits)
const CACHE_MS = 8000;
type CacheEntry = { time: number; value: unknown };
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

function keyOf(method: string, args: CalldataEncodable[]) {
  return method + ":" + JSON.stringify(args);
}

export async function callView<T>(
  method: string,
  args: CalldataEncodable[] = []
): Promise<T> {
  const key = keyOf(method, args);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.value as T;
  }

  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  const p = (async () => {
    const result = await readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: method,
      args,
    });
    let parsed: unknown = result;
    if (typeof result === "string") {
      try {
        parsed = JSON.parse(result);
      } catch {
        parsed = result;
      }
    }
    cache.set(key, { time: Date.now(), value: parsed });
    inflight.delete(key);
    return parsed;
  })();

  inflight.set(key, p);
  return p as Promise<T>;
}

// Clear cache after a write so fresh data loads next read
export function clearReadCache() {
  cache.clear();
}

export async function sendWrite(
  method: string,
  args: CalldataEncodable[],
  walletAddress: string
): Promise<string> {
  if (!walletAddress) throw new Error("Connect your wallet first.");

  const writeClient = createClient({
    chain: testnetBradbury,
    account: walletAddress as Address,
  });

  const txHash = await writeClient.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
    value: BigInt(0),
  });

  await writeClient.waitForTransactionReceipt({
    hash: txHash,
    status: TransactionStatus.ACCEPTED,
  });

  clearReadCache();
  return txHash as string;
}
