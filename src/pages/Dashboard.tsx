import React from 'react';
import { TaxCalculator } from '../components/TaxCalculator';
import { Layout } from '../components/Layout';

export const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Табло</h1>
          <span className="text-sm text-zinc-500 font-mono">Данъчна Година 2026</span>
        </header>
        <TaxCalculator />
      </div>
    </Layout>
  );
};
