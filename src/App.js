import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Game from './Game';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

const TopPage = () => {
  return (
    <div>
      <h1>もぐらたたきゲーム</h1>
      <p>ゲームモードを選択してください</p>
      <div className="mode-buttons">
        <Link to="/game?mode=easy" className="mode-button">かんたん</Link>
        <Link to="/game?mode=medium" className="mode-button">ふつう</Link>
        <Link to="/game?mode=hard" className="mode-button">むずかしい</Link>
      </div>
    </div>
  );
}

export default App;
