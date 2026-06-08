'use client';

import { useEffect } from 'react';
import React from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: ModalSize;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) {

    /* ---------------- Lock body scroll ---------------- */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    /* ---------------- ESC key close ---------------- */
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-custom" >
            <div
                className={`modal-dialog-custom modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content-custom">

                    {/* Header */}
                    <div className="modal-header-custom">
                        {title && <h5 className="modal-title-custom">{title}</h5>}
                        <button
                            className="modal-close-btn btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body-custom">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}
