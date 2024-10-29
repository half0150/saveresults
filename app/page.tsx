"use client";
import { useState } from 'react';

export default function Home() {
  const [player1, setPlayer1] = useState('');
  const [wins1, setWins1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [wins2, setWins2] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  const handleSaveResult = () => {
    const newEntry1 = { player: player1, wins: parseInt(wins1) };
    const newEntry2 = { player: player2, wins: parseInt(wins2) };
    setLeaderboard([...leaderboard, newEntry1, newEntry2].sort((a, b) => b.wins - a.wins));
    setRecentMatches([newEntry1, newEntry2, ...recentMatches]);
    setPlayer1('');
    setWins1('');
    setPlayer2('');
    setWins2('');
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8">
      <section className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Enter Result</h1>
        <label className="block mb-1" htmlFor="player1">Player 1</label>
        <input
          className="text-black w-full p-2 mb-4 border rounded-lg"
          type="text"
          placeholder="Player 1"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        <label className="block mb-1" htmlFor="wins1">Wins</label>
        <input
          className="text-black w-full p-2 mb-4 border rounded-lg"
          type="number"
          placeholder="Wins"
          value={wins1}
          onChange={(e) => setWins1(e.target.value)}
        />
        <label className="block mb-1" htmlFor="player2">Player 2</label>
        <input
          className="text-black w-full p-2 mb-4 border rounded-lg"
          type="text"
          placeholder="Player 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
        <label className="block mb-1" htmlFor="wins2">Wins</label>
        <input
          className="text-black w-full p-2 mb-4 border rounded-lg"
          type="number"
          placeholder="Wins"
          value={wins2}
          onChange={(e) => setWins2(e.target.value)}
        />
        <button
          className="w-full p-2 rounded-lg border"
          onClick={handleSaveResult}
        >
          Save Result
        </button>
      </section>

      <section className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Leaderboard</h2>
        <ul className="list-disc pl-5">
          {leaderboard.map((entry, index) => (
            <li key={index} className="mb-1">
              <span className="font-bold">{index + 1}. </span>
              <span>{entry.player}</span>
              <span className="ml-2">Wins: {entry.wins}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Recent Matches</h2>
        <ul className="list-disc pl-5">
          {recentMatches.map((match, index) => (
            <li key={index} className="mb-1">
              <span>{match.player}</span>
              <span className="ml-2">Wins: {match.wins}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}