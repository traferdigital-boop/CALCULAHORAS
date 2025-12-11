import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, HistoryItem } from '../types';
import { formatTimeParts } from '../utils/format';

const STORAGE_KEY = 'paycalc_state_v3';
const HISTORY_KEY = 'paycalc_history_v3';

// Base64 short beep for hour mark
const BEEP_AUDIO = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; 

export const useStopwatch = () => {
  // State
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hourlyRate, setHourlyRate] = useState<number>(150);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Refs for logic that doesn't need immediate re-renders or is used inside RAF
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastHourRef = useRef<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(BEEP_AUDIO);
  }, []);

  // Load from Storage on Mount
  useEffect(() => {
    const savedStateStr = localStorage.getItem(STORAGE_KEY);
    const savedHistoryStr = localStorage.getItem(HISTORY_KEY);

    if (savedHistoryStr) {
      try {
        setHistory(JSON.parse(savedHistoryStr));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        setHourlyRate(savedState.hourlyRate ?? 150);
        setTaxRate(savedState.taxRate ?? 20);
        
        if (savedState.isRunning) {
           setElapsedTime(savedState.elapsedTime || 0);
           setIsRunning(false); // Force pause on reload for safety
        } else {
           setElapsedTime(savedState.elapsedTime || 0);
           setIsRunning(false);
        }
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
  }, []);

  // Persist State logic
  useEffect(() => {
    const stateToSave = {
      elapsedTime,
      isRunning,
      hourlyRate,
      taxRate
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [elapsedTime, isRunning, hourlyRate, taxRate]);

  // Persist History
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Animation Loop
  const animate = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsedTime((prevTotal) => {
        const currentNow = Date.now();
        const diff = currentNow - (startTimeRef.current || currentNow);
        startTimeRef.current = currentNow;
        
        const newTotal = prevTotal + diff;

        // Check hour mark
        const h = Math.floor(newTotal / 3600000);
        if (h > lastHourRef.current && h > 0) {
          lastHourRef.current = h;
          audioRef.current?.play().catch(() => {});
        }

        return newTotal;
      });

      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  // Actions
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (elapsedTime > 5000) {
      addToHistory();
    }
    setIsRunning(false);
    setElapsedTime(0);
    lastHourRef.current = -1;
  };

  const addToHistory = () => {
    // Calculate final values for history
    const gross = (elapsedTime / 3600000) * hourlyRate;
    const net = taxRate > 0 ? gross * (1 - taxRate / 100) : gross;

    // Use the imported utility directly instead of dynamic import
    const { formattedTime, formattedMs } = formatTimeParts(elapsedTime);
    
    const timeStr = formattedTime + formattedMs;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      duration: timeStr,
      gross: gross.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      net: net.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };

    setHistory(prev => {
      const newHistory = [newItem, ...prev].slice(0, 50); // Keep last 50
      return newHistory;
    });
  };

  return {
    elapsedTime,
    isRunning,
    hourlyRate,
    setHourlyRate,
    taxRate,
    setTaxRate,
    history,
    toggleTimer,
    resetTimer
  };
};