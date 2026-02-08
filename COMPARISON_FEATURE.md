# Property Comparison Feature

## Overview
Implemented a property comparison feature that allows first-time homebuyers to select 2-3 properties and compare their details, AI insights, and financial analysis side-by-side.

## Features

### 1. Compare Mode Toggle
- **Location**: Next to search bar on map page
- **Button**: "Compare" / "Comparing" toggle button with GitCompare icon
- **States**:
  - OFF (default): Normal property browsing mode
  - ON: Comparison selection mode

### 2. Property Selection
- **Max Selection**: 2-3 properties
- **Visual Feedback**:
  - Selected properties show green markers on map
  - Selected property cards appear at bottom of screen
  - Each card shows: price, address, beds, baths, sqft
  - Remove button (X) on each card

### 3. Compare Mode Banner
- Appears when compare mode is ON
- Shows selection count (X/3 selected)
- "Compare Now" button appears when 2+ properties selected
- Loading state while fetching data

## Data Collection Process (Step-by-Step)

When "Compare Now" is clicked, the system follows these steps:

### Step 1: Load User Data from Firebase
```
🔍 Loading user data from Firebase...
  ↓
Fetch user profile from Firestore using user UID
  ↓
Extract: income, debt, savings, budget, loan preferences, credit score, etc.
  ↓
✅ User data loaded
```

### Step 2: Process Each Property Sequentially
For each selected property (1, 2, or 3):

```
📊 Processing Property 1/3...
  ↓
Load full property data from houston_housing_market_2024_100.json
  ↓
Extract: address, price, beds, baths, sqft, zestimate, taxes, etc.
  ↓
✅ Property data loaded
  ↓
🤖 Generating AI insights...
  ↓
Call /api/analyze-property with property + user data
  ↓
AI generates: affordability, monthly payment, 5-year projections, insights
  ↓
✅ AI insights generated
  ↓
Combine: propertyData + aiInsights
  ↓
Repeat for next property...
```

### Step 3: Save All Data
```
💾 Saving comparison data...
  ↓
Combine: userData + all properties (with AI insights)
  ↓
Save to Important Data/comparison_data.json
  ↓
✅ Comparison data saved successfully!
```

### Console Output Example:
```
🔍 Step 1: Loading user data from Firebase...
✅ User data loaded: { displayName: "John Doe", annualIncome: 100000, ... }

🏠 Step 2: Processing properties and generating AI insights...

📊 Processing Property 1/3: 123 Main St, Houston, TX
✅ Property data loaded for: 123 Main St, Houston, TX
🤖 Generating AI insights for Property 1...
✅ AI insights generated for Property 1

📊 Processing Property 2/3: 456 Oak Ave, Houston, TX
✅ Property data loaded for: 456 Oak Ave, Houston, TX
🤖 Generating AI insights for Property 2...
✅ AI insights generated for Property 2

📊 Processing Property 3/3: 789 Pine Rd, Houston, TX
✅ Property data loaded for: 789 Pine Rd, Houston, TX
🤖 Generating AI insights for Property 3...
✅ AI insights generated for Property 3

💾 Step 4: Saving comparison data...
✅ Comparison data saved successfully!
```

### 5. Data Storage
All comparison data is saved to:
```
Important Data/comparison_data.json
```

**File Structure:**
```json
{
  "timestamp": "2024-02-08T12:34:56.789Z",
  "userData": {
    "uid": "user123",
    "displayName": "John Doe",
    "email": "john@example.com",
    "annualIncome": 100000,
    "monthlyDebt": 1000,
    "availableSavings": 50000,
    "maxMonthlyBudget": 2000,
    "downPayment": 20000,
    "interestRate": 7,
    "loanTerm": 30,
    "includePMI": true,
    "creditScore": "good",
    "riskComfort": "balanced",
    "timeHorizon": "10+"
  },
  "propertyCount": 3,
  "properties": [
    {
      "propertyData": {
        "zpid": "112154571",
        "address": "123 Main St, Houston, TX 77001",
        "price": 400000,
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 2000,
        "zestimate": 385000,
        "rentZestimate": 2500,
        ...
      },
      "aiInsights": {
        "affordabilityScore": 75,
        "affordabilityLevel": "Affordable",
        "monthlyPayment": 2456,
        "dtiRatio": 28,
        "keyInsights": [...],
        "warnings": [...],
        "financialBreakdown": {...},
        "incomeBreakdown": {...},
        "insuranceBreakdown": {...},
        "propertyTaxBreakdown": {...},
        "hoaFeesBreakdown": {...},
        "maintenanceBreakdown": {...},
        "advisorMessage": "..."
      }
    },
    {
      "propertyData": { ... },
      "aiInsights": { ... }
    },
    {
      "propertyData": { ... },
      "aiInsights": { ... }
    }
  ]
}
```

## User Flow

### Step 1: Enable Compare Mode
1. User clicks "Compare" button next to search bar
2. Button changes to "Comparing" (blue background)
3. Banner appears: "Select 2-3 properties to compare"

