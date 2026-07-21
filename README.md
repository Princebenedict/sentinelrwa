# SentinelRWA

**AI-Powered Real-World Asset Verification & Intelligence, built on GenLayer**

SentinelRWA is a decentralized platform that verifies and monitors real-world assets using GenLayer's AI validator consensus. Instead of rigid price oracles, it asks decentralized AI validators to research open-web evidence, judge the credibility of an asset claim, and reach consensus, all recorded on-chain.

Live on GenLayer Bradbury Testnet.
**Live demo:** https://sentinelrwa-7px4.vercel.app 
NEXT_PUBLIC_CONTRACT_ADDRESS=0xeBdBc3B18e96d7067315733eAcf922919010D07a
---

## The Problem

Traditional smart contracts are blind to the real world. They can push a price feed, but they cannot judge whether a building is actually occupied, whether a harvest failed, or whether an ownership claim is genuine. This creates fraud risk in tokenized real-world assets, slow parametric insurance, and trust gaps for fractional investors.

## The Solution

SentinelRWA uses GenLayer Intelligent Contracts to bring subjective, evidence-based judgment on-chain:

- **Ask in plain language.** "Is this property genuinely owned and as described?"
- **Evidence-based consensus.** AI validators independently assess submitted documents, reports, and URLs, then agree on a verdict.
- **Strict, fraud-resistant scoring.** Assets start UNVERIFIED at a score of 0. Without ownership proof and verifiable evidence, they cannot reach a high score. High scores are reserved for claims backed by multiple independent proofs.
- **Fully on-chain trail.** Every verdict, score, reasoning, and piece of evidence is stored permanently.

---

## Key Features

- **AI Verification Jury** — GenLayer validators reach consensus on subjective asset conditions using `gl.eq_principle.prompt_non_comparative`
- **Strict Trust Scoring** — deliberately hard scoring with mandatory deductions for missing ownership proof, location, or third-party verification
- **Verification Status** — every asset is labeled VERIFIED, PARTIALLY_VERIFIED, UNVERIFIED, or SUSPICIOUS
- **Required KYC-style Fields** — physical address, lister contact, and ownership-proof document are captured at registration
- **Evidence Submission** — stakeholders add reports, data, and source URLs the AI evaluates
- **Insurance Logic** — automatic threshold monitoring flags assets for review or claim eligibility
- **Owner Admin Panel** — the contract owner can remove listings, gated to the deploying wallet
- **Wallet Connect** — MetaMask signing (no private keys handled in-app)
- **Live Dashboard** — trust scores, star ratings, asset distribution, and an on-chain activity feed

---

## Tech Stack

- **Smart Contract:** Python Intelligent Contract on GenLayer
- **Network:** GenLayer Bradbury Testnet
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **SDK:** genlayer-js
- **Charts:** Recharts
- **Wallet:** MetaMask via injected provider
- **Deployment:** Vercel

---

## How It Works

1. **Onboard the asset** — details, address, price, ownership proof, and insurance terms are encoded into the Intelligent Contract. The asset starts UNVERIFIED.
2. **Submit evidence** — anyone adds documents, reports, or verifiable links.
3. **AI jury evaluates** — GenLayer validators independently research and score the evidence, strictly, with reasoning.
4. **Verdict on-chain** — the result updates the trust score, verification status, and can trigger an insurance review.

---

## Project Structure
SentinelRWA/
├── contracts/
│   └── sentinel_rwa.py          # GenLayer Intelligent Contract
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── dashboard/        # Asset dashboard
│   │   │   ├── project/[id]/     # Asset detail & verification
│   │   │   └── admin/            # Owner-only admin panel
│   │   ├── components/           # UI components
│   │   ├── hooks/                # useContract, useWallet
│   │   └── lib/                  # genlayer client, types
│   └── .env                      # NEXT_PUBLIC_CONTRACT_ADDRESS
└── README.md


---

## Getting Started

### 1. Deploy the Contract

1. Open [GenLayer Studio](https://studio.genlayer.com) on Bradbury Testnet
2. Paste the contents of `contracts/sentinel_rwa.py`
3. Ensure the first line is the `# { "Depends": "py-genlayer:..." }` header
4. Click **Deploy new instance** and copy the contract address

### 2. Run the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

Then:

```bash
npm run dev
```

Open http://localhost:3000

### 3. Deploy to Vercel

1. Push the repo to GitHub
2. Import it on Vercel with **Root Directory** set to `frontend`
3. Add the environment variable `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. Deploy

---

## Usage

1. **Connect Wallet** — MetaMask on Bradbury Testnet (fund it via the [GenLayer faucet](https://testnet-faucet.genlayer.foundation/))
2. **Register an Asset** — fill in the required fields, including physical address, contact, and ownership proof
3. **Submit Evidence** — add verifiable documentation
4. **Run AI Verification** — GenLayer validators score the claim (takes 30–90 seconds)
5. **Review the Verdict** — trust score, verification status, risk level, and AI reasoning appear on-chain

---

## Scoring Philosophy

SentinelRWA is designed to protect investors from fraud. Scoring is strict by default:

- No ownership proof caps the score at 35
- No verifiable location caps the score at 40
- Unverified self-reported claims are penalized
- Scores of 90–100 require multiple independent, verifiable proofs and are rare
- A brand-new text-only listing typically scores 20–40

The rating criteria are hardcoded in the contract and cannot be edited by listers, so the process cannot be gamed.

---

## A Note on Verification

SentinelRWA's AI jury assesses the *credibility of a claim* based on submitted evidence. It does not replace licensed legal or KYC infrastructure. Full real-world ownership verification requires off-chain custodians, legal wrappers, and licensed identity providers. This platform demonstrates how AI consensus can strengthen and automate the evidence-assessment layer of that process.

---

## Built With GenLayer

This project uses GenLayer's core innovation, Intelligent Contracts with AI validator consensus, to solve a problem traditional smart contracts cannot: bringing objective, on-chain agreement to subjective real-world conditions.

Learn more at [docs.genlayer.com](https://docs.genlayer.com)
EOFREADME
echo "DONE README"


To publish it to GitHub
cd /mnt/c/Users/user/OneDrive/Desktop/SentinelRWA
git add README.md
git commit -m "Add project README"
git push origin main



## Deployed Contract

Live on GenLayer Bradbury Testnet: `0x9f4cDBa7b37de2ca6EC5FFA8b93B6A63e960404b`
