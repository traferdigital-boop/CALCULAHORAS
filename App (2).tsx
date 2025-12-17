import React, { useState } from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import { formatTimeParts } from './utils/format';
import { CurrencyCode } from './types';

const CURRENCY_SYMBOLS: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€', GBP: '£', CAD: '$', ARS: '$', JPY: '¥' };
const CURRENCIES: CurrencyCode[] = ['BRL', 'USD', 'EUR', 'GBP', 'CAD', 'ARS', 'JPY'];

const App: React.FC = () => {
  const {
    elapsedTime, isRunning, hourlyRate, setHourlyRate,
    taxRate, setTaxRate, history, toggleTimer, resetTimer,
    targetCurrency, handleCurrencyChange, loadingRates
  } = useStopwatch();

  const [copyFeedback, setCopyFeedback] = useState('📋 Copiar Relatório');
  
  const gross = (elapsedTime / 3600000) * hourlyRate;
  const net = taxRate > 0 ? gross * (1 - taxRate / 100) : gross;
  const { formattedTime, formattedMs } = formatTimeParts(elapsedTime);

  const handleCopy = () => {
    const report = `📊 RELATÓRIO PROFISSIONAL PAYCALC (${targetCurrency})
⏱ Tempo Total de Atividade: ${formattedTime}${formattedMs}
💰 Honorários Brutos: ${gross.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
💸 Saldo Líquido (Pós-Taxas): ${net.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
💼 Valor de Referência/Hora: ${targetCurrency} ${hourlyRate.toFixed(2)}
📉 Alíquota de Impostos aplicada: ${taxRate}%
Gerado via PayCalc em ${new Date().toLocaleString('pt-BR')}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopyFeedback('✅ Copiado!');
      setTimeout(() => setCopyFeedback('📋 Copiar Relatório'), 2000);
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 gap-16">
      <section className="w-full max-w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 text-center shadow-2xl flex flex-col gap-6 relative animate-fade-in">
        <header>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-1">Painel Financeiro</h2>
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Gestão de Honorários em Tempo Real</p>
        </header>

        <div className="bg-black/20 rounded-3xl py-8 border border-white/5 shadow-inner">
          <div className="text-[58px] font-black tracking-tighter tabular-nums leading-none text-white drop-shadow-md">
            {formattedTime}<span className="text-3xl opacity-30">{formattedMs}</span>
          </div>
          <p className="text-[10px] text-app-blue font-bold uppercase mt-2 tracking-widest">Tempo Efetivo de Produção</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left transition-all hover:bg-white/10">
            <p className="text-[10px] font-bold uppercase text-white/40 mb-1 tracking-wider">Honorários Estimados ({targetCurrency})</p>
            <p className="text-3xl font-black text-app-greenLight leading-none">
              {gross.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left transition-all hover:bg-white/10">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Lucro Líquido Real</p>
               {loadingRates && <span className="text-[8px] bg-app-blue text-white px-2 py-0.5 rounded-full animate-pulse">Câmbio Live</span>}
            </div>
            <p className="text-2xl font-black text-white/80 leading-none">
              {net.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex gap-3">
            <div className="flex-1 text-left">
              <label className="text-[9px] font-black uppercase text-white/30 ml-2 tracking-tighter">Moeda Global</label>
              <select 
                value={targetCurrency} 
                onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)} 
                className="w-full p-4 bg-app-card border border-white/10 rounded-2xl text-white font-bold outline-none cursor-pointer hover:border-app-blue transition-colors appearance-none"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-[2] text-left">
              <label className="text-[9px] font-black uppercase text-white/30 ml-2 tracking-tighter">Valor p/ Hora ({targetCurrency})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black">{CURRENCY_SYMBOLS[targetCurrency]}</span>
                <input 
                  type="number" 
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} 
                  className="w-full p-4 pl-12 bg-app-input border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-app-blue transition-all" 
                />
              </div>
            </div>
          </div>
          <div className="text-left">
            <label className="text-[9px] font-black uppercase text-white/30 ml-2 tracking-tighter">Alíquota de Impostos / Taxas (%)</label>
            <input 
              type="number" 
              value={taxRate} 
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
              className="w-full p-4 bg-app-input border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-app-blue transition-all" 
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={toggleTimer} className={`flex-[2] p-5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${isRunning ? 'bg-app-orange text-white' : 'bg-app-blue text-white'}`}>
            {isRunning ? 'Pausar Atividade' : 'Iniciar Timer'}
          </button>
          <button onClick={resetTimer} className="flex-1 p-5 rounded-3xl font-black uppercase text-xs tracking-widest bg-app-red text-white transition-all shadow-xl active:scale-95">
            Reset
          </button>
        </div>

        <button onClick={handleCopy} className="w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] bg-app-greenLight text-white transition-all shadow-lg hover:brightness-110 active:scale-[0.98]">
          {copyFeedback}
        </button>

        {history.length > 0 && (
          <div className="mt-2 text-left bg-black/30 rounded-3xl p-5 max-h-[160px] overflow-y-auto border border-white/5 space-y-4 history-scroll">
            <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">Log de Atividades Recentes</p>
            {history.map(item => (
              <div key={item.id} className="text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-app-blue uppercase text-[10px]">{item.date}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded-md text-[9px] font-bold">{item.duration}</span>
                </div>
                <p className="text-white/70 font-medium">Faturamento: <span className="text-app-greenLight font-black">{item.gross}</span></p>
              </div>
            ))}
          </div>
        )}
      </section>

      <article id="guia" className="w-full max-w-5xl text-[#d1d5db] space-y-16 leading-relaxed bg-black/10 p-10 md:p-16 rounded-[60px] border border-white/5">
        <header className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-4xl mx-auto leading-none">
              O Guia Definitivo para <span className="text-app-greenLight">Precificação de Serviços</span> Digitais
            </h2>
            <p className="text-xl md:text-2xl text-[#9ca3af] max-w-2xl mx-auto font-light">
              Entenda como freelancers e nômades digitais estão otimizando suas margens de lucro.
            </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
            <section className="space-y-6">
                <div className="w-12 h-1 bg-app-blue"></div>
                <h3 className="text-3xl font-bold text-white">Por que o Valor-Hora é apenas o começo?</h3>
                <p>O cálculo do valor-hora técnico deve contemplar custos de infraestrutura e o seu custo de oportunidade.</p>
            </section>
            <section className="space-y-6">
                <div className="w-12 h-1 bg-app-greenLight"></div>
                <h3 className="text-3xl font-bold text-white">Câmbio e Invoices Internacionais</h3>
                <p>Exportar serviços em Dólar ou Euro protege seu patrimônio contra a desvalorização do Real.</p>
            </section>
        </div>
      </article>

      <footer className="w-full text-center border-t border-white/5 pt-16 pb-12 text-white/40 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 px-8">
            <div className="text-left space-y-3">
                <p className="font-black text-white text-3xl tracking-tighter uppercase leading-none">PAY<span className="text-app-greenLight">CALC</span></p>
                <p className="text-xs max-w-sm font-medium leading-relaxed opacity-60">
                  Ferramenta de inteligência financeira para profissionais independentes.
                </p>
            </div>
            <nav className="flex flex-wrap gap-x-10 gap-y-4 justify-center text-[11px] font-black uppercase tracking-[0.2em]">
                <a href="/sobre" className="hover:text-app-greenLight transition-colors">Sobre o Projeto</a>
                <a href="/contato" className="hover:text-app-greenLight transition-colors">Fale Conosco</a>
                <a href="/privacy" className="hover:text-app-greenLight transition-colors">Privacidade</a>
                <a href="/termos" className="hover:text-app-greenLight transition-colors">Termos Gerais</a>
            </nav>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col gap-4">
           <p className="text-[10px] opacity-40 font-bold">PayCalc © {new Date().getFullYear()} • Trafer Soluções Digitais LTDA</p>
        </div>
      </footer>
    </div>
  );
};

export default App;