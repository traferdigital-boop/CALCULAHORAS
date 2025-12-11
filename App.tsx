import React, { useState } from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import { formatCurrency, formatTimeParts, generateReport } from './utils/format';

const App: React.FC = () => {
  const {
    elapsedTime,
    isRunning,
    hourlyRate,
    setHourlyRate,
    taxRate,
    setTaxRate,
    history,
    toggleTimer,
    resetTimer
  } = useStopwatch();

  const [copyFeedback, setCopyFeedback] = useState<string>('📋 Copiar Relatório');

  // Derived Calculations
  const gross = (elapsedTime / 3600000) * hourlyRate;
  const net = taxRate > 0 ? gross * (1 - taxRate / 100) : gross;

  const { formattedTime, formattedMs } = formatTimeParts(elapsedTime);

  const handleCopy = () => {
    const fullTimeStr = formattedTime + formattedMs;
    const grossStr = formatCurrency(gross);
    const netStr = formatCurrency(net);
    const report = generateReport(fullTimeStr, grossStr, netStr, hourlyRate, taxRate);

    navigator.clipboard.writeText(report).then(() => {
      setCopyFeedback('✅ Copiado!');
      setTimeout(() => setCopyFeedback('📋 Copiar Relatório'), 2000);
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 gap-16">
      
      {/* --- Main Calculator Section --- */}
      <main className="w-full max-w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Header */}
        <div>
          <h1 className="text-[26px] font-extrabold mb-2 text-white tracking-tight">Calculadora de Honorários</h1>
          <p className="text-[15px] text-[#bbbbbb] leading-relaxed">
            Acompanhe suas horas com precisão e gere relatórios instantâneos.
          </p>
        </div>

        {/* Timer Display */}
        <div>
          <div className="text-base font-semibold text-[#cccccc] mb-1">Tempo Decorrido</div>
          <div className="font-extrabold text-[#ffffff] tracking-tighter tabular-nums text-5xl sm:text-[58px] leading-tight my-2">
            {formattedTime}
            <span className="text-4xl sm:text-[40px] opacity-70">{formattedMs}</span>
          </div>
        </div>

        {/* Financials */}
        <div className="space-y-6">
          <div>
            <div className="text-base font-semibold text-[#cccccc] mb-1">Valor Bruto a Receber</div>
            <div className="text-4xl sm:text-[38px] font-extrabold text-app-green tracking-tight">
              {formatCurrency(gross)}
            </div>
          </div>

          <div>
            <div className="text-base font-semibold text-[#cccccc] mb-1">Valor Líquido a Receber</div>
            <div className="text-3xl sm:text-[32px] font-extrabold text-app-greenLight tracking-tight">
              {formatCurrency(net)}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="hourlyRate" className="block text-[15px] font-semibold text-[#cccccc] mb-2">
              Valor por Hora (R$)
            </label>
            <input
              id="hourlyRate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
              step="0.01"
              min="0"
              className="w-full p-[18px] text-[19px] text-center bg-app-input border-2 border-[#2a5d84] rounded-2xl text-white focus:outline-none focus:border-app-blue transition-colors appearance-none"
            />
          </div>

          <div>
            <label htmlFor="taxRate" className="block text-[15px] font-semibold text-[#cccccc] mb-2">
              Impostos e taxas (%) – opcional
            </label>
            <input
              id="taxRate"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              step="0.01"
              min="0"
              max="100"
              className="w-full p-[18px] text-[19px] text-center bg-app-input border-2 border-[#2a5d84] rounded-2xl text-white focus:outline-none focus:border-app-blue transition-colors appearance-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={toggleTimer}
            className={`flex-1 p-5 text-[19px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg ${
              isRunning ? 'bg-app-orange text-white' : 'bg-app-blue text-white'
            }`}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 p-5 text-[19px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg bg-app-red text-white"
          >
            Resetar
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full p-4 text-[16px] font-bold rounded-2xl transition-all active:translate-y-1 shadow-lg bg-app-greenLight text-white mt-2 flex items-center justify-center gap-2 hover:brightness-110"
        >
          {copyFeedback}
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 text-left bg-black/20 rounded-xl p-4 max-h-[200px] overflow-y-auto history-scroll border border-white/5">
            <div className="text-xs font-bold text-white/40 uppercase mb-2 tracking-wider">Histórico Recente</div>
            <div className="space-y-0">
              {history.map((item) => (
                <div key={item.id} className="py-2 border-b border-white/10 last:border-0 text-[14px] opacity-90 text-white/90">
                  <span className="font-semibold text-app-blue">{item.date}</span> • {item.duration} • <span className="text-app-greenLight">{item.gross}</span> ({item.net})
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- Publisher Content Section (Critical for AdSense) --- */}
      <article className="w-full max-w-2xl text-[#d1d5db] space-y-10 pb-12 leading-relaxed">
        <header className="border-b border-white/10 pb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Guia Prático: Como Calcular seus Honorários</h2>
          <p className="text-lg text-[#9ca3af]">
            Dominar a precificação do seu trabalho é o primeiro passo para o sucesso como freelancer ou profissional liberal.
            Esta ferramenta ajuda você a transformar tempo em dinheiro, mas entender a estratégia por trás dos números é essencial.
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">Por que cronometrar seu trabalho?</h3>
          <p>
            Muitos profissionais subestimam o tempo gasto em tarefas "invisíveis" como reuniões, ajustes, 
            pesquisa e comunicação. Ao usar um cronômetro financeiro em tempo real (Time Tracking), você obtém:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#e5e7eb]">
            <li><strong className="text-app-blue">Precisão na cobrança:</strong> Evite "chutar" valores e cobrar menos do que trabalhou.</li>
            <li><strong className="text-app-blue">Dados para negociação:</strong> Apresente relatórios detalhados aos clientes sobre onde as horas foram investidas.</li>
            <li><strong className="text-app-blue">Aumento de produtividade:</strong> O simples ato de "dar play" cria um compromisso mental de foco na tarefa.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">Como definir o Valor da Hora Técnica?</h3>
          <p>
            O campo <em>"Valor por Hora"</em> não deve ser um número aleatório. Para chegar a um valor justo, utilize a seguinte lógica:
          </p>
          <div className="bg-white/5 p-6 rounded-xl border-l-4 border-app-green">
            <p className="font-mono text-sm text-app-greenLight mb-2">FÓRMULA BÁSICA</p>
            <p className="font-semibold text-white">
              (Custos Fixos Mensais + Salário Desejado + Margem de Lucro) ÷ Horas Produtivas Mensais
            </p>
          </div>
          <p>
            Lembre-se: Nem todas as horas do mês são "vendáveis". Considere apenas o tempo efetivamente dedicado a projetos de clientes.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">Entendendo Valor Bruto vs. Líquido</h3>
          <p>
            Um erro comum é gastar tudo o que entra. Nossa calculadora possui um campo de <strong>"Impostos e taxas"</strong> para ajudar você a visualizar a realidade.
          </p>
          <p>
            Se você é MEI, Simples Nacional ou Autônomo, insira a porcentagem aproximada de impostos (ex: 6% a 15%) ou taxas de plataformas (como Upwork ou 99Freelas). 
            O valor <span className="text-app-greenLight font-bold">Líquido</span> é o que realmente vai para o seu bolso.
          </p>
        </section>

        <section className="bg-black/20 p-8 rounded-2xl mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Perguntas Frequentes</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-app-blue mb-1">Essa ferramenta salva meus dados?</h4>
              <p className="text-sm">Sim. Seus dados de tempo e histórico são salvos automaticamente no seu navegador. Você pode fechar a aba e voltar depois sem perder o progresso.</p>
            </div>
            <div>
              <h4 className="font-semibold text-app-blue mb-1">Posso usar no celular?</h4>
              <p className="text-sm">Sim. O PayCalc funciona como um aplicativo (PWA). Você pode instalá-lo na tela inicial do seu Android ou iOS.</p>
            </div>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="w-full text-center border-t border-white/10 pt-8 pb-4 text-white/60 text-sm">
        <p className="mb-2">PayCalc © {new Date().getFullYear()} - Todos os direitos reservados.</p>
        <p>
          Desenvolvido por{' '}
          <a
            href="https://wa.me/5511988484500"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff9900] no-underline font-extrabold hover:text-[#ffad33] transition-colors"
          >
            Trafer Digital
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;