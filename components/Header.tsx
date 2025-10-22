
import React from 'react';

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-sky-400">
        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.453.226.768.693.768 1.21 V19.5a1.875 1.875 0 0 1-1.875 1.875h-1.312a.375.375 0 0 0-.375.375v1.125a.375.375 0 0 1-.375.375H8.625a.375.375 0 0 1-.375-.375V21.75a.375.375 0 0 0-.375-.375H6.562A1.875 1.875 0 0 1 4.687 19.5V6.288c0-.517.315-.984.768-1.21l4.993-2.498ZM12 4.159l-4.125 2.063v10.519l4.125 2.062 4.125-2.062V6.222L12 4.159Z" clipRule="evenodd" />
        <path d="M18.375 4.312A1.875 1.875 0 0 1 20.25 6.187v11.563A1.875 1.875 0 0 1 17.625 19.5h-.375a.375.375 0 0 0-.375.375v1.125a.375.375 0 0 1-.375.375h-1.125a.375.375 0 0 1-.375-.375V19.875a.375.375 0 0 0-.375-.375h-.375a1.875 1.875 0 0 1-1.875-1.875V6.188a1.875 1.875 0 0 1 1.875-1.875h.375a.375.375 0 0 0 .375-.375V3a.375.375 0 0 1 .375-.375h1.125a.375.375 0 0 1 .375.375v.563a.375.375 0 0 0 .375.375h.375Z" />
    </svg>
);

export default function Header(): React.ReactElement {
    return (
        <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <MapIcon />
                        <h1 className="text-xl font-bold text-white tracking-tight">
                            Address Map Navigator
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
}
   