import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const timerId = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerId.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            audioRef.current.play();
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerId.current);
    }
    return () => clearInterval(timerId.current);
  }, [isRunning, breakLength, sessionLength, isSession]);

  const handleReset = () => {
    clearInterval(timerId.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="container text-center">
      <h1>25 + 5 Clock</h1>
      <div className="row">
        <div className="col">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
        <div className="col">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
      <div id="timer">
        <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>Reset</button>
      <audio id="beep" ref={audioRef} src="/button-16.wav" />
    </div>
  );
};

export default App;



