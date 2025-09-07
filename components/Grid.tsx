
import React from 'react';
import type { Tile as TileType } from '../types';
import Tile from './Tile';

interface GridProps {
  tiles: TileType[];
  onToggleTile: (id: number) => void;
  bingoLine: number[] | null;
}

const Grid: React.FC<GridProps> = ({ tiles, onToggleTile, bingoLine }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 p-4 bg-slate-900/50 rounded-xl shadow-inner">
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          onToggle={onToggleTile}
          isBingoTile={bingoLine?.includes(tile.id) ?? false}
        />
      ))}
    </div>
  );
};

export default Grid;
