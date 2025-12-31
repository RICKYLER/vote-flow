import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ElectionCountdownProps {
  endDate: Date;
}

const ElectionCountdown = ({ endDate }: ElectionCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-destructive">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Voting has ended</span>
        </div>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary/10 border border-primary/20 rounded-lg w-16 h-16 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <span className="font-medium text-foreground">Time Remaining</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-2xl font-bold text-muted-foreground mt-[-1rem]">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl font-bold text-muted-foreground mt-[-1rem]">:</span>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <span className="text-2xl font-bold text-muted-foreground mt-[-1rem]">:</span>
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default ElectionCountdown;
