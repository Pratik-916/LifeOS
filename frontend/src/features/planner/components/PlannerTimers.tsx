import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Play, Pause, RotateCcw, Clock, Watch, Timer, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'watch';

export const PlannerTimers: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default for pomodoro
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [countdownInput, setCountdownInput] = useState('05:00');
  const [watchTime, setWatchTime] = useState(new Date());

  const timerRef = useRef<number | null>(null);

  // Watch Mode
  useEffect(() => {
    if (mode === 'watch') {
      const interval = window.setInterval(() => setWatchTime(new Date()), 1000);
      return () => window.clearInterval(interval);
    }
  }, [mode]);

  // Main Timer Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'pomodoro') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleFinish('Pomodoro session completed!');
              return 0;
            }
            return prev - 1;
          });
        } else if (mode === 'stopwatch') {
          setStopwatchTime(prev => prev + 1);
        } else if (mode === 'countdown') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleFinish('Countdown completed!');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleFinish = (message: string) => {
    setIsRunning(false);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Finished', { body: message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Finished', { body: message });
        }
      });
    }
    // Also play a sound if needed, but a simple alert or toast works too.
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setTimeLeft(25 * 60);
    } else if (mode === 'stopwatch') {
      setStopwatchTime(0);
    } else if (mode === 'countdown') {
      applyCountdown();
    }
  };

  const applyCountdown = useCallback(() => {
    const parts = countdownInput.split(':');
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const s = parseInt(parts[1], 10);
      if (!isNaN(m) && !isNaN(s)) {
        setTimeLeft(m * 60 + s);
        return;
      }
    }
    setTimeLeft(5 * 60); // fallback
  }, [countdownInput]);

  useEffect(() => {
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'stopwatch') setStopwatchTime(0);
    if (mode === 'countdown') applyCountdown();
    setIsRunning(false);
  }, [mode, applyCountdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatStopwatch = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`;
    return `${m}:${s}`;
  };

  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center h-full bg-gradient-to-b from-surfaceHighlight to-surfaceHighlight/10 border-border/20 shadow-sm relative overflow-hidden">
      
      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 bg-background/50 p-1 rounded-lg border border-border/10">
        <button onClick={() => setMode('pomodoro')} className={`p-2 rounded-md transition-colors ${mode === 'pomodoro' ? 'bg-primary text-background' : 'text-secondary hover:bg-surfaceHighlight'}`} title="Pomodoro">
          <Clock className="w-4 h-4" />
        </button>
        <button onClick={() => setMode('stopwatch')} className={`p-2 rounded-md transition-colors ${mode === 'stopwatch' ? 'bg-primary text-background' : 'text-secondary hover:bg-surfaceHighlight'}`} title="Stopwatch">
          <Timer className="w-4 h-4" />
        </button>
        <button onClick={() => setMode('countdown')} className={`p-2 rounded-md transition-colors ${mode === 'countdown' ? 'bg-primary text-background' : 'text-secondary hover:bg-surfaceHighlight'}`} title="Countdown">
          <Bell className="w-4 h-4" />
        </button>
        <button onClick={() => setMode('watch')} className={`p-2 rounded-md transition-colors ${mode === 'watch' ? 'bg-primary text-background' : 'text-secondary hover:bg-surfaceHighlight'}`} title="Watch">
          <Watch className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
        {mode === 'pomodoro' && 'Pomodoro Focus'}
        {mode === 'stopwatch' && 'Stopwatch'}
        {mode === 'countdown' && 'Countdown Timer'}
        {mode === 'watch' && 'Current Time'}
      </h3>

      {/* Timer Display */}
      <div className="text-5xl font-bold tracking-tighter text-primary mb-4 font-mono">
        {mode === 'pomodoro' && formatTime(timeLeft)}
        {mode === 'stopwatch' && formatStopwatch(stopwatchTime)}
        {mode === 'countdown' && formatTime(timeLeft)}
        {mode === 'watch' && watchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {mode === 'countdown' && !isRunning && (
        <input 
          type="text" 
          value={countdownInput}
          onChange={(e) => setCountdownInput(e.target.value)}
          onBlur={applyCountdown}
          className="bg-surface border border-border/20 rounded-lg px-2 py-1 text-center w-24 text-sm font-mono mb-4 focus:outline-none focus:border-accent"
          placeholder="MM:SS"
        />
      )}

      {mode !== 'watch' && (
        <div className="flex gap-3 mt-2">
          <Button variant="primary" size="lg" onClick={toggleTimer} className="w-12 h-12 p-0 rounded-full shadow-lg">
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
          </Button>
          <Button variant="secondary" size="lg" onClick={resetTimer} className="w-12 h-12 p-0 rounded-full border-border/20">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};
