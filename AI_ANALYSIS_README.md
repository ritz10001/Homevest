# AI-Powered Property Analysis - Simple & Clean

## Overview
This system uses **Gemini AI** to generate comprehensive property insights by feeding it user data from Firestore and property data from JSON.

## How It Works

### 1. **User Views Property**
- User double-clicks property on map
- Navigates to `/homebuyer/property/[id]`

### 2. **Data Collection**
```typescript
// Fetch property data from JSON
const property = await fetch('/data/houston_housing_market_2024_100.json');

// Fetch user profile from Firestore
const userProfile = await getUserProfile(user.uid);
```

### 3. **AI Analysis**
```typescript
// Call Gemini AI with both datasets
const insights = await generateAIAnalysis(propertyData, userData);
```

### 4. **Display Results**
- Affordability Score (0-100)
- Key Insights with emojis
- Warnings and considerations
- Financial breakdown
- Investment analysis
- Negotiation advice
- Sarah's personalized message

## System Prompt

The AI is given a comprehensive system prompt that defines:
- **Role**: Sarah, expert home buying advisor
- **Expertise**: Real estate, mortgages, finance
- **Personality**: Warm, supportive, clear
- **Analysis Framework**: 7-step process
- **Output Format**: Structured JSON

## Data Flow

```
User Profile (Firestore)          Property Data (JSON)
        ↓                                  ↓
        └──────────→ Gemini AI ←──────────┘
                         ↓
                  AI Insights (JSON)
                         ↓
                  Display on Page
```

## Input Data

### User Profile
```typescript
{
  displayName: "Ritvik Prakash",
  annualIncome: 100000,
  monthlyDebt: 1000,
  availableSavings: 50000,
  maxMonthlyBudget: 2000,
  downPayment: 2000,
  interestRate: 7,
  loanTerm: 30,
  includePMI: true,
  creditScore: "good",
  riskComfort: "balanced",
  timeHorizon: "10+"
}
```

### Property Data
```typescript
{
  zpid: "305340899",
  price: 450000,
  address: "13234 Vallentine Row Dr, Houston, TX 77044",
  beds: 4,
  baths: 3,
  area: 1943,
  homeType: "SINGLE_FAMILY",
  daysOnZillow: 18,
  zestimate: 439700,
  rentZestimate: 2099,
  taxAssessedValue: 244880,
  lotAreaValue: 6769.224,
  brokerName: "Realty Associates"
}
```

## Output Structure

```typescript
{
  affordabilityScore: 65,
  affordabilityLevel: "Stretch",
  monthlyPayment: 3245,
  dtiRatio: 42.5,
  advisorMessage: "This home is a stretch but manageable...",
  keyInsights: [
    "🎯 Great value! Property is 2.3% below Zestimate",
    "⚡ Hot property! Moving faster than average"
  ],
  warnings: [
    "⚠️ Monthly payment exceeds your budget by $1,245"
  ],
  financialBreakdown: {
    downPaymentNeeded: 90000,
    closingCosts: 13500,
    totalCashNeeded: 103500,
    monthsToSave: 3
  },
  investmentAnalysis: {
    roiPotential: "Strong 12.5% ROI potential",
    appreciationForecast: "Expected 3-5% annual growth",
    priceVsZestimate: "Fair price, 2.3% below Zestimate"
  },
  negotiationAdvice: {
    suggestedOffer: 441000,
    tactics: [
      "Request seller concessions for closing costs",
      "Ask for home warranty"
    ]
  }
}
```

## Files

### Core Files
- `src/lib/aiAnalysis.ts` - Main AI analysis function
- `src/lib/userProfile.ts` - Fetch user from Firestore
- `src/app/homebuyer/property/[id]/page.tsx` - Property details page

### Key Functions

#### `generateAIAnalysis(property, user)`
- Takes property data + user data
- Sends to Gemini AI with system prompt
- Returns structured insights

#### `getUserProfile(uid)`
- Fetches user profile from Firestore
- Returns UserProfile object

## Usage Example

```typescript
// In property details page
const { user } = useAuth();
const [aiInsights, setAiInsights] = useState(null);

useEffect(() => {
  async function analyze() {
    // Get user profile
    const userProfile = await getUserProfile(user.uid);
    
    // Prepare property data
    const propertyData = {
      zpid: property.zpid,
      price: property.price,
      address: property.address,
      beds: property.bedrooms,
      baths: property.bathrooms,
      area: property.sqft,
      // ... other fields
    };
    
    // Generate AI insights
    const insights = await generateAIAnalysis(propertyData, userProfile);
    setAiInsights(insights);
  }
  
  analyze();
}, [user, property]);

// Display
return (
  <div>
    {aiInsights && (
      <div>
        <h2>Affordability Score: {aiInsights.affordabilityScore}/100</h2>
        <p>{aiInsights.advisorMessage}</p>
        {/* ... more insights */}
      </div>
    )}
  </div>
);
```

## Benefits

✅ **Simple**: No complex calculations in code  
✅ **Flexible**: AI adapts to any property/user combination  
✅ **Personalized**: Uses actual user data from Firestore  
✅ **Comprehensive**: Covers all aspects of home buying  
✅ **Natural**: AI generates human-like advice  
✅ **Maintainable**: Easy to update prompts  

## API Key

Gemini API Key: `AIzaSyC0r9i88EVwzQL5T-py52ycE4F-4I02M_o`  
Stored in: `.env.local` as `GEMINI_API_KEY`

## Testing

1. Navigate to property details page
2. Ensure user is logged in
3. AI analysis runs automatically
4. Results display below property info

## Next Steps

1. ✅ Basic AI analysis working
2. 🔄 Add chat integration (use same context)
3. 🔄 Add comparison with other properties
4. 🔄 Add saved analyses history
5. 🔄 Add PDF report generation

---

**That's it!** Simple, clean, AI-powered property analysis. 🚀
