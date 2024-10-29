import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="sticky bottom-0 flex justify-center items-center p-4 bg-gray-800 text-white">
            <div className="text-center text-xl font-bold">
                <Link href="/">
                    <div className="text-white no-underline">About</div>
                </Link>
            </div>
        </footer>
    );
};