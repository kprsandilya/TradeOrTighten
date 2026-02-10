"use client";

import React from "react";

type LoadingScreenProps = {
  message?: string;
  playersConnected?: number;
  totalPlayers?: number;
};

export function LoadingScreen({
  message = "Waiting for players...",
  playersConnected = 0,
  totalPlayers = 1,
}: LoadingScreenProps) {
  const percent = Math.min((playersConnected / totalPlayers) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>

        {/* Player connection info */}
        <p className="mb-4 text-sm text-gray-500">
          Players connected: {playersConnected}/{totalPlayers}
        </p>

        {/* Animated loader */}
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Optional spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
