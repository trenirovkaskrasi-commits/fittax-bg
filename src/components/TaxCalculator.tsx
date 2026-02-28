import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, toBGN, EXCHANGE_RATE } from '../lib/utils';
import { MIN_INSURANCE_INCOME, MAX_INSURANCE_INCOME, VAT_THRESHOLD } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const COLORS = ['#ccff00', '#ff6600', '#ef4444', '#3b82f6'];

export const TaxCalculator: React.FC = () => {
  const { transactions, settings, currency } = useApp();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthlyIncome = useMemo(() => {
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions, currentYear, currentMonth]);

  const yearlyIncome = useMemo(() => {
    return transactions
      .filter((t) => new Date(t.date).getFullYear() === currentYear)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions, currentYear]);

  // Tax Logic 2026
  const statutoryExpenses = monthlyIncome * 0.25;
  const taxableIncomeBase = monthlyIncome - statutoryExpenses;

  // Social Security
  // Base is clamped between MIN and MAX, but also limited by the taxable income if less than MIN?
  // Actually, for self-employed, you select an insurance income between MIN and MAX.
  // If you earned less than MIN, you still pay on MIN if you are active.
  // However, usually you pay advance contributions on a selected amount.
  // For this calculator, let's assume the user pays on the selected amount in settings,
  // or on the taxable income if it's higher (but capped at MAX).
  // Simplified: Use settings.insuranceIncome as the base for advance contributions.
  
  // Wait, the prompt says: "Social Security: On Taxable Income, but not less than 550.66 and not more than 2111.64".
  // This implies we calculate it based on the actual income for the month (or year for annual equalization).
  // Let's use the actual taxable income for the calculation to show "expected" tax.
  
  let socialSecurityBase = taxableIncomeBase;
  if (socialSecurityBase < MIN_INSURANCE_INCOME) socialSecurityBase = MIN_INSURANCE_INCOME;
  if (socialSecurityBase > MAX_INSURANCE_INCOME) socialSecurityBase = MAX_INSURANCE_INCOME;

  // If income is 0, usually you still pay if you are active, but let's assume 0 if 0 income for simplicity unless "active" is toggled.
  // But for a calculator, let's show what it would be.
  if (monthlyIncome === 0) socialSecurityBase = 0; // Or MIN if we assume active. Let's stick to 0 for "no activity".

  const socialSecurityRate = 0.278; // ~28% (14.8% Pension + 5% Universal + 8% Health) = 27.8%
  const socialSecurity = socialSecurityBase * socialSecurityRate;

  const taxBase = taxableIncomeBase - socialSecurity;
  const incomeTax = taxBase > 0 ? taxBase * 0.10 : 0;

  const netIncome = monthlyIncome - socialSecurity - incomeTax;

  // VAT Progress
  const vatProgress = (yearlyIncome / VAT_THRESHOLD) * 100;

  // Currency Conversion Helper
  const display = (amount: number) => {
    const value = currency === 'BGN' ? toBGN(amount) : amount;
    return formatCurrency(value, currency);
  };

  const data = [
    { name: 'Нетен Доход', value: netIncome },
    { name: 'Осигуровки', value: socialSecurity },
    { name: 'Данък', value: incomeTax },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Месечен Приход" value={display(monthlyIncome)} color="text-white" />
        <Card title="Очаквани Данъци" value={display(socialSecurity + incomeTax)} color="text-red-500" />
        <Card title="Нетен Доход" value={display(netIncome)} color="text-neon-green" />
        <Card 
          title="Праг по ДДС (Година)" 
          value={`${vatProgress.toFixed(1)}%`} 
          subValue={`${display(yearlyIncome)} / ${display(VAT_THRESHOLD)}`}
          color={vatProgress > 85 ? 'text-red-500' : 'text-neon-orange'} 
        />
      </div>

      {/* Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 p-6 rounded-2xl shadow-lg lg:col-span-1"
        >
          <h3 className="text-lg font-semibold mb-4 text-zinc-400">Разпределение</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => display(value)}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-zinc-500">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 p-6 rounded-2xl shadow-lg lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-6 text-zinc-400">Данъчна Разбивка (Месец)</h3>
          <div className="space-y-4">
            <Row label="Брутен Приход" value={display(monthlyIncome)} />
            <Row label="НПР (25%)" value={`- ${display(statutoryExpenses)}`} className="text-zinc-500" />
            <div className="h-px bg-zinc-800 my-2" />
            <Row label="Облагаем Доход" value={display(taxableIncomeBase)} className="font-medium" />
            <Row label={`Осигурителен Доход (мин ${display(MIN_INSURANCE_INCOME)})`} value={display(socialSecurityBase)} className="text-zinc-500 text-sm" />
            <Row label="Осигуровки (~27.8%)" value={`- ${display(socialSecurity)}`} className="text-red-400" />
            <div className="h-px bg-zinc-800 my-2" />
            <Row label="Данъчна Основа" value={display(taxBase)} className="font-medium" />
            <Row label="Данък (10%)" value={`- ${display(incomeTax)}`} className="text-red-400" />
            <div className="h-px bg-zinc-700 my-4" />
            <Row label="Нетен Доход" value={display(netIncome)} className="text-xl font-bold text-neon-green" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Card = ({ title, value, subValue, color }: { title: string; value: string; subValue?: string; color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800/50"
  >
    <h3 className="text-sm font-medium text-zinc-500 mb-1">{title}</h3>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    {subValue && <div className="text-xs text-zinc-600 mt-1">{subValue}</div>}
  </motion.div>
);

const Row = ({ label, value, className = '' }: { label: string; value: string; className?: string }) => (
  <div className={`flex justify-between items-center ${className}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
