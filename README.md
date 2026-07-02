# SentinelRWA

**AI-Powered Real-World Asset Intelligence on GenLayer**

SentinelRWA is an Intelligent Contract on GenLayer that continuously monitors Real-World Assets using decentralized AI Jury consensus — bringing subjective on-chain evaluation to RWAs, infrastructure, and project performance.

## Stack
- **Contract**: Python Intelligent Contract — GenLayer SDK
- **Network**: Bradbury Testnet / GenLayer Studio
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **SDK**: genlayer-js

## Contract Features
- Register RWA projects with evaluation criteria
- Submit multi-type evidence (reports, news, photos, inspections)
- AI Jury evaluation via `gl.eq_principle.prompt_non_comparative`
- Dynamic health scoring (0–100)
- Insurance threshold monitoring and automatic state transitions
- Permanent on-chain verdict history

## Quick Start

### 1. Contract (GenLayer Studio)
1. Open https://studio.genlayer.com
2. Create new contract → paste `contracts/sentinel_rwa.py`
3. Deploy → copy the contract address

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# Set NEXT_PUBLIC_CONTRACT_ADDRESS
npm install
npm run dev
```

### 3. Bradbury Testnet
- RPC: https://rpc-bradbury.genlayer.com
- Chain ID: 4221
- Faucet: https://testnet-faucet.genlayer.foundation
- Explorer: https://explorer-bradbury.genlayer.com