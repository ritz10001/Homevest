# Homevest 🏡

AI-Powered Real Estate Platform for Homebuyers & Investors

Homevest is a Next.js application that provides personalized real estate insights using AI advisors. Whether you're a first-time homebuyer or a seasoned investor, Homevest helps you make smarter property decisions with data-driven analysis.

## Features

### Dual-Mode Experience

**Homebuyer Mode (Sarah AI)**
- Personalized affordability analysis based on income, debt, and savings
- 5-year cost projections (insurance, taxes, maintenance, HOA)
- Debt-to-income ratio calculations
- Budget compliance checking
- Neighborhood insights and property comparisons
- Interactive property map with filtering
- Real-time chat with Sarah for property questions

**Investor Mode (William AI)**
- Cash flow and ROI analysis
- Cap rate and DSCR calculations
- Airbnb potential assessment with tourism scoring
- 5-year investment projections
- Operating expense breakdowns
- Risk assessment and market intelligence
- Comparative property analysis

### Core Capabilities

- **AI-Powered Analysis**: Gemini 2.5 Flash integration for intelligent property insights
- **Firebase Authentication**: Secure Google sign-in with user profiles
- **Firestore Database**: Persistent storage for user preferences and property data
- **Solana NFT Minting**: Mint property analysis as NFTs on Solana blockchain
- **Interactive Maps**: Leaflet-based property visualization with clustering
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Framer Motion
- **Real-time Chat**: AI advisors (Sarah & William) for property questions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Animation**: Framer Motion
- **AI**: Google Gemini 2.5 Flash
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Blockchain**: Solana Web3.js, Metaplex
- **Maps**: Leaflet, React Leaflet
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Firebase project with Firestore enabled
- Google Gemini API key
- Solana wallet (for NFT features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd homevest

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# NFT Storage (optional)
NFT_STORAGE_API_KEY=your_nft_storage_key
```

### Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
homevest/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── analyze-property/
│   │   │   ├── chat/
│   │   │   ├── compare-properties/
│   │   │   └── mint-property-nft/
│   │   ├── auth/              # Authentication pages
│   │   ├── homebuyer/         # Homebuyer mode pages
│   │   └── investor/          # Investor mode pages
│   ├── components/            # React components
│   │   ├── homebuyer/        # Homebuyer-specific components
│   │   ├── investor/         # Investor-specific components
│   │   ├── landing/          # Landing page components
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/                  # Utility libraries
│   │   ├── aiAnalysis.ts     # AI analysis engine
│   │   ├── investorAnalysis.ts # Investor-specific analysis
│   │   ├── propertyAnalysis.ts # Property analysis utilities
│   │   ├── dataStorage.ts    # Firestore operations
│   │   ├── firebase.ts       # Firebase configuration
│   │   └── solana.ts         # Solana/NFT utilities
│   └── assets/               # Static assets
├── public/                   # Public static files
│   └── data/                # Sample property data
├── data/                    # Additional data files
└── important-data/          # Saved analyses and comparisons
```

## Key Features Explained

### AI Advisors

**Sarah (Homebuyer Advisor)**
- Analyzes affordability based on user's financial profile
- Calculates DTI ratios and monthly payments
- Projects 5-year costs including taxes, insurance, maintenance
- Provides personalized recommendations and warnings
- Considers risk tolerance and time horizon

**William (Investor Advisor)**
- Evaluates investment potential with ROI metrics
- Calculates cash flow, cap rate, and DSCR
- Assesses Airbnb potential with tourism scoring
- Projects 5-year returns and appreciation
- Provides market intelligence and risk assessment

### Property Analysis

The analysis system uses Google Gemini AI to generate comprehensive insights:

1. **Financial Breakdown**: Down payment, closing costs, monthly payments
2. **Income Analysis**: DTI ratios, after-housing income
3. **5-Year Projections**: Insurance, taxes, maintenance, HOA fees
4. **Market Intelligence**: Price comparisons, days on market
5. **Risk Assessment**: Financial, market, and liquidity risks
6. **Personalized Recommendations**: Negotiation strategies, financing options

### NFT Minting

Properties can be minted as NFTs on Solana:
- Stores property analysis metadata on-chain
- Uses Metaplex for NFT creation
- Supports devnet and mainnet
- Viewable on Solana Explorer

## API Routes

- `POST /api/analyze-property` - Generate AI property analysis
- `POST /api/chat` - Chat with AI advisors
- `POST /api/compare-properties` - Compare multiple properties
- `POST /api/mint-property-nft` - Mint property as NFT
- `POST /api/save-property-data` - Save analysis to Firestore
- `GET /api/get-user-profile` - Fetch user profile

## User Flows

### Homebuyer Journey

1. Sign in with Google
2. Complete onboarding (income, debt, savings, preferences)
3. Search properties on interactive map
4. View AI-powered analysis from Sarah
5. Compare multiple properties
6. Chat with Sarah for questions
7. Save favorite properties
8. Mint property analysis as NFT (optional)

### Investor Journey

1. Sign in with Google
2. Complete investor onboarding (capital, ROI targets, risk tolerance)
3. Search investment properties
4. View William's investment analysis
5. Assess Airbnb potential
6. Compare ROI across properties
7. Export analysis reports
8. Mint investment analysis as NFT (optional)

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ModeSelector.test.tsx

# Run with coverage
npm test -- --coverage
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Ensure all environment variables are set in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Google Gemini for AI capabilities
- Firebase for authentication and database
- Solana for blockchain infrastructure
- Zillow for property data inspiration
- shadcn/ui for beautiful components

## Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using Next.js and AI
