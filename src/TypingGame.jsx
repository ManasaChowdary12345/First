import React, { useState, useEffect } from 'react';
import './TypingGame.css';

const sampleTexts = {
  coding: [
    "const hello = 'world';",
    "function greet(name) { return `Hello, ${name}`; }",
    "for (let i = 0; i < 10; i++) { console.log(i); }"
  ],
  literature: [
    "It was the best of times, it was the worst of times.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold."
  ],
  quotes: [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "In the middle of every difficulty lies opportunity.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts."
  ],
  science: [
    "The Earth revolves around the Sun in an elliptical orbit.",
    "Every action has an equal and opposite reaction.",
    "Water is composed of two hydrogen atoms and one oxygen atom."
  ]
};

const TypingGame = () => {
  const [theme, setTheme] = useState('coding');
  const [currentText, setCurrentText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setNewText();
  }, [theme]);

  const setNewText = () => {
    const texts = sampleTexts[theme];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setInput('');
    setStartTime(null);
    setAccuracy(0);
    setWpm(0);
    setTimeTaken(0);
    setFeedback('');
    setIsCompleted(false);
    setIsTimerRunning(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
      setIsTimerRunning(true);
    }

    setInput(value);
  };

  const handleSubmit = () => {
    // Calculate accuracy
    const correctChars = input.split('').filter((char, i) => char === currentText[i]).length;
    const accuracyValue = ((correctChars / input.length) * 100).toFixed(2);

    // Calculate WPM
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const words = currentText.split(' ').length;
    const wpmValue = timeInMinutes > 0 ? (words / timeInMinutes).toFixed(2) : 0;

    // Set state values
    setAccuracy(accuracyValue);
    setWpm(wpmValue);
    setTimeTaken(((endTime - startTime) / 1000).toFixed(2));

    // Provide feedback
    let emoji = '';
    let message = '';

    if (input.trim() === currentText.trim()) {
      if (accuracyValue >= 90 && wpmValue >= 10) {
        emoji = '🌟';
        message = 'Excellent! You’re a pro!';
      } else if (accuracyValue >= 80 && accuracyValue < 90 && wpmValue > 10) {
        emoji = '😊';
        message = 'Great job! Keep practicing!';
      } else if (accuracyValue >= 60 && accuracyValue < 80 && wpmValue > 10) {
        emoji = '😐';
        message = 'Good effort, but there’s room for improvement!';
      } else {
        emoji = '😟';
        message = 'Don’t worry, keep practicing and you’ll get better!';
      }
    } else {
      emoji = '😕';
      message = 'Oops! You missed some parts. Try again!';
    }

    setFeedback(`${emoji} ${message}`);
    setIsCompleted(true);
    setIsTimerRunning(false);
    setStartTime(null);
  };

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        alert(`\nThanks for choosing this platform! 😊\n\nYour results are:\nAccuracy: ${accuracy}%\nWords Per Minute: ${wpm}\nTime Taken: ${timeTaken} seconds\nFeedback: ${feedback}`);
        setNewText();
      }, 4000);
    }
  }, [isCompleted, accuracy, wpm, timeTaken, feedback]);

  return (
    <div className="typing-game-container">
      <h1 className="game-title">Interactive Typing Game</h1>

      <div className="theme-selector">
        <label>Select Theme: </label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="coding">Coding</option>
          <option value="literature">Literature</option>
          <option value="quotes">Quotes</option>
          <option value="science">Science</option>
        </select>
      </div>

      <p className="text-prompt">Text:</p>
      <div className="text-display">{currentText}</div>

      <textarea
        className="typing-input"
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing here..."
      ></textarea>

      <div className="results">
        <p><strong>Accuracy:</strong> {accuracy}%</p>
        <p><strong>Words Per Minute (WPM):</strong> {wpm}</p>
        <p><strong>Time Taken:</strong> {timeTaken} seconds</p>
        <p><strong>Feedback:</strong> {feedback}</p>
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!isTimerRunning || input === ''}
      >
        Submit
      </button>
    </div>
  );
};

export default TypingGame;