### Step 2: Select Properties
1. User clicks on property markers on map
2. Selected properties show green markers
3. Property cards appear at bottom of screen
4. User can select up to 3 properties
5. Alert shown if trying to select more than 3

### Step 3: Remove Properties (Optional)
1. Click X button on property card
2. Property is deselected
3. Marker returns to normal color

### Step 4: Compare
1. "Compare Now" button appears when 2+ properties selected
2. User clicks "Compare Now"
3. System shows loading state
4. Fetches user profile and runs AI analysis for each property
5. Saves all data to comparison_data.json
6. Shows success message

### Step 5: Exit Compare Mode
1. User clicks "Comparing" button to toggle off
2. All selections are cleared
3. Returns to normal browsing mode

## Technical Implementation

### Files Created/Modified

**New Files:**
- `src/app/api/save-comparison-data/route.ts` - API to save comparison data
- `src/app/api/get-user-profile/route.ts` - API to fetch user profile
- `COMPARISON_FEATURE.md` - This documentation

**Modified Files:**
- `src/app/homebuyer/map/page.tsx` - Added compare mode UI and logic
- `src/components/homebuyer/PropertyMap.tsx` - Added compare mode marker styling
- `.gitignore` - Excluded comparison_data.json

### State Management

**Map Page State:**
```typescript
const [compareMode, setCompareMode] = useState(false);
const [selectedForCompare, setSelectedForCompare] = useState<Property[]>([]);
const [isLoadingComparison, setIsLoadingComparison] = useState(false);
```

### API Endpoints

**POST /api/save-comparison-data**
- Saves comparison data to Important Data folder
- Input: `{ properties: [...] }`
- Output: `{ success: true, propertyCount: 3 }`

**GET /api/get-user-profile?uid={uid}**
- Fetches user profile from Firestore
- Input: User UID as query parameter
- Output: User profile object

**POST /api/analyze-property**
- Generates AI insights for a property
- Input: `{ propertyData, userData }`
- Output: AI insights object

### Visual Design

**Compare Mode Indicators:**
- 🔵 Blue button: Compare mode OFF
- 🟢 Green button: Compare mode ON
- 🟢 Green markers: Selected properties
- 🔵 Blue banner: Selection status
- ⚪ White cards: Selected property previews

**Responsive Layout:**
- Search bar + Compare button: Top center
- Banner: Below search bar
- Selected cards: Bottom left
- Property card (normal mode): Bottom center

## Data Flow (Step-by-Step)

```
User selects 2-3 properties on map
    ↓
Click "Compare Now"
    ↓
STEP 1: Fetch user profile from Firestore
    ↓
STEP 2: For Property 1:
    ├─ Load full property data from JSON
    ├─ Prepare data for AI
    ├─ Call /api/analyze-property
    ├─ Receive AI insights
    └─ Store: propertyData + aiInsights
    ↓
STEP 3: For Property 2:
    ├─ Load full property data from JSON
    ├─ Prepare data for AI
    ├─ Call /api/analyze-property
    ├─ Receive AI insights
    └─ Store: propertyData + aiInsights
    ↓
STEP 4: For Property 3 (if selected):
    ├─ Load full property data from JSON
    ├─ Prepare data for AI
    ├─ Call /api/analyze-property
    ├─ Receive AI insights
    └─ Store: propertyData + aiInsights
    ↓
STEP 5: Combine all data
    ├─ userData (once)
    └─ properties array (2-3 items with data + insights)
    ↓
STEP 6: Save to comparison_data.json
    ↓
✅ Show success message
```

### Key Points:
- User data is fetched **once** at the beginning
- Each property is processed **sequentially** (not in parallel)
- AI insights are generated **fresh** for each property
- Full property data is loaded from the original JSON file
- All data is combined and saved to a single JSON file

## Future Enhancements

### Phase 2 (Planned):
- [ ] Comparison view page (side-by-side comparison UI)
- [ ] Export comparison as PDF
- [ ] Share comparison via email/link
- [ ] Save multiple comparisons
- [ ] Comparison history

### Phase 3 (Planned):
- [ ] AI-powered comparison summary
- [ ] Highlight key differences
- [ ] Recommendation: "Best for you" based on user profile
- [ ] What-if scenarios in comparison view

## Testing

### Manual Test Steps:
1. Navigate to map page
2. Click "Compare" button
3. Select 2-3 properties by clicking markers
4. Verify green markers and bottom cards appear
5. Click "Compare Now"
6. Wait for loading to complete
7. Check `Important Data/comparison_data.json` exists
8. Verify file contains all property data
9. Toggle compare mode off
10. Verify selections are cleared

### Edge Cases Handled:
- ✅ Selecting more than 3 properties (shows alert)
- ✅ Comparing with less than 2 properties (shows alert)
- ✅ User not signed in (shows alert)
- ✅ API failures (shows error message)
- ✅ Toggling compare mode clears selections

## Notes

- Comparison data is temporary and stored locally
- Each new comparison overwrites the previous one
- User must be signed in to use comparison feature
- AI analysis runs fresh for each comparison (not cached)
- Maximum 3 properties to keep comparison manageable
