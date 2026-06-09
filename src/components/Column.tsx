'use client';
import { cn } from '@/utils';
import { Column as ColumnType } from '@/types';
import Card from '@/components/Card';

type ColumnProps = {
    column: ColumnType;
    className?: string;
};

const Column = ({ column, className }: ColumnProps) => {
    return (
        <div className={cn('flex w-56 shrink-0 flex-col rounded-md bg-zinc-50 sm:w-64 md:w-72', className)} data-component="column">
            <div className="flex items-center justify-between px-3 py-2" data-part="column-header">
                <h3 className="text-xs font-semibold text-zinc-700 sm:text-sm" data-part="column-title">{column.title}</h3>
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
                    {column.cards.length}
                </span>
            </div>
            <div className="flex flex-col gap-2 p-2" data-part="column-cards">
                {column.cards.length === 0
                    ? <p className="py-6 text-center text-xs text-zinc-400" data-part="column-empty">No cards yet</p>
                    : column.cards.map((card) => (
                        <Card key={card.id} card={card} />
                    ))
                }
            </div>
        </div>
    );
};

export default Column;