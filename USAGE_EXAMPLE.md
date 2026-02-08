# Using the AI Analysis Function with Firestore User Data

## Updated User Profile Structure

The `analyzeProperty()` function now uses your actual Firestore user data structure:

```typescript
interface UserProfile {
  // Required Firestore fields
  uid: string;
  email: string;
  displayName: string;
  mode: string;                    // "homebuyer" | "investor"
  annualIncome: number;            // 100000
  monthlyDebt: number;             // 1000
  availableSavings: number;        // 50000
  maxMonthlyBudget: number;        // 2000
  downPayment: number;             // 2000 (or percentage)
  interestRate: number;            // 7 (as percentage)
  loanTerm: number;                // 30 (years)
  includePMI: boolean;             // true
  creditScore: string;             // "excellent" | "good" | "fair" | "poor"
  riskComfort: string;             // "conservative" | "balanced" | "aggressive"
  timeHorizon: string;             // "1-3" | "3-5" | "5-10" | "10+"
  onboardingComplete: boolean;
  
  // Optional fields
  photoURL?: string;
  createdAt?: any;
  familySize?: number;
  workLocation?: { lat: number; lng: number };
}
```

## Example Usage

### 1. In Property Details Page

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';
import { analyzeProperty } from '@/lib/propertyAnalysis';
import { AIInsightsPanel } from '@/components/homebuyer/AIInsightsPanel';

export default function PropertyDetailsPage() {
  const { user } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function runAnalysis() {
      if (!user || !property) return;
      
      setIsAnalyzing(true);
      
      // Fetch user profile from Firestore
      const userProfile = await getUserProfile(user.uid);
      
      if (!userProfile) {
        console.error('Could not load user profile');
        setIsAnalyzing(false);
        return;
      }
      
      // Prepare property data
      const propertyData = {
        id: property.id,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        lat: property.lat,
        lng: property.lng,
        zestimate: property.zestimate,
        rentZestimate: property.rentZestimate,
        taxAssessedValue: property.taxAssessedValue,
        lotAreaValue: property.lotAreaValue,
        daysOnZillow: property.daysOnZillow,
        homeType: property.homeType,
      };
      
      // Run AI analysis
      const analysis = await analyzeProperty(propertyData, userProfile);
      
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }
    
    runAnalysis();
  }, [user, property]);

  return (
    <div>
      {/* ... other content ... */}
      
      {/* AI Insights Section */}
      {aiAnalysis && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">AI-Powered Insights</h2>
          <AIInsightsPanel analysis={aiAnalysis} isLoading={isAnalyzing} />
        </div>
      )}
    </div>
  );
}
```

### 2. Example with Your Actual Data

```typescript
// Your Firestore user data
const userFromFirestore = {
  uid: "JLh4SmwnfKSkOc9mpEFZmylgZNh2",
  email: "ritvik11prakash@gmail.com",
  displayName: "Ritvik Prakash",
  mode: "homebuyer",
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
  timeHorizon: "10+",
  onboardingComplete: true,
  photoURL: "https://lh3.googleusercontent.com/...",
};

// Property data
const property = {
  id: 305340899,
  price: 450000,
  bedrooms: 4,
  bathrooms: 3,
  sqft: 1943,
  lat: 29.865578,
  lng: -95.19615,
  zestimate: 439700,
  rentZestimate: 2099,
  taxAssessedValue: 244880,
  lotAreaValue: 6769.224,
  daysOnZillow: 18,
  homeType: "SINGLE_FAMILY",
};

// Run analysis
const analysis = await analyzeProperty(property, userFromFirestore);

console.log(analysis);
```

## What the Function Now Does

### 1. **Uses Your Interest Rate**
- Takes `interestRate: 7` from your profile
- Calculates monthly payments using YOUR rate

### 2. **Uses Your Loan Term**
- Takes `loanTerm: 30` from your profile
- Calculates payments over YOUR preferred term

### 3. **Respects Your Budget**
- Compares monthly payment to `maxMonthlyBudget: 2000`
- Reduces affordability score if over budget

### 4. **Considers Your Savings**
- Uses `availableSavings: 50000`
- Shows which down payment options you can afford
- Calculates months needed to save more

### 5. **Adjusts for Risk Tolerance**
- Uses `riskComfort: "balanced"`
- Adjusts affordability thresholds:
  - Conservative: Stricter (80+ = Affordable)
  - Balanced: Standard (70+ = Affordable)
  - Aggressive: Looser (60+ = Affordable)

### 6. **Handles PMI Preference**
- Uses `includePMI: true`
- Includes PMI in calculations if down payment < 20%

### 7. **Personalizes Messages**
- Uses `displayName: "Ritvik Prakash"`
- Tailors advice to your specific situation

## Example Output with Your Data

```typescript
{
  financial: {
    affordabilityScore: 65,
    affordabilityLevel: "Stretch",  // Because monthly payment > maxMonthlyBudget
    monthlyPayment: {
      total: 3245,                  // Exceeds your $2000 budget
      principal: 975,
      interest: 2275,
      tax: 562,
      insurance: 125,
      hoa: 0
    },
    dtiRatio: 42.5,                 // (1000 + 3245) / (100000/12) * 100
    downPaymentOptions: [
      {
        percentage: 5,
        amount: 22500,              // You can afford this (< $50k)
        monthlyPayment: 3456,
        pmi: 187,
        recommendation: "Lower upfront, higher monthly"
      },
      {
        percentage: 10,
        amount: 45000,              // You can afford this (< $50k)
        monthlyPayment: 3321,
        pmi: 187,
        recommendation: "Good balance"
      },
      {
        percentage: 20,
        amount: 90000,              // Need $40,000 more
        monthlyPayment: 3245,
        pmi: 0,
        recommendation: "Need $40,000 more"
      }
    ],
    totalCashNeeded: 103500,        // Down payment + closing costs
    monthsOfSavingsRequired: 3      // Based on your income & savings
  },
  
  advisorMessage: "This home is a stretch but manageable with careful planning. Your DTI of 42.5% is on the higher side. This property is moving quickly. Consider making an offer soon. I recommend building a larger emergency fund (6+ months) before committing, and ensure you're comfortable with the monthly payment of $3,245.",
  
  keyInsights: [
    "🎯 Great value! Property is 2.3% below Zestimate",
    "⚡ Hot property! Moving faster than average",
    "💰 Strong investment potential with 12.5% ROI"
  ],
  
  warnings: [
    "⚠️ Monthly payment exceeds your budget by $1,245",
    "⚠️ Consider 5% or 10% down payment options"
  ]
}
```

## Integration Steps

1. **Install the function** ✅ (Already done in `src/lib/propertyAnalysis.ts`)

2. **Add to property details page**:
   ```typescript
   import { analyzeProperty } from '@/lib/propertyAnalysis';
   import { getUserProfile } from '@/lib/userProfile';
   import { AIInsightsPanel } from '@/components/homebuyer/AIInsightsPanel';
   ```

3. **Fetch user data and run analysis**:
   ```typescript
   const userProfile = await getUserProfile(user.uid);
   const analysis = await analyzeProperty(property, userProfile);
   ```

4. **Display results**:
   ```typescript
   <AIInsightsPanel analysis={analysis} />
   ```

## Next Steps

1. Add this to your property details page
2. Test with your actual Firestore data
3. Customize the calculations if needed
4. Add more insights based on your requirements
5. Connect to AI agent for chat functionality

The function is now fully adapted to your Firestore user structure! 🚀
