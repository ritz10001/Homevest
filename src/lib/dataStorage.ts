/**
 * Data Storage Utility
 * Manages saving and deleting property analysis data to/from the Important Data folder
 */

import fs from 'fs';
import path from 'path';

const DATA_FOLDER = path.join(process.cwd(), 'Important Data');
const DATA_FILE = path.join(DATA_FOLDER, 'property-analysis.json');

export interface StoredPropertyData {
  timestamp: string;
  userData: {
    uid: string;
    displayName: string;
    email: string;
    annualIncome: number;
    monthlyDebt: number;
    availableSavings: number;
    maxMonthlyBudget: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
    includePMI: boolean;
    creditScore: string;
    riskComfort: string;
    timeHorizon: string;
  };
  propertyData: {
    zpid: string;
    address: string;
    addressCity: string;
    addressState: string;
    addressZipcode: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    lat: number;
    lng: number;
    homeType?: string;
    daysOnZillow?: number;
    zestimate?: number;
    rentZestimate?: number;
    taxAssessedValue?: number;
    lotAreaValue?: number;
    lotAreaUnit?: string;
    brokerName?: string;
  };
  aiInsights: any; // The full AI insights object
}

/**
 * Save property analysis data to Important Data folder
 */
export async function savePropertyData(data: StoredPropertyData): Promise<void> {
  try {
    // Ensure folder exists
    if (!fs.existsSync(DATA_FOLDER)) {
      fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }

    // Write data to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✅ Property data saved to Important Data folder');
  } catch (error) {
    console.error('❌ Error saving property data:', error);
    throw error;
  }
}

/**
 * Delete property analysis data from Important Data folder
 */
export async function deletePropertyData(): Promise<void> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
      console.log('✅ Property data deleted from Important Data folder');
    }
  } catch (error) {
    console.error('❌ Error deleting property data:', error);
    throw error;
  }
}

/**
 * Check if property data exists
 */
export function propertyDataExists(): boolean {
  return fs.existsSync(DATA_FILE);
}

/**
 * Read property data from file
 */
export function readPropertyData(): StoredPropertyData | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('❌ Error reading property data:', error);
    return null;
  }
}
