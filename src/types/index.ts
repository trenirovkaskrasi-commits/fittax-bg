export interface Transaction {
  id: string;
  date: string;
  amount: number; // In EUR
  description: string;
  type: 'income' | 'expense'; // Although mainly income for now
}

export interface UserSettings {
  name: string;
  eic: string;
  isSelfInsured: boolean;
  insuranceIncome: number; // Selected insurance income base
  usePersonalBankDetails: boolean;
}

export interface TaxSummary {
  totalIncome: number;
  statutoryExpenses: number;
  taxableIncomeBase: number;
  socialSecurityBase: number;
  socialSecurity: number;
  taxBase: number;
  incomeTax: number;
  netIncome: number;
  vatTurnover: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  eic: '',
  isSelfInsured: true,
  insuranceIncome: 933, // Example default, min is 550.66 EUR (~1077 BGN) but often people pay on min wage or higher.
  // Wait, min insurance income in 2026 is 550.66 EUR.
  usePersonalBankDetails: false,
};

export const MIN_INSURANCE_INCOME = 550.66;
export const MAX_INSURANCE_INCOME = 2111.64;
export const VAT_THRESHOLD = 51130;
