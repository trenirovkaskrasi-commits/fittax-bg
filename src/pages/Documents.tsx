import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, toBGN } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { Download, FileText, Trash2 } from 'lucide-react';

export const Documents: React.FC = () => {
  const { transactions, deleteTransaction, currency, settings } = useApp();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Mesechen Otchet Prihodi', 20, 20); // Using Latin for PDF compatibility without custom font
    
    doc.setFontSize(12);
    doc.text(`Generiran na: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Instruktor: ${settings.name || 'N/A'}`, 20, 40);
    doc.text(`EIC: ${settings.eic || 'N/A'}`, 20, 50);

    // Table Header
    let y = 70;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Data', 20, y);
    doc.text('Opisanie', 60, y);
    doc.text('Suma (EUR)', 150, y);
    
    // Table Rows
    y += 10;
    doc.setTextColor(0);
    
    let total = 0;

    transactions.forEach((t) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(t.date, 20, y);
      // Transliterate description or use simple text to avoid encoding issues in standard jsPDF
      doc.text(t.description, 60, y); 
      doc.text(t.amount.toFixed(2), 150, y);
      total += t.amount;
      y += 10;
    });

    // Total
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Obshto: ${total.toFixed(2)} EUR`, 120, y);

    doc.save('report.pdf');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Документи</h1>
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Експорт PDF</span>
          </button>
        </header>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Няма намерени записи. Добавете приходи, за да генерирате отчети.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-500 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Дата</th>
                    <th className="px-6 py-4">Описание</th>
                    <th className="px-6 py-4 text-right">Сума</th>
                    <th className="px-6 py-4 text-center">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">{t.date}</td>
                      <td className="px-6 py-4 text-white">{t.description}</td>
                      <td className="px-6 py-4 text-right font-mono text-neon-green">
                        {currency === 'BGN' ? formatCurrency(toBGN(t.amount), 'BGN') : formatCurrency(t.amount, 'EUR')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
