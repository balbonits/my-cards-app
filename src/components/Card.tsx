'use client';
import { cn } from '@/utils';
import { Card as CardType } from '@/types';

type CardProps = {
    card: CardType;
    className?: string;
};

const PRIORITY_STYLES: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
};

const TYPE_STYLES: Record<string, string> = {
    story: 'bg-blue-100 text-blue-700',
    bug: 'bg-red-100 text-red-700',
    debt: 'bg-orange-100 text-orange-700',
    spike: 'bg-purple-100 text-purple-700',
    unassigned: 'bg-zinc-100 text-zinc-500',
};

const Card = ({ card, className }: CardProps) => {
    return (
        <div className={cn(
            'group flex flex-col gap-1.5 rounded-md border border-zinc-200 bg-white p-2.5 shadow-sm sm:gap-2 sm:p-3',
            'hover:border-zinc-400 hover:shadow-md hover:cursor-pointer',
            className
        )} data-component="card">
            <div className="flex items-start justify-between gap-2" data-part="card-header">
                <h3 className="text-sm font-medium text-zinc-800 leading-snug" data-part="card-title">{card.title}</h3>
                <div className="flex shrink-0 gap-1" data-part="card-badges">
                    <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', TYPE_STYLES[card.type])} data-part="card-type">
                        {card.type}
                    </span>
                    <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', PRIORITY_STYLES[card.priority])} data-part="card-priority">
                        {card.priority}
                    </span>
                </div>
            </div>
            {card.description && (
                <p className="whitespace-pre-wrap text-xs text-zinc-500 leading-relaxed" data-part="card-description">{card.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-zinc-400" data-part="card-meta">
                {card.points !== undefined && (
                    <span data-part="card-points">{card.points} pts</span>
                )}
                {card.dueDate && (
                    <span data-part="card-due-date">Due {new Date(card.dueDate).toLocaleDateString()}</span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-zinc-300" data-part="card-timestamps">
                <span data-part="card-created-at">created {new Date(card.createdAt).toLocaleDateString()}</span>
                <span data-part="card-modified-at">modified {new Date(card.modifiedAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default Card;