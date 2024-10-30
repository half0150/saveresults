import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface Match {
    player1: string;
    player2: string;
    winner: string;
    player1_points: number;
    player2_points: number;
    match_date: string;
}

interface LeaderboardEntry {
    player: string;
    wins: number;
    win_percentage: number;
}

interface ResponseData {
    leaderboard?: LeaderboardEntry[];
    matches?: Match[];
    message?: string;
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
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (req.method === 'POST') {
            const { player1, player2, winner, player1_points, player2_points } = req.body;
            await connection.execute(
                'INSERT INTO matches (player1, player2, winner, player1_points, player2_points) VALUES (?, ?, ?, ?, ?)',
                [player1, player2, winner, player1_points, player2_points]
            );

            await connection.execute(
                'INSERT INTO leaderboard (player, wins) VALUES (?, 1) ON DUPLICATE KEY UPDATE wins = wins + 1',
                [winner]
            );

            res.status(200).json({ message: 'Match saved successfully' });
        } else {
            const [matchRows] = await connection.execute<RowDataPacket[]>(
                'SELECT * FROM matches ORDER BY match_date DESC'
            );

            const matches: Match[] = matchRows.map(row => ({
                player1: row.player1,
                player2: row.player2,
                winner: row.winner,
                player1_points: row.player1_points,
                player2_points: row.player2_points,
                match_date: new Date(row.match_date).toISOString()
            }));

            const [leaderboardRows] = await connection.execute<RowDataPacket[]>(
                `SELECT player, wins, 
                (wins / (SELECT COUNT(*) FROM matches WHERE player1 = player OR player2 = player)) * 100 AS win_percentage 
                FROM leaderboard ORDER BY wins DESC`
            );

            const leaderboard: LeaderboardEntry[] = leaderboardRows.map(row => ({
                player: row.player,
                wins: row.wins,
                win_percentage: Number(row.win_percentage) || 0 
            }));

            res.status(200).json({ leaderboard, matches });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}