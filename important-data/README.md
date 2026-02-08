# Important Data Folder

This folder stores temporary property analysis data when a user views a property details page.

## What's Stored

The `property-analysis.json` file contains:

1. **User Data**: Financial profile information from Firestore
   - Annual income, monthly debt, available savings
   - Down payment preferences, interest rate, loan term
   - Credit score, risk comfort, time horizon

2. **Property Data**: Complete property information
   - Address, price, bedrooms, bathrooms, square footage
   - Zestimate, rent zestimate, tax assessed value
   - Days on market, broker information
   - Location coordinates

3. **AI Insights**: Complete AI-generated analysis
   - Affordability score and level
   - Monthly payment calculations
   - Key insights and warnings
   - Financial breakdown
   - 5-year cost projections (insurance, taxes, HOA, maintenance)
   - Income breakdown
   - HomePilot advisor message

## Data Lifecycle

- **Created**: When AI analysis completes on a property details page
- **Updated**: Each time a new property is analyzed (overwrites previous data)
- **Deleted**: Automatically when user navigates back to the map or leaves the property page

## File Format

```json
{
  "timestamp": "2024-02-08T12:34:56.789Z",
  "userData": { ... },
  "propertyData": { ... },
  "aiInsights": { ... }
}
```

## Notes

- Only one property analysis is stored at a time
- The folder persists but the JSON file is temporary
- Data is automatically cleaned up on navigation
