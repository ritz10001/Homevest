# Property Comparison Feature - Setup Guide

## Quick Start

### 1. Get Featherless API Key

1. Go to [Featherless.ai](https://featherless.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Add API Key to Environment

Add to `.env.local`:
```env
FEATHERLESS_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

### 4. Test the Feature

1. Navigate to `/homebuyer/map`
2. Click "Compare" button in top-right
3. Select 2-3 properties on the map
4. Click "Compare X Properties"
5. View AI-generated analysis in right panel
6. Download report (optional)

## Feature Overview

### What It Does
- Allows users to select 2-3 properties for comparison
- Uses DeepSeek V3 AI (via Featherless) to analyze properties
- Provides personalized recommendations based on user's financial profile
- Shows detailed pros/cons for each property
- Generates downloadable comparison report

### Key Components

**Frontend:**
- `src/app/homebuyer/map/page.tsx` - Main map page with comparison mode
- `src/components/homebuyer/PropertyMapComparison.tsx` - Enhanced map component

**Backend:**
- `src/app/api/compare-properties/route.ts` - Comparison analysis API
- `src/app/api/comparison-chat/route.ts` - Follow-up questions API (ready for future use)

**Documentation:**
- `DEEPSEEK_SYSTEM_PROMPT.md` - Complete system prompt for DeepSeek
- `COMPARISON_FEATURE_GUIDE.md` - Detailed feature documentation
- `COMPARISON_SETUP.md` - This file

### API Model Used

**Model**: `deepseek-ai/DeepSeek-V3`
- Latest DeepSeek model
- Excellent reasoning capabilities
- Great for financial analysis and comparisons
- Accessed via Featherless API

## Usage Instructions

### For First-Time Homebuyers

1. **Browse Properties**: View properties on the map
2. **Activate Comparison**: Click "Compare" button
3. **Select Properties**: Click 2-3 properties you're interested in
4. **Get Analysis**: Click "Compare X Properties" button
5. **Review Results**: 
   - See which property is recommended
   - Understand pros/cons of each
   - Review key decision factors
   - Get actionable next steps
6. **Download Report**: Save analysis for later review
7. **Exit**: Click "Exit Compare" to return to normal view

### What the AI Analyzes

1. **Affordability**
   - Monthly payment comparison
   - DTI ratio for each property
   - Cash needed at closing
   - Budget fit

2. **Value**
   - Price per square foot
   - Price vs Zestimate
   - Market positioning
   - Days on market implications

3. **Long-Term Costs**
   - 5-year total ownership costs
   - Property taxes
   - Insurance
   - HOA fees
   - Maintenance

4. **Investment Potential**
   - House hacking opportunities
   - Rental income potential
   - Appreciation forecast
   - Equity building

## Customization

### Adjust AI Behavior

Edit `src/app/api/compare-properties/route.ts`:

```typescript
// Change temperature for more/less creative responses
temperature: 0.7, // Lower = more focused, Higher = more creative

// Change max tokens for longer/shorter responses
max_tokens: 4000, // Increase for more detailed analysis
```

### Modify System Prompt

Edit the `COMPARISON_SYSTEM_PROMPT` in `src/app/api/compare-properties/route.ts` to:
- Change analysis focus
- Add new comparison criteria
- Adjust tone and style
- Modify output format

### Add More Properties

Currently limited to 3 properties. To change:

In `src/app/homebuyer/map/page.tsx`:
```typescript
// Change this line:
} else if (prev.length < 3) {
// To allow more properties:
} else if (prev.length < 5) { // Allow up to 5
```

## Troubleshooting

### "Failed to generate comparison"

**Possible causes:**
1. Invalid or missing Featherless API key
2. API rate limit exceeded
3. Network connectivity issues
4. Invalid property data

**Solutions:**
1. Verify API key in `.env.local`
2. Check Featherless dashboard for quota
3. Check browser console for detailed errors
4. Ensure properties have required data fields

### Properties don't show as selected

**Check:**
1. Properties have `zpid` field
2. Comparison mode is active
3. Browser console for errors
4. Map component is PropertyMapComparison

### Analysis takes too long

**Normal behavior:**
- Analysis typically takes 5-15 seconds
- DeepSeek V3 is thorough and detailed

**If consistently slow:**
- Check internet connection
- Verify Featherless API status
- Consider reducing `max_tokens` in API call

### Download doesn't work

**Check:**
1. Browser allows downloads
2. Comparison analysis has completed
3. Browser console for errors

## Development Tips

### Testing Locally

1. Use test properties with varied data
2. Test with different user profiles
3. Try edge cases (very expensive, very cheap)
4. Test with 2 and 3 properties

### Adding Follow-Up Chat

The chat API is ready at `/api/comparison-chat`. To add UI:

1. Create chat component in comparison panel
2. Maintain conversation history
3. Pass context (user, properties, analysis)
4. Display responses in chat interface

Example implementation:
```typescript
const [messages, setMessages] = useState([]);

const sendMessage = async (userMessage) => {
  const response = await fetch('/api/comparison-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      conversationHistory: messages,
      context: {
        userData,
        properties: selectedProperties,
        comparisonAnalysis
      }
    })
  });
  
  const { reply } = await response.json();
  setMessages([...messages, 
    { role: 'user', content: userMessage },
    { role: 'assistant', content: reply }
  ]);
};
```

## Next Steps

1. **Get Featherless API Key** - Sign up and get your key
2. **Add to .env.local** - Configure the environment variable
3. **Test the Feature** - Try comparing properties
4. **Customize** - Adjust prompts and behavior as needed
5. **Add Chat UI** - Implement follow-up questions interface (optional)

## Support

For issues or questions:
1. Check browser console for errors
2. Review `COMPARISON_FEATURE_GUIDE.md` for detailed docs
3. Check Featherless API documentation
4. Verify all environment variables are set

## Future Enhancements

See `COMPARISON_FEATURE_GUIDE.md` for planned features:
- Interactive chat interface
- Scenario comparison
- Visual charts
- Save comparisons
- Email reports
