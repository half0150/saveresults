export interface Match {
    player1: string;
    player2: string;
    winner: string;
    player1_points: number;
    player2_points: number;
    match_date: string;
}

export interface LeaderboardEntry {
    player: string;
    wins: number;
    win_percentage: number;
}

export interface ResponseData {
    leaderboard?: LeaderboardEntry[];
    matches?: Match[];
    message?: string;
}

export const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};