# Property Comparison View Feature

## Overview
A dedicated comparison view page that displays selected properties on a map (left side) and provides AI-powered analysis and recommendations through a chat interface (right side) using Sarah, the AI advisor.

## Features

### 1. Split-Screen Layout
- **Left Side (50%)**: Interactive map centered on selected properties
- **Right Side (50%)**: AI chat interface with analysis

### 2. Map View (Left Side)
- **Centered View**: Map automatically centers on the selected properties
- **Property Markers**: All compared properties shown with green markers
- **Property Cards**: Overlay cards at bottom showing:
  - Property number (1, 2, 3)
  - Price
  - Address
  - Beds/baths/sqft
  - Affordability score and level
  - Color-coded affordability indicator

### 3. AI Analysis Chat (Right Side)
- **Initial Analysis**: Automatically generated when page loads
- **Comprehensive Comparison**: Detailed analysis of all properties
- **Best Choice Recommendation**: Clear recommendation with reasoning
- **Follow-Up Questions**: Interactive chat for deeper insights
- **Conversation History**: Maintains context throughout session

### 4. Sarah's Analysis Capabilities

#### Initial Analysis Includes:
- **Overview**: Summary of all properties
- **Best Choice**: Clear recommendation with property address
- **Why This Property**: 3-5 key reasons with specific data
- **Financial Fit**: Monthly payment, affordability score, DTI, 5-year costs
- **Comparison Summary**: How it compares to other properties
- **Important Considerations**: Warnings and things to watch
- **Next Steps**: Actionable advice

#### Follow-Up Questions Can Cover:
- Specific property details
- Financial comparisons
- Investment potential
- Risk assessment
- Alternative scenarios
- Neighborhood insights
- Long-term value
- Trade-off analysis

### 5. Data Context Provided to AI

For each property, Sarah receives:
- **User Profile**: Income, debt, savings, budget, loan preferences
- **Property Details**: Address, price, size, zestimate, days on market
- **AI Insights**: Affordability score, monthly payment, DTI ratio
- **5-Year Projections**: Insurance, taxes, HOA, maintenance costs
- **Key Insights**: Important findings from initial analysis
- **Warnings**: Red flags or concerns

## User Flow

### Step 1: Navigate from Map
1. User selects 2-3 properties on map
2. Clicks "Compare Now"
3. System generates AI insights for each property
4. Saves comparison data
5. **Automatically navigates to comparison view**

### Step 2: View Initial Analysis
1. Page loads with map on left, chat on right
2. Map centers on selected properties
3. Property cards appear at bottom of map
4. Sarah generates initial analysis (loading indicator shown)
5. Comprehensive comparison appears in chat

### Step 3: Ask Follow-Up Questions
1. User types question in input field
2. Presses Enter or clicks Send button
3. Question appears in chat (blue bubble, right-aligned)
4. Sarah processes question with full context
5. Response appears in chat (white bubble, left-aligned)
6. Conversation continues with maintained context

### Step 4: Return to Map
1. User clicks "Back to Map" button
2. Returns to map view
3. Comparison data remains saved
4. Can start new comparison

## Technical Implementation

### Page Structure
```
/homebuyer/compare
├── Header (Back button, title, property count)
├── Main Content (flex layout)
│   ├── Left Side (50%)
│   │   ├── Map (full height)
│   │   └── Property Cards (overlay at bottom)
│   └── Right Side (50%)
│       ├── Chat Header (Sarah's info)
│       ├── Messages Area (scrollable)
│       └── Input Area (text input + send button)
```

### API Endpoints

**GET /api/get-comparison-data**
- Loads comparison data from `Important Data/comparison_data.json`
- Returns: Full comparison data with user profile and properties

**POST /api/compare-properties**
- Generates AI analysis using Featherless API
- Input: Comparison data, user message (optional), conversation history
- Output: AI-generated analysis text

### State Management
```typescript
const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [inputMessage, setInputMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [initialAnalysis, setInitialAnalysis] = useState<string>('');
```

### Message Format
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

### AI Integration
- **Model**: OpenAI GPT-4o-mini via Featherless API
- **System Prompt**: Comprehensive comparison analysis instructions
- **Context**: Full user profile + all property data + AI insights
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 2000 (detailed responses)

## System Prompt Highlights

