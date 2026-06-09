'use client';
import { cn } from '@/utils';
import { Board as BoardType } from '@/types';
import Column from '@/components/Column';

type BoardProps = {
    board: BoardType;
    className?: string;
};

const Board = ({ board, className }: BoardProps) => {
    return (
        <div className={cn('rounded-lg border border-zinc-200 bg-white shadow-sm', className)} data-component="board">
            <div className="border-b border-zinc-100 px-3 py-2 sm:px-4 sm:py-3" data-part="board-header">
                <h2 className="text-sm font-semibold text-zinc-800 sm:text-base" data-part="board-title">{board.title}</h2>
                {board.description && (
                    <p className="mt-0.5 text-xs text-zinc-400" data-part="board-description">{board.description}</p>
                )}
            </div>
            {/* overflow-x-auto + touch scrolling keeps all columns visible on mobile */}
            <div className="flex flex-row gap-2 overflow-x-auto p-3 [-webkit-overflow-scrolling:touch] sm:gap-3 sm:p-4" data-part="board-columns">
                {board.columns.map((column) => (
                    <Column key={column.id} column={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;