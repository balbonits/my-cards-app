'use client';
import { cn } from '@/utils';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void; // optional analytics callback — fired when modal opens
};

const Modal = ({ title, description, children, isOpen, onClose, onOpen, className }: ModalProps) => {
    // latest-ref pattern: keeps onOpen out of the dependency array so an unstable
    // callback reference (e.g. inline arrow in the parent) doesn't re-fire the effect
    const onOpenRef = useRef(onOpen);
    useEffect(() => { onOpenRef.current = onOpen; });

    // hooks must run unconditionally — before any early return
    useEffect(() => {
        if (!isOpen) return;
        onOpenRef.current?.();  // analytics fires exactly once per open
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/50', className)}
            onClick={onClose}
            data-component="modal"
        >
            <div
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                data-part="modal-content"
            >
                <div className="mb-4 flex items-start justify-between" data-part="modal-header">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900" data-part="modal-title">{title}</h2>
                        {description && (
                            <p className="mt-0.5 text-sm text-zinc-500" data-part="modal-description">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                        aria-label="Close modal"
                        data-part="modal-close"
                    >
                        ✕
                    </button>
                </div>
                <div data-part="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;

/**
 * NOTES — Modal.tsx
 *
 * createPortal(children, domNode) — React 16+, not a React 19 feature.
 *   Renders children into domNode (document.body) instead of the component's
 *   parent. Escapes any parent overflow:hidden or z-index stacking context.
 *   React tree is unchanged — context and event bubbling still flow through it.
 *   Needs 'use client' in App Router because document.body is browser-only.
 *
 * useRef (latest-ref pattern) — keeps onOpen out of the useEffect dep array.
 *   An inline arrow passed as onOpen would re-fire the effect on every render
 *   if it were a dependency. Ref always holds the latest version; effect stays stable.
 *
 * Rules of Hooks — both useEffect calls are before `if (!isOpen) return null`.
 *   Hooks must run unconditionally on every render in the same order.
 *
 * useEffect cleanup — removes the keydown listener on close/unmount.
 *   Without it: listener stacks on every open → memory leak + multiple Escape handlers.
 *
 * stopPropagation — backdrop onClick closes; dialog onClick stops the bubble.
 *   Bubbling follows the React tree (not DOM), so this works correctly through the portal.
 */