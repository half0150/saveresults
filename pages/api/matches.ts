import type { NextApiRequest, NextApiResponse } from 'next'

interface Match {
    player1: string;
    player2: string;
    winner: string;
}

interface LeaderboardEntry {
    player: string;
    wins: number;
}

interface ResponseData {
    leaderboard: LeaderboardEntry[];
    matches: Match[];
}
// Using In-memory to store matches
let leaderboard: LeaderboardEntry[] = [];
let matches: Match[] = [];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'GET') {
        res.status(200).json({ leaderboard, matches });
    } else if (req.method === 'POST') {
        const newMatch: Match = req.body;
        matches.push(newMatch);

        const playerIndex = leaderboard.findIndex(entry => entry.player === newMatch.winner);
        if (playerIndex !== -1) {
            leaderboard[playerIndex].wins += 1;
        } else {
            leaderboard.push({ player: newMatch.winner, wins: 1 });
        }

        res.status(201).json({ leaderboard, matches });
    }
}