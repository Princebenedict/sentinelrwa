# SentinelRWA Deployment Guide

## Part 1: Contract on GenLayer Studio

### A. Studionet (Instant, No Setup)
1. Go to https://studio.genlayer.com
2. Click "New Contract"
3. Paste the full content of `contracts/sentinel_rwa.py`
4. Click "Deploy"
5. Copy the contract address shown

### B. Bradbury Testnet (Production-Like)

#### Setup wallet
1. Add network to MetaMask:
   - RPC: https://rpc-bradbury.genlayer.com
   - Chain ID: 4221
   - Currency: GEN
2. Get test GEN: https://testnet-faucet.genlayer.foundation

#### Deploy via CLI
```bash
npm install -g genlayer
genlayer network set bradbury
genlayer account import --key YOUR_PRIVATE_KEY
genlayer deploy contracts/sentinel_rwa.py
```

#### Deploy via script
```bash
cp .env.example .env
# Fill GENLAYER_PRIVATE_KEY and GENLAYER_RPC_URL
cd scripts
npx ts-node deploy.ts
```

---

## Part 2: Frontend on Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: SentinelRWA initial build"
git remote add origin https://github.com/YOUR_USER/sentinelrwa
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = your deployed contract address
   - `NEXT_PUBLIC_GENLAYER_RPC_URL` = https://rpc-bradbury.genlayer.com
   - `NEXT_PUBLIC_CHAIN_ID` = 4221
5. Deploy

### Step 3: Verify
- Open your Vercel URL
- Go to /dashboard
- Register a project
- Submit evidence
- Run AI evaluation
- Check verdict on Explorer: https://explorer-bradbury.genlayer.com

---

## Example Transactions

### Register a Project
project_id: "rwa-001"
name: "Green Tower Lagos"
description: "Mixed-use commercial real estate in Victoria Island, Lagos"
asset_type: "Real Estate"
country: "Nigeria"
evaluation_criteria: "Must maintain 90%+ occupancy, pass biannual structural inspections, generate $50k/month rental income"
expected_performance: "95% occupancy, quarterly inspection pass, $55k monthly income"
insurance_threshold: 40

### Submit Evidence
project_id: "rwa-001"
evidence_type: "inspection_report"
content: "Q1 2026 structural inspection completed. Building rated Grade A. Fire systems fully operational. HVAC serviced."
source_url: ""

### Run Evaluation
project_id: "rwa-001"
Triggers AI Jury → decentralized consensus verdict

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Storage is inaccessible from non-deterministic blocks` | Never use `self.x` inside `gl.eq_principle.*` callbacks |
| `JSON parse error in verdict` | Contract has fallback handler — check raw_output field |
| Contract not found | Verify CONTRACT_ADDRESS env var is set correctly |
| Transaction pending too long | Normal for Bradbury — AI workloads take 30-90s |
| Web fetch fails in evidence | Contract catches this gracefully — evidence still stored |