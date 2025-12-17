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
    targetCurrency, handleCurrencyChange
  } = useStopwatch();

  const [copyFeedback, setCopyFeedback] = useState('📋 Copiar Relatório');
  
  const gross = (elapsedTime / 3600000) * hourlyRate;
  const net = taxRate > 0 ? gross * (1 - taxRate / 100) : gross;
  const { formattedTime, formattedMs } = formatTimeParts(elapsedTime);

  const handleCopy = () => {
    const report = `📊 RELATÓRIO PROFISSIONAL PAYCALC (${targetCurrency})
⏱ Tempo trabalhado: ${formattedTime}${formattedMs}
💰 Valor bruto: ${gross.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
💸 Valor líquido: ${net.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
💼 Valor/hora: ${targetCurrency} ${hourlyRate.toFixed(2)}
📉 Impostos: ${taxRate}%
Gerado via PayCalc em ${new Date().toLocaleString('pt-BR')}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopyFeedback('✅ Copiado!');
      setTimeout(() => setCopyFeedback('📋 Copiar Relatório'), 2000);
    });
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      {/* Header para AdSense (Navegação é obrigatória para aprovação) */}
      <nav className="w-full bg-black/20 border-b border-white/5 py-4 px-6 mb-12 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter uppercase">
            PAY<span className="text-app-greenLight">CALC</span>
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/60">
            <a href="/" className="hover:text-white transition-colors">Calculadora</a>
            <a href="/sobre" className="hover:text-white transition-colors">Sobre</a>
            <a href="/contato" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-5xl px-4 flex flex-col items-center gap-16">
        <main className="w-full max-w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl flex flex-col gap-6 relative overflow-hidden">
          <div>
            <h1 className="text-[26px] font-extrabold mb-2 text-white tracking-tight">Cálculo de Honorários</h1>
            <p className="text-[14px] text-[#bbbbbb]">Gestão de tempo e valor-hora profissional.</p>
          </div>

          <div>
            <div className="text-base font-semibold text-[#cccccc] mb-1 uppercase text-[10px] tracking-widest">Cronômetro Financeiro</div>
            <div className="font-extrabold text-[#ffffff] tracking-tighter tabular-nums text-5xl sm:text-[58px] leading-tight my-2">
              {formattedTime}<span className="text-4xl sm:text-[40px] opacity-70">{formattedMs}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-[#cccccc] mb-1 uppercase tracking-wider">Honorários Brutos</div>
              <div className="text-3xl sm:text-[38px] font-extrabold text-app-greenLight tracking-tight">
                {gross.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#cccccc] mb-1 uppercase tracking-wider">Resultado Líquido</div>
              <div className="text-2xl sm:text-[30px] font-extrabold text-white/80 tracking-tight">
                {net.toLocaleString('pt-BR', { style: 'currency', currency: targetCurrency })}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#cccccc] mb-2 uppercase tracking-tighter">Moeda</label>
                <select 
                  value={targetCurrency} 
                  onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                  className="w-full p-4 bg-[#0a304b] border-2 border-[#2a5d84] rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-app-blue transition-colors"
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c} className="bg-[#0a304b] text-white">{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] font-bold text-[#cccccc] mb-2 uppercase tracking-tighter">Valor/Hora ({CURRENCY_SYMBOLS[targetCurrency]})</label>
                <input 
                  type="number" 
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} 
                  step="0.01" 
                  className="w-full p-4 text-center bg-app-input border-2 border-[#2a5d84] rounded-2xl text-white font-bold focus:outline-none focus:border-app-blue transition-colors" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#cccccc] mb-2 uppercase tracking-tighter">Taxas e Impostos (%)</label>
              <input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
                step="0.1" 
                className="w-full p-4 text-center bg-app-input border-2 border-[#2a5d84] rounded-2xl text-white font-bold focus:outline-none focus:border-app-blue transition-colors" 
              />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button onClick={toggleTimer} className={`flex-1 p-5 text-[17px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg ${isRunning ? 'bg-app-orange text-white' : 'bg-app-blue text-white'}`}>
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button onClick={resetTimer} className="flex-1 p-5 text-[17px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg bg-app-red text-white">
              Resetar
            </button>
          </div>

          <button onClick={handleCopy} className="w-full p-4 text-[14px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg bg-app-greenLight text-white mt-2 flex items-center justify-center gap-2 hover:brightness-110">
            {copyFeedback}
          </button>

          {history.length > 0 && (
            <div className="mt-4 text-left bg-black/20 rounded-xl p-4 max-h-[160px] overflow-y-auto history-scroll border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase mb-2 tracking-wider">Histórico Recente</div>
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="py-2 border-b border-white/10 last:border-0 text-[12px] opacity-90 text-white/90">
                    <span className="font-bold text-app-blue">{item.date}</span> • {item.duration} • <span className="text-app-greenLight font-bold">{item.gross}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <article className="w-full max-w-3xl text-[#d1d5db] space-y-10 pb-20 leading-relaxed">
          <header className="border-b border-white/10 pb-8 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-4 uppercase tracking-tighter">Guia Profissional de Precificação</h2>
              <p className="text-lg text-[#9ca3af]">Aprenda a valorizar seu trabalho e gerenciar seus honorários como freelancer.</p>
          </header>

          <section className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Como definir seu Valor-Hora?</h3>
              <p>Calcular o valor da sua hora técnica é fundamental para a saúde financeira de qualquer profissional autônomo. O PayCalc ajuda você a automatizar esse rastreamento em tempo real, garantindo que nenhum minuto de trabalho seja ignorado.</p>
              <p>Ao definir seu preço, considere custos fixos (internet, softwares, hardware), custos variáveis e, principalmente, sua meta de salário mensal líquida.</p>
          </section>

          <section className="space-y-4">
              <h3 className="text-2xl font-bold text-white">A importância dos Impostos e Taxas</h3>
              <p>Muitos freelancers cometem o erro de cobrar apenas pelo valor bruto. É essencial incluir a porcentagem de impostos (como o Simples Nacional ou MEI no Brasil) e taxas de plataformas de pagamento. Nossa ferramenta permite deduzir esses valores automaticamente para que você saiba exatamente quanto sobrará no final do projeto.</p>
          </section>

          <section className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-xl font-bold text-white">Vantagens do Rastreamento em Tempo Real</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong className="text-app-blue">Transparência:</strong> Relatórios precisos para apresentar aos seus clientes.</li>
                <li><strong className="text-app-blue">Produtividade:</strong> O cronômetro visual ajuda a manter o foco na tarefa atual.</li>
                <li><strong className="text-app-blue">Previsibilidade:</strong> Veja o valor acumulado crescer enquanto você trabalha.</li>
              </ul>
          </section>
        </article>
      </div>

      <footer className="w-full bg-black/30 border-t border-white/5 py-12 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <div className="text-xl font-black text-white brand-font uppercase tracking-tighter">
              PAY<span className="text-app-greenLight">CALC</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">© {new Date().getFullYear()} PayCalc - Trafer Soluções Digitais</p>
          </div>
          
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white/50">
            <a href="/privacy" className="hover:text-app-blue transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-app-blue transition-colors">Termos</a>
            <a href="/contato" className="hover:text-app-blue transition-colors">Suporte</a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-white/40">Desenvolvido por</p>
            <a href="https://wa.me/5511988484500" target="_blank" className="text-app-orange font-black hover:underline transition-all">Trafer Digital</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;