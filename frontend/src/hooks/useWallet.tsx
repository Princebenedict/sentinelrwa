"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

// Bradbury chain ID (hex). If MetaMask prompts a wrong-network error, this is the value to check.
const BRADBURY_CHAIN_ID_HEX = "0x107d"; // 4221

interface WalletState {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletState | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEth(): any {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum || null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    const eth = getEth();
    if (!eth) {
      setError("No wallet found. Please install MetaMask.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        // Try to switch to Bradbury (ignore if it fails, user may add manually)
        try {
          await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BRADBURY_CHAIN_ID_HEX }],
          });
        } catch {
          // network not added, that's fine for now
        }
      }
    } catch (e) {
      const err = e as { code?: number; message?: string };
      if (err.code === 4001) setError("Connection request was rejected.");
      else setError(err.message || "Could not connect wallet.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  // Reconnect if already authorized, and listen for account changes
  useEffect(() => {
    const eth = getEth();
    if (!eth) return;

    eth.request({ method: "eth_accounts" }).then((accts: string[]) => {
      if (accts && accts.length > 0) setAddress(accts[0]);
    }).catch(() => {});

    const onAccountsChanged = (accts: string[]) => {
      setAddress(accts && accts.length > 0 ? accts[0] : null);
    };
    eth.on?.("accountsChanged", onAccountsChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, connecting, connect, disconnect, error }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
