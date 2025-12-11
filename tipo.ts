export interface HistoryItem {
  id: string;
  date: string;
  duration: string;
  gross: string;
  net: string;
}

export interface AppState {
  elapsedTime: number; // in milliseconds
  isRunning: boolean;
  startTime: number | null; // Timestamp when the current session started
  hourlyRate: number;
  taxRate: number;
  history: HistoryItem[];
}