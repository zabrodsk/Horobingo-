import React from 'react';
import type { Tile as TileType } from '../types';

interface TileProps {
  tile: TileType;
  onToggle: (id: number) => void;
  isBingoTile: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, onToggle, isBingoTile }) => {
  return (
    <button
      onClick={() => onToggle(tile.id)}
      className={`relative flex items-center justify-center p-3 aspect-square rounded-lg shadow-md text-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 transform
        ${
          tile.done
            ? 'bg-indigo-500 text-white scale-105'
            : 'bg-slate-800 hover:bg-slate-700 hover:scale-105'
        }
        ${isBingoTile ? 'ring-4 ring-amber-400 animate-pulse' : ''}
      `}
      aria-pressed={tile.done}
    >
      <span className="absolute top-2 left-2 text-xs font-bold text-slate-500">
        #{tile.id + 1}
      </span>
      <span className={`text-sm md:text-base font-medium transition-opacity duration-300 ${tile.done ? 'opacity-50' : 'opacity-100'}`}>
        {tile.text}
      </span>
      {tile.done && (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-500 bg-opacity-70 rounded-lg transition-opacity duration-300">
          <svg
            className="w-12 h-12 text-white transform transition-transform duration-300 scale-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default Tile;
