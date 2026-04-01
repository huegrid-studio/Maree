import { useState, useEffect, useRef } from 'react';

export const useAnimationTime = (enabled: boolean) => {
  const [time, setTime] = useState(0);
  const frameRef = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    if (!enabled) { 
      setTime(0);
      startRef.current = undefined;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return; 
    }
    
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      setTime(timestamp - startRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [enabled]);

  return time;
};
