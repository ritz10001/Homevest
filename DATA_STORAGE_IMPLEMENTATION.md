# Data Storage Implementation

## Overview
Implemented automatic storage of property analysis data to the "Important Data" folder with automatic cleanup on navigation.

## What Gets Stored

When a user views a property and AI analysis completes, the following data is saved to `Important Data/property-analysis.json`:

### 1. User Data
- UID, display name, email
- Annual income, monthly debt, available savings
- Max monthly budget, down payment preference
- Interest rate, loan term, PMI inclusion
- Credit score, risk comfort, time horizon

### 2. Property Data
- ZPID, full address (street, city, state, zip)
- Price, bedrooms, bathrooms, square footage
- Coordinates (lat/lng)
- Home type, days on Zillow
- Zestimate, rent zestimate, tax assessed value
- Lot size, broker name

### 3. AI Insights (Complete Analysis)
- Affordability score and level
- Monthly payment, DTI ratio
- Key insights array
- Warnings array
- Financial breakdown (down payment, closing costs, total cash needed)
- Income breakdown (gross, net, after-housing, ratios)
- Insurance 5-year projection
- Property tax 5-year projection
- HOA fees 5-year projection
- Maintenance 5-year projection
- HomePilot advisor message

### 4. Metadata
- Timestamp of when the analysis was generated

## File Structure

```
Important Data/
├── .gitkeep                    # Keeps folder in git
├── README.md                   # Documentation
└── property-analysis.json      # Temporary data (auto-deleted)
```

## Data Lifecycle

### When Data is Saved
- ✅ After AI analysis successfully completes
- ✅ Automatically via API call to `/api/save-property-data`
- ✅ Includes timestamp for tracking

### When Data is Deleted
- 🗑️ When user clicks "Back to search" button
- 🗑️ When component unmounts (browser back button, navigation)
- 🗑️ Automatically via API call to `/api/delete-property-data`

### What Persists
- ✅ The "Important Data" folder itself
- ✅ The .gitkeep and README.md files
- ❌ The property-analysis.json file (temporary)

## Implementation Files

### Backend
- `src/lib/dataStorage.ts` - Core storage utilities
- `src/app/api/save-property-data/route.ts` - Save API endpoint
- `src/app/api/delete-property-data/route.ts` - Delete API endpoint

### Frontend
- `src/app/homebuyer/property/[id]/page.tsx` - Updated to save/delete data

### Configuration
- `.gitignore` - Excludes JSON files from git
- `Important Data/.gitkeep` - Keeps folder in git

## API Endpoints

### POST /api/save-property-data
Saves property analysis data to the Important Data folder.

**Request Body:**
```json
{
  "userData": { ... },
  "propertyData": { ... },
  "aiInsights": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property data saved successfully"
}
```

### DELETE /api/delete-property-data
Deletes the property analysis JSON file.

**Response:**
```json
{
  "success": true,
  "message": "Property data deleted successfully"
}
```

## Usage Example

### Viewing the Saved Data
```bash
cat "Important Data/property-analysis.json"
```

### Manual Cleanup (if needed)
```bash
rm "Important Data/property-analysis.json"
```

## Console Logs

The implementation includes helpful console logs:
- 💾 "Data saved to Important Data folder"
- 🗑️ "Property data deleted from Important Data folder"
- 🗑️ "Cleanup: Property data deleted" (on unmount)

## Benefits

1. **Data Persistence**: All analysis data is saved for reference
2. **Automatic Cleanup**: No manual intervention needed
3. **Single Source**: One JSON file with all related data
4. **Timestamped**: Know when analysis was performed
5. **Git-Friendly**: Folder tracked, but data files ignored

## Testing

1. Navigate to any property details page
2. Wait for AI analysis to complete
3. Check `Important Data/property-analysis.json` - should exist
4. Click "Back to search" or navigate away
5. Check again - file should be deleted
6. Folder should still exist with .gitkeep and README.md