Sarah is instructed to:
1. **Compare Comprehensively**: Analyze affordability, value, projections, features, risks
2. **Recommend Clearly**: Provide specific recommendation with data-backed reasoning
3. **Be Conversational**: Natural, friendly tone with specific numbers
4. **Structure Responses**: Use formatting (bold, bullets) for clarity
5. **Acknowledge Trade-offs**: Honest about pros and cons
6. **Provide Context**: Reference specific metrics from AI insights
7. **Encourage Questions**: Invite deeper exploration

## Example Interactions

### Initial Analysis Example:
```
🏆 Best Choice: 123 Main St, Houston, TX 77001

Why This Property:
- Best affordability score (85/100) fits comfortably in your budget
- Lowest DTI ratio (25%) leaves room for financial flexibility
- Excellent value: $50k below Zestimate
- Lowest 5-year ownership costs ($45,000 vs $52,000 and $58,000)

Financial Fit:
- Monthly Payment: $2,100
- Affordability Score: 85/100
- DTI Ratio: 25%
- Total 5-Year Cost: $45,000

Comparison Summary:
While Property 2 offers more space (2,200 sqft vs 2,000 sqft), 
it stretches your budget with a 32% DTI ratio. Property 3 is 
overpriced relative to its Zestimate and has the highest 
ownership costs.

Important Considerations:
⚠️ Property 1 has been on market for 45 days - good negotiation 
opportunity
✅ All three properties are in good neighborhoods with similar 
school ratings

Next Steps:
1. Schedule viewing for 123 Main St
2. Get pre-approval letter ready
3. Consider offering $5-10k below asking given days on market
```

### Follow-Up Question Example:
```
User: "What if I put 20% down instead of 10%?"

Sarah: Great question! Let's see how a 20% down payment changes 
things for Property 1 (123 Main St):

Current (10% down):
- Down Payment: $40,000
- Monthly Payment: $2,100
- DTI Ratio: 25%
- PMI: $150/month

With 20% down:
- Down Payment: $80,000
- Monthly Payment: $1,850 (saves $250/month!)
- DTI Ratio: 22%
- PMI: $0 (eliminated!)

Benefits:
✅ Save $3,000/year in payments
✅ Eliminate PMI completely
✅ Lower DTI gives you more financial cushion
✅ Save $90,000 in interest over 30 years

Trade-off:
⚠️ Uses $40,000 more of your savings upfront
⚠️ Leaves you with $10,000 in savings (vs $50,000)

My Recommendation:
If you can maintain at least 6 months of expenses in reserve 
after the 20% down payment, I'd strongly recommend it. The PMI 
elimination alone saves you $54,000 over the loan life.

Would you like me to run the numbers for 15% down as a middle 
ground?
```

## Visual Design

### Map Side
- Full-height map
- Green markers for all compared properties
- Property cards with:
  - White background with blur
  - Green border (2px)
  - Numbered badges (1, 2, 3)
  - Affordability color coding (green/orange/red)

### Chat Side
- Light gray background (#f9fafb)
- White message bubbles for Sarah
- Blue message bubbles for user
- Smooth scrolling
- Auto-scroll to latest message
- Loading animation (3 bouncing dots)

### Header
- White background
- Back button (left)
- Title and property count (center)
- Homevest logo (right)

## Benefits

1. **Informed Decisions**: Comprehensive AI analysis helps users choose wisely
2. **Interactive**: Follow-up questions allow deep exploration
3. **Visual Context**: Map shows property locations while analyzing
4. **Personalized**: Recommendations based on user's specific financial situation
5. **Conversational**: Natural chat interface feels like talking to an advisor
6. **Data-Driven**: All recommendations backed by specific metrics
7. **Transparent**: Clear reasoning for every recommendation

## Future Enhancements

### Phase 2:
- [ ] Export comparison as PDF
- [ ] Share comparison via email
- [ ] Save comparison for later review
- [ ] Compare different scenarios (what-if analysis)
- [ ] Add more properties to comparison
- [ ] Remove properties from comparison

### Phase 3:
- [ ] Voice input for questions
- [ ] Chart visualizations of comparisons
- [ ] Neighborhood comparison data
- [ ] School district information
- [ ] Commute time analysis
- [ ] Market trend predictions

## Notes

- Comparison data persists until new comparison is created
- Chat history is session-based (resets on page reload)
- AI responses are generated fresh each time (not cached)
- Map automatically centers on selected properties
- All properties remain visible on map regardless of zoom
- Follow-up questions maintain full context of comparison
