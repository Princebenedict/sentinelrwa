"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const eth = (typeof window !== "undefined" ? (window as any).ethereum : null);
    if (!eth) return;
    eth
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) setAddress(accounts[0]);
      })
      .catch(() => {});

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts && accounts.length > 0 ? accounts[0] : null);
    };
    eth.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      alert("No wallet found. Please install MetaMask to connect.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) setAddress(accounts[0]);
    } catch (e) {
      console.error("Wallet connect failed", e);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return (
    <WalletContext.Provider value={{ address, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
