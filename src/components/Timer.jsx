import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Event Date: April 12, 2026
    const targetDate = new Date("2026-04-12T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer-wrapper">
      <p className="timer-announcement">April 12, 2026</p>
      
      <div className="timer-boxes">
        <div className="timer-box">
          <span className="timer-value">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="timer-label">Days</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-box">
          <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="timer-label">Hours</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-box">
          <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="timer-label">Minutes</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-box">
          <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="timer-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
