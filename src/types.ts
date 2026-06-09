// data types
interface Entry { // base type for all entries (workspace, board, column, card)
    id: string;
    title: string;
    description?: string;
    createdAt: number;
    modifiedAt: number;
}

export const Priority = ['low', 'medium', 'high'] as const; // 'as const' makes the array readonly and infers the type as a tuple of string literals instead of string[]
export type Priority = typeof Priority[number]; // this creates a type that can be 'low', 'medium', or 'high'

export const CardType = ['unassigned', 'story', 'bug', 'debt', 'spike'] as const;
export type CardType = typeof CardType[number];

export type Card = Entry & {
    priority: Priority;
    type: CardType;
    points?: number; // OPTIONAL: story points if the card is a task
    dueDate?: number; // OPTIONAL: end date if the card is a task
};

export type Column = Entry & {
    cards: Card[];
};

export type Board = Entry & {
    columns: Column[];
};

export type Workspace = Entry & {
    boards: Board[];
};

// other types

export type NewCardInput = Omit<Card, 'id' | 'createdAt' | 'modifiedAt'>; // for creating a new card, we don't need id, createdAt, or modifiedAt
/**
 * notes/concepts covered:
 * "Omit"
 * - a TypeScript utility type; constructs a new type by excluding specified keys from an existing type.
 * - In this case, it creates a new type based on "Card" but without the "id", "createdAt", and "modifiedAt" properties.
 * 
 * "const assertion" (as const)
 * - a TypeScript feature that allows you to create a readonly tuple or object literal.
 * - When you use "as const" with an array, it infers the type as a tuple of string literals instead of a general string array.
 * - In this case, it allows us to define the "Priority" type as a union of specific string literals ('low', 'medium', 'high') rather than just "string".
 * - this a "value", not a type, but it helps us create a type from the values in the array.
 * 
 * "type"
 * - a TypeScript feature that allows you to define a new type.
 * - In this case, it is used to define types like "Card", "Column", "Board", "Workspace", and "NewCardInput".
 * 
 * "interface"
 * - a TypeScript feature that allows you to define a contract for the shape of an object.
 * - In this case, it is used to define the "Entry" interface, which serves as a base type for all entries (workspace, board, column, card).
  
"type vs interface"
  ┌─────────────────────────────────────────────────────────────┬───────────┬──────────────┐
  │                                                             │ interface │     type     │
  ├─────────────────────────────────────────────────────────────┼───────────┼──────────────┤
  │ Object shapes                                               │ ✅        │ ✅           │
  ├─────────────────────────────────────────────────────────────┼───────────┼──────────────┤
  │ Unions ('low' | 'high')                                     │ ❌ can't  │ ✅ only type │
  ├─────────────────────────────────────────────────────────────┼───────────┼──────────────┤
  │ Intersections, tuples, primitives, mapped/conditional types │ ❌        │ ✅           │
  ├─────────────────────────────────────────────────────────────┼───────────┼──────────────┤
  │ Extending                                                   │ extends   │ &            │
  ├─────────────────────────────────────────────────────────────┼───────────┼──────────────┤
  │ Declaration merging (reopen to add members)                 │ ✅        │ ❌           │
  └─────────────────────────────────────────────────────────────┴───────────┴──────────────┘

 * 
 * */
