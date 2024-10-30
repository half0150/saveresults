import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="text-center p-4 text-white">
            <div className="text-xl font-bold">
                <Link href="/">
                    <div className="bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-3xl font-extrabold text-transparent">SaveResults</div>
                </Link>
            </div>
        </nav>
    );
};
