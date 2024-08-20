import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom'; // Linkをインポート
import './Game.css';

const NUM_MOLES = 9;
const MOLE_DEFAULT_IMAGE = '/mole.png';
const MOLE_HIT_IMAGE = '/mole_hit.png';
const HAMMER_IMAGE = '/hammer.png';
const HAMMER_SIZE = 80;

function Game() {
  const [moles, setMoles] = useState(Array(NUM_MOLES).fill(false));
  const [moleImages, setMoleImages] = useState(Array(NUM_MOLES).fill(MOLE_DEFAULT_IMAGE));
  const [score, setScore] = useState(0);
  const [hammerRotation, setHammerRotation] = useState(0);
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [hitPosition, setHitPosition] = useState({ x: 0, y: 0 });
  const [showHit, setShowHit] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3); // カウントダウンの初期値
  const [gameTime, setGameTime] = useState(10); // ゲームの制限時間
  const [gameStarted, setGameStarted] = useState(false); // ゲームがスタートしたかどうか
  const [showCountdown, setShowCountdown] = useState(false); // カウントダウンの表示

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');

  let moleInterval = 1000; // デフォルトはEasyモード
  if (mode === 'medium') moleInterval = 700;
  else if (mode === 'hard') moleInterval = 500;

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showCountdown) {
      setGameStarted(true);
      setShowCountdown(false);
      startGame();
    }
  }, [countdown, showCountdown]);

  useEffect(() => {
    if (gameTime > 0 && gameStarted) {
      const gameTimer = setInterval(() => {
        setGameTime(gameTime - 1);
      }, 1000);
      return () => clearInterval(gameTimer);
    } else if (gameTime === 0) {
      setGameOver(true);
    }
  }, [gameTime, gameStarted]);

  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(3); // カウントダウンをリセット
  };

  const startGame = () => {
    setGameTime(10); // ゲーム時間をリセット
    setGameOver(false);
    setScore(0);

    const interval = setInterval(() => {
      if (!gameOver) {
        updateMoles();
      }
    }, moleInterval);
    return () => clearInterval(interval);
  };

  const updateMoles = () => {
    const newMoles = moles.map(() => Math.random() < 0.3);
    setMoles(newMoles);
    setMoleImages(Array(NUM_MOLES).fill(MOLE_DEFAULT_IMAGE));
  };

  const handleMouseMove = (e) => {
    setHammerPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseClick = () => {
    rotateHammer();
  };

  const rotateHammer = () => {
    setHammerRotation(-90);
    setTimeout(() => {
      setHammerRotation(0);
    }, 300);
  };

  const hitMole = (index, e) => {
    if (moles[index] && !gameOver) {
      incrementScore();
      updateMoleImage(index);
      showHitEffect(e);
      rotateHammer();
    }
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  const updateMoleImage = (index) => {
    const newMoleImages = [...moleImages];
    newMoleImages[index] = MOLE_HIT_IMAGE;
    setMoleImages(newMoleImages);
  };

  const showHitEffect = (e) => {
    setHitPosition({ x: e.clientX, y: e.clientY });
    setShowHit(true);
    setTimeout(() => {
      setShowHit(false);
    }, 500);
  };

    const resetGame = () => {
        setScore(0);
        setMoles(Array(NUM_MOLES).fill(false));
        setMoleImages(Array(NUM_MOLES).fill(MOLE_DEFAULT_IMAGE));
        setGameOver(false);
        setCountdown(3); // カウントダウンをリセット
        setGameStarted(false); // ゲームが開始されていない状態に戻す
        setShowCountdown(false); // カウントダウン表示をオフ
    };

  return (
    <div className="Game" onMouseMove={handleMouseMove} onClick={handleMouseClick}>
        {showCountdown && (
            <div className="overlay">
            <h2 className="countdown">{countdown}</h2>
            </div>
        )}
        {!gameStarted && !showCountdown && (
            <div className="overlay">
            <button className="start-button" onClick={startCountdown}>Start</button>
            </div>
        )}
        {gameOver && (
        <div className="overlay">
            <div className="game-over-container">
            <h2 className="game-over">Finish!</h2>
            <p className="final-score">Score: {score}</p>
            <div className="button-container">
                <button className="restart-button" onClick={resetGame}>もう一度</button>
                <Link to="/" className="top-button">TOP</Link>
            </div>
            </div>
        </div>
        )}

      {gameStarted && gameTime > 0 && <h2>Time Left: {gameTime}s</h2>}
      <Hammer position={hammerPosition} rotation={hammerRotation} />
      {showHit && <HitEffect position={hitPosition} />}
      <h1>
        {mode === "easy" && "かんたんモード"}
        {mode === "medium" && "ふつうモード"}
        {mode === "hard" && "むずかしいモード"}
      </h1>
      <p className="score">Score: {score}</p>
      <MoleGrid moles={moles} moleImages={moleImages} onMoleClick={hitMole} />
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
}

const Hammer = ({ position, rotation }) => (
  <div
    id="hammer"
    style={{
      position: 'absolute',
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      width: `${HAMMER_SIZE}px`,
      height: `${HAMMER_SIZE}px`,
      background: `url(${HAMMER_IMAGE}) no-repeat center center`,
      backgroundSize: 'contain',
      pointerEvents: 'none',
      zIndex: 1000,
    }}
  />
);

const HitEffect = ({ position }) => (
  <div
    className="hit-text"
    style={{
      position: 'absolute',
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: 'translate(-50%, -50%)',
      color: 'red',
      fontSize: '24px',
      zIndex: 1001,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    }}
  >
    Hit!
  </div>
);

const MoleGrid = ({ moles, moleImages, onMoleClick }) => (
  <div className="mole-grid">
    {moles.map((mole, index) => (
      <div key={index} className="hole">
        {mole || moleImages[index] === MOLE_HIT_IMAGE ? (
          <motion.img
            src={`${process.env.PUBLIC_URL}${moleImages[index]}`}
            alt="mole"
            className="mole"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => onMoleClick(index, e)}
          />
        ) : null}
      </div>
    ))}
  </div>
);

export default Game;
