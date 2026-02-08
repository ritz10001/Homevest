# Property Comparison Feature Guide

## Overview
The Property Comparison feature allows first-time homebuyers to select 2-3 properties and get AI-powered analysis from DeepSeek (via Featherless API) to determine which property is the best fit based on their financial situation and goals.

## Features

### 1. Comparison Mode Toggle
- **Location**: Top-right corner of the map page
- **Button**: "Compare" / "Exit Compare"
- **Functionality**: Activates comparison mode where users can select properties

### 2. Property Selection
- **How it works**: Click on property markers on the map
- **Limit**: 2-3 properties maximum
- **Visual feedback**: 
  - Selected properties show green markers with checkmarks
  - Non-selected properties disappear from view
  - Map automatically centers between selected properties

### 3. AI-Powered Comparison Analysis
- **Powered by**: DeepSeek V3 via Featherless API
- **Analysis includes**:
  - **Recommendation**: Which property is best and why
  - **Confidence Level**: High/Medium/Low
  - **Executive Summary**: 3-4 sentence overview
  - **Detailed Comparison**:
    - Affordability comparison
    - Value analysis
    - Long-term costs (5-year projections)
    - Investment potential
  - **Property Breakdown**: Pros/cons for each property with scores
  - **Key Decision Factors**: Most important considerations
  - **Next Steps**: Actionable recommendations

### 4. Split-Screen UI
- **Left Side**: Map showing only selected properties
- **Right Side**: Comparison analysis panel
- **Responsive**: Panel slides in from right with smooth animation

### 5. Download Report
- **Format**: JSON file
- **Contents**: 
  - User profile data
  - All property details
  - Complete AI analysis
  - Timestamp
- **Filename**: `property-comparison-YYYY-MM-DD.json`

### 6. Follow-Up Chat (Future Enhancement)
- **API Ready**: `/api/comparison-chat`
- **Capabilities**:
  - Answer follow-up questions
  - Run "what-if" scenarios with changed variables
  - Provide negotiation strategies
  - Explain investment opportunities
  - Recalculate with different down payments, interest rates, etc.

## Technical Implementation

### API Endpoints

#### 1. `/api/compare-properties` (POST)
Generates comprehensive comparison analysis.

**Request Body:**
```json
{
  "userData": {
    "displayName": "string",
    "annualIncome": number,
    "monthlyDebt": number,
    "availableSavings": number,
    "maxMonthlyBudget": number,
    "downPayment": number,
    "interestRate": number,
    "creditScore": "string",
    "riskComfort": "string",
    "timeHorizon": "string"
  },
  "properties": [
    {
      "propertyData": { /* property details */ },
      "aiInsights": { /* AI analysis from initial property view */ }
    }
  ]
}
```

**Response:**
```json
{
  "recommendation": {
    "bestProperty": "zpid",
    "reason": "string",
    "confidenceLevel": "High" | "Medium" | "Low"
  },
  "summary": "string",
  "detailedComparison": { /* detailed metrics */ },
  "propertyBreakdown": [ /* pros/cons for each */ ],
  "keyFactors": [ /* decision factors */ ],
  "nextSteps": [ /* action items */ ]
}
```

#### 2. `/api/comparison-chat` (POST)
Handles follow-up questions and scenario analysis.

**Request Body:**
```json
{
  "message": "string",
  "conversationHistory": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ],
  "context": {
    "userData": { /* user profile */ },
    "properties": [ /* property details */ ],
    "comparisonAnalysis": { /* initial analysis */ }
  }
}
```

**Response:**
```json
{
  "reply": "string"
}
```

### Components

#### 1. `PropertyMapComparison.tsx`
Enhanced map component with comparison mode support:
- Shows only selected properties in comparison mode
- Visual indicators for selected properties (green with checkmarks)
- Auto-centers map between selected properties
- Handles property selection clicks

#### 2. Map Page Updates
- Comparison mode state management
- Property selection logic (max 3)
- Split-screen layout
- Analysis panel with results display
- Download report functionality

### Environment Variables

```env
# Featherless API Key (provides access to DeepSeek models)
FEATHERLESS_API_KEY=your_featherless_api_key_here
```

## User Flow

1. **Activate Comparison Mode**
   - User clicks "Compare" button in top-right corner
   - Map enters comparison mode
   - Instructions appear: "Select 2-3 properties to compare"

