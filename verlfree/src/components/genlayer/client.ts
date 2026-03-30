"use client";

import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { createWalletClient, custom, type WalletClient } from "viem";

export const GENLAYER_CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID || "4221"
);

export const GENLAYER_CHAIN_ID_HEX = `0x${GENLAYER_CHAIN_ID.toString(16)}`;

export const GENLAYER_NETWORK = {
  chainId: GENLAYER_CHAIN_ID_HEX,
  chainName:
    process.env.NEXT_PUBLIC_GENLAYER_CHAIN_NAME || "Genlayer Bradbury Testnet",
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
    symbol: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
    decimals: 18,
  },
  rpcUrls: [
    process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ||
      "https://rpc-bradbury.genlayer.com",
  ],
  blockExplorerUrls: [],
};

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function getStudioUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ||
    "https://rpc-bradbury.genlayer.com"
  );
}

export function getContractAddress(): string {
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
}

export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.ethereum?.isMetaMask;
}

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum || null;
}

export async function requestAccounts(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");

  return await provider.request({
    method: "eth_requestAccounts",
  });
}

export async function getAccounts(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider) return [];

  return await provider.request({
    method: "eth_accounts",
  });
}

export async function getCurrentChainId(): Promise<string | null> {
  const provider = getEthereumProvider();
  if (!provider) return null;

  return await provider.request({
    method: "eth_chainId",
  });
}

export async function addGenLayerNetwork(): Promise<void> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");

  await provider.request({
    method: "wallet_addEthereumChain",
    params: [GENLAYER_NETWORK],
  });
}

export async function switchToGenLayerNetwork(): Promise<void> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GENLAYER_CHAIN_ID_HEX }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await addGenLayerNetwork();
    } else {
      throw error;
    }
  }
}

export async function isOnGenLayerNetwork(): Promise<boolean> {
  const chainId = await getCurrentChainId();
  if (!chainId) return false;

  return parseInt(chainId, 16) === GENLAYER_CHAIN_ID;
}

export async function connectMetaMask(): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await requestAccounts();
  if (!accounts.length) throw new Error("No accounts found");

  const onCorrectNetwork = await isOnGenLayerNetwork();
  if (!onCorrectNetwork) {
    await switchToGenLayerNetwork();
  }

  return accounts[0];
}

export function createMetaMaskWalletClient(): WalletClient | null {
  const provider = getEthereumProvider();
  if (!provider) return null;

  return createWalletClient({
    chain: testnetBradbury as any,
    transport: custom(provider),
  });
}

export function createGenLayerClient(address?: string) {
  return createClient({
    chain: testnetBradbury,
    account: address as `0x${string}` | undefined,
  });
}

export async function getClient() {
  const accounts = await getAccounts();
  return createGenLayerClient(accounts[0]);
}


export async function switchAccount(): Promise<string> {

  const provider = getEthereumProvider();
  if (!provider) { throw new Error("MetaMask is not installed"); }


  try { // Request permissions - this shows account picker 
    await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }], }); // Get the newly selected account 
    const accounts = await provider.request({ method: "eth_accounts", });

    if (!accounts || accounts.length === 0) { throw new Error("No account selected"); }
    return accounts[0];
  }
  catch (error: any) {
    if (error.code === 4001) {
      throw new Error("User rejected account switch");
    }
    else if (error.code === -32002) {
      throw new Error("Account switch request already pending");
    }

    throw new Error(`Failed to switch account: ${error.message}`);
  }
}