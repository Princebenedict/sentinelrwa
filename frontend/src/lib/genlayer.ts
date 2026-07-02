import { createClient, createAccount } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { Address, CalldataEncodable } from "genlayer-js/types";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as Address;

// Read-only client for view calls
const readClient = createClient({ chain: testnetBradbury });

// Call a view (read) function and parse JSON if possible
export async function callView<T>(method: string, args: CalldataEncodable[] = []): Promise<T> {
  const result = await readClient.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });

  if (typeof result === "string") {
    try {
      return JSON.parse(result) as T;
    } catch {
      return result as T;
    }
  }
  return result as T;
}

// Send a write (transaction) function using a private key
export async function sendWrite(
  method: string,
  args: CalldataEncodable[],
  privateKey: string
): Promise<string> {
  const account = createAccount(privateKey as `0x${string}`);
  const writeClient = createClient({ chain: testnetBradbury, account });

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

  return txHash as string;
}
