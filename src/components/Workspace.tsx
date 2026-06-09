'use client';
import { Workspace as WorkspaceType } from '@/types';
import { cn } from '@/utils';

type WorkspaceProps = {
    workspace: WorkspaceType;
    className?: string;
};

const Workspace = ({ workspace, className }: WorkspaceProps) => {
    return (
        <div className={cn('flex min-h-screen flex-col bg-zinc-100', className)} data-component="workspace">
            <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 sm:py-4" data-part="workspace-header">
                <h1 className="text-lg font-semibold text-zinc-900 sm:text-xl" data-part="workspace-title">{workspace.title}</h1>
                {workspace.description && (
                    <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm" data-part="workspace-description">{workspace.description}</p>
                )}
            </header>
            <main className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3" data-part="workspace-boards">
                {workspace.boards.map((board) => (
                    <div key={board.id}
                        className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-zinc-400 hover:cursor-pointer hover:shadow-md"
                        data-part="workspace-board-card"
                    >
                        <h2 className="text-sm font-semibold text-zinc-800 sm:text-base" data-part="workspace-board-title">{board.title}</h2>
                        {board.description && (
                            <p className="text-xs text-zinc-500 sm:text-sm" data-part="workspace-board-description">{board.description}</p>
                        )}
                        <div className="mt-auto flex gap-3 text-xs text-zinc-400" data-part="workspace-board-meta">
                            <span>{board.columns.length} columns</span>
                            <span>{board.columns.reduce((acc, col) => acc + col.cards.length, 0)} cards</span>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Workspace;