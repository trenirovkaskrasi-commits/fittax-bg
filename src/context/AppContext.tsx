import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, UserSettings, DEFAULT_SETTINGS } from '../types';

interface AppState {
  transactions: Transaction[];
  settings: UserSettings;
  currency: 'EUR' | 'BGN';
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleCurrency: () => void;
  clearData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const stored = localStorage.getItem('settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const [currency, setCurrency] = useState<'EUR' | 'BGN'>('EUR');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'EUR' ? 'BGN' : 'EUR'));
  };

  const clearData = () => {
    setTransactions([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        settings,
        currency,
        addTransaction,
        deleteTransaction,
        updateSettings,
        toggleCurrency,
        clearData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
