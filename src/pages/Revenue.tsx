import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, toEUR } from '../lib/utils';
import { Calendar, Euro, FileText, Plus } from 'lucide-react';

export const Revenue: React.FC = () => {
  const { addTransaction, currency } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const value = parseFloat(amount);
    // If input is in BGN, convert to EUR for storage
    const amountInEur = currency === 'BGN' ? toEUR(value) : value;

    addTransaction({
      amount: amountInEur,
      description,
      date,
      type,
    });

    setAmount('');
    setDescription('');
    // Keep date as is for convenience
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-white mb-2">Добави Приход</h1>
          <p className="text-zinc-400">Въведете дневните приходи от тренировки.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Сума ({currency})</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Euro className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-transparent text-white placeholder-zinc-600"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Описание на услугата</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-transparent text-white placeholder-zinc-600"
                placeholder="Персонална тренировка, Месечен абонамент..."
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Дата</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-transparent text-white placeholder-zinc-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-neon-green text-black font-bold py-4 rounded-xl hover:bg-lime-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добави Запис
          </button>
        </form>

        {/* Quick Actions / Recent (Optional, maybe for v2) */}
      </div>
    </Layout>
  );
};
