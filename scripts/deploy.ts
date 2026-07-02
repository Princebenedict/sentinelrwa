/**
 * SentinelRWA Deployment Script
 * Deploys the Intelligent Contract to GenLayer Studio or Bradbury Testnet
 */

import { createClient, createWalletClient } from "genlayer-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
const PRIVATE_KEY = process.env.GENLAYER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ GENLAYER_PRIVATE_KEY not set in .env");
  process.exit(1);
}

async function deploy() {
  console.log("🚀 Deploying SentinelRWA to:", RPC_URL);

  const contractPath = path.join(__dirname, "../contracts/sentinel_rwa.py");
  const contractCode = fs.readFileSync(contractPath, "utf-8");

  const client = createWalletClient({
    transport: { url: RPC_URL },
    account: { privateKey: PRIVATE_KEY as string },
  });

  console.log("📡 Sending deploy transaction...");

  const txHash = await client.deployContract({
    code: contractCode,
    args: [],
  });

  console.log("📋 Deploy tx hash:", txHash);
  console.log("⏳ Waiting for confirmation...");

  const receipt = await client.waitForTransactionReceipt({ hash: txHash });

  console.log("✅ Contract deployed!");
  console.log("📍 Contract address:", receipt.contractAddress);
  console.log("\n🔑 Add to your .env:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`);
}

deploy().catch(console.error);