2. **Select Properties**
   - User clicks on 2-3 property markers
   - Selected properties turn green with checkmarks
   - Other properties disappear from view
   - Map centers between selected properties

3. **Run Comparison**
   - "Compare X Properties" button appears at bottom
   - User clicks to generate analysis
   - Loading state shows "Analyzing properties with AI..."

4. **View Results**
   - Right panel slides in with analysis
   - Shows recommendation, summary, detailed comparison
   - Property breakdown with pros/cons
   - Key factors and next steps

5. **Download Report** (Optional)
   - User clicks "Download Report" button
   - JSON file downloads with complete analysis

6. **Exit Comparison**
   - User clicks "Exit Compare" button
   - Returns to normal map view
   - All properties visible again

## DeepSeek System Prompt

The comparison uses a comprehensive system prompt that instructs DeepSeek to:
- Analyze properties from a first-time homebuyer perspective
- Consider affordability, value, long-term costs, and investment potential
- Provide clear recommendations with confidence levels
- List specific pros/cons for each property
- Identify key decision factors
- Suggest actionable next steps

See `DEEPSEEK_SYSTEM_PROMPT.md` for the complete prompt used for follow-up chat.

## Data Flow

```
User Selects Properties
    ↓
Fetch AI Insights for Each Property (if not already loaded)
    ↓
Call /api/compare-properties with:
    - User financial profile
    - Property details
    - AI insights for each property
    ↓
DeepSeek (via Featherless) analyzes and compares
    ↓
Return structured comparison analysis
    ↓
Display in right panel
    ↓
User can download report or ask follow-up questions
```

## Future Enhancements

### 1. Interactive Chat Interface
Add a chat UI in the comparison panel for follow-up questions:
- "What if I put down 20% instead?"
- "How does this compare if interest rates drop?"
- "What's the negotiation strategy for Property 1?"

### 2. Scenario Comparison
Allow users to compare different financial scenarios:
- Different down payment amounts
- Various interest rates
- Income changes
- Rental income scenarios

### 3. Visual Charts
Add charts and graphs:
- Monthly payment comparison bar chart
- 5-year cost projection line chart
- Affordability score comparison
- ROI comparison for investment potential

### 4. Save Comparisons
Allow users to save comparison analyses to their profile:
- View comparison history
- Track properties over time
- Share comparisons with family/advisors

### 5. Email Report
Generate and email a formatted PDF report:
- Professional layout
- Charts and visualizations
- Detailed analysis
- Personalized recommendations

## Testing

### Test Scenarios

1. **Basic Comparison**
   - Select 2 properties
   - Verify analysis generates correctly
   - Check recommendation makes sense

2. **Maximum Selection**
   - Select 3 properties
   - Verify 4th property cannot be selected
   - Check analysis handles 3 properties

3. **Different Property Types**
   - Compare properties with different prices
   - Compare different sizes (beds/baths/sqft)
   - Verify analysis considers differences

4. **Edge Cases**
   - Properties with missing data
   - Very expensive vs affordable properties
   - Properties in different neighborhoods

5. **Download Report**
   - Verify JSON file downloads
   - Check all data is included
   - Validate JSON structure

## Troubleshooting

### Issue: "Featherless API key not configured"
**Solution**: Add `FEATHERLESS_API_KEY` to `.env.local` file

### Issue: Analysis fails to generate
**Solution**: 
- Check Featherless API key is valid
- Verify API quota/limits
- Check browser console for errors
- Ensure user is logged in

### Issue: Properties don't appear selected
**Solution**:
- Verify `zpid` exists for properties
- Check `selectedForComparison` state
- Ensure PropertyMapComparison component is being used

### Issue: Map doesn't center correctly
**Solution**:
- Verify lat/lng coordinates are valid
- Check `mapCenter` calculation
- Ensure at least 2 properties are selected

## API Rate Limits

Featherless API limits (check current plan):
- Requests per minute
- Tokens per request
- Monthly quota

Consider implementing:
- Request caching
- Rate limiting on frontend
- Error handling for quota exceeded

## Security Considerations

- API key stored in environment variables (server-side only)
- User data validated before sending to API
- Sanitize user inputs
- Rate limiting to prevent abuse
- Error messages don't expose sensitive info
