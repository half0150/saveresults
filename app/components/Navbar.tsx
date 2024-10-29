import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-xl font-bold">
                <Link href="/">
                    <div className="text-white no-underline">SaveResults</div>
                </Link>
            </div>
        </nav>
    );
};
