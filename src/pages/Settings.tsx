import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { MIN_INSURANCE_INCOME, MAX_INSURANCE_INCOME } from '../types';
import { Save, User, Building, ShieldCheck } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, clearData } = useApp();
  const [name, setName] = useState(settings.name);
  const [eic, setEic] = useState(settings.eic);
  const [insuranceIncome, setInsuranceIncome] = useState(settings.insuranceIncome);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      eic,
      insuranceIncome: Number(insuranceIncome),
    });
    alert('Настройките са запазени!');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-white mb-2">Настройки</h1>
          <p className="text-zinc-400">Конфигурирайте профила и данъчните параметри.</p>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-neon-green" />
              Профил
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Име и Фамилия</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-transparent text-white placeholder-zinc-600"
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">ЕИК / БУЛСТАТ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={eic}
                    onChange={(e) => setEic(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-transparent text-white placeholder-zinc-600"
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Insurance Section */}
          <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
              Осигуровки (2026)
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Избран Осигурителен Доход (€)
                </label>
                <input
                  type="range"
                  min={MIN_INSURANCE_INCOME}
                  max={MAX_INSURANCE_INCOME}
                  step="10"
                  value={insuranceIncome}
                  onChange={(e) => setInsuranceIncome(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                  <span>Мин: {MIN_INSURANCE_INCOME}</span>
                  <span className="text-neon-green font-bold">{insuranceIncome} EUR</span>
                  <span>Макс: {MAX_INSURANCE_INCOME}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Това е сумата, върху която внасяте авансови осигуровки месечно.
                </p>
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-neon-green text-black font-bold py-4 rounded-xl hover:bg-lime-400 transition-colors"
            >
              <Save className="w-5 h-5" />
              Запази
            </button>
            
            <button
              type="button"
              onClick={() => {
                if (confirm('Сигурни ли сте, че искате да изтриете всички данни? Това действие е необратимо.')) {
                  clearData();
                }
              }}
              className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20"
            >
              Нулиране
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
