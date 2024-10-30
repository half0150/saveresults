"use client";
import { useState, useEffect } from 'react';

const apiPath = '/api/matches';

interface Match {
  player1: string;
  player2: string;
  winner: string;
}

interface LeaderboardEntry {
  player: string;
  wins: number;
}

export default function Home() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [winner, setWinner] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch(apiPath)
      .then(response => response.json())
      .then(data => {
        setLeaderboard(data.leaderboard);
        setRecentMatches(data.matches);
      });
  }, []);

  const handleSaveResult = () => {
    const match = { player1, player2, winner };

    fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    })
      .then(response => response.json())
      .then(() => {
        fetch(apiPath)
          .then(response => response.json())
          .then(data => {
            setLeaderboard(data.leaderboard);
            setRecentMatches(data.matches);
          });
      });

    setPlayer1('');
    setPlayer2('');
    setWinner('');
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
        <label className="block mb-1" htmlFor="player2">Player 2</label>
        <input
          className="text-black w-full p-2 mb-4 border rounded-lg"
          type="text"
          placeholder="Player 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
        <label className="block mb-1" htmlFor="winner">Winner</label>
        <select
          className="text-black w-full p-2 mb-4 border rounded-lg"
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
        >
          <option value="">Select Winner</option>
          <option value={player1}>{player1}</option>
          <option value={player2}>{player2}</option>
        </select>
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
              <span>{match.player1} VS {match.player2} {match.winner === match.player1 ? '1-0' : '0-1'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}