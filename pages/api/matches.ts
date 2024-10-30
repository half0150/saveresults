import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

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

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const connection = await mysql.createConnection(dbConfig);

    if (req.method === 'GET') {
        const [matchRows] = await connection.execute<RowDataPacket[]>('SELECT * FROM matches ORDER BY id DESC LIMIT 10');
        const matches: Match[] = matchRows.map(row => ({
            player1: row.player1,
            player2: row.player2,
            winner: row.winner,
        }));
        const [leaderboardRows] = await connection.execute<RowDataPacket[]>('SELECT * FROM leaderboard ORDER BY wins DESC');
        const leaderboard: LeaderboardEntry[] = leaderboardRows as LeaderboardEntry[];
        res.status(200).json({ leaderboard, matches });
    } else if (req.method === 'POST') {
        const newMatch: Match = req.body;
        await connection.execute('INSERT INTO matches (player1, player2, winner) VALUES (?, ?, ?)', [newMatch.player1, newMatch.player2, newMatch.winner]);

        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM leaderboard WHERE player = ?', [newMatch.winner]);
        if (rows.length > 0) {
            await connection.execute('UPDATE leaderboard SET wins = wins + 1 WHERE player = ?', [newMatch.winner]);
        } else {
            await connection.execute('INSERT INTO leaderboard (player, wins) VALUES (?, 1)', [newMatch.winner]);
        }

        const [matchRows] = await connection.execute<RowDataPacket[]>('SELECT * FROM matches ORDER BY id DESC LIMIT 10');
        const matches: Match[] = matchRows.map(row => ({
            player1: row.player1,
            player2: row.player2,
            winner: row.winner,
        }));
        const [leaderboardRows] = await connection.execute<RowDataPacket[]>('SELECT * FROM leaderboard ORDER BY wins DESC');
        const leaderboard: LeaderboardEntry[] = leaderboardRows as LeaderboardEntry[];
        res.status(201).json({ leaderboard, matches });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' } as any);
    }

    await connection.end();
}