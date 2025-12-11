export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatTimeParts = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  return {
    formattedTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    formattedMs: `,${String(milliseconds).padStart(2, '0')}`
  };
};

export const generateReport = (
  timeStr: string,
  grossStr: string,
  netStr: string,
  rate: number,
  tax: number
): string => {
  return `📊 RELATÓRIO DE HONORÁRIOS

⏱ Tempo trabalhado: ${timeStr}
💰 Valor bruto: ${grossStr}
💸 Valor líquido: ${netStr}
💼 Valor/hora: R$ ${rate.toFixed(2)}
📉 Impostos: ${tax}%

Gerado em ${new Date().toLocaleString('pt-BR')}`;
};