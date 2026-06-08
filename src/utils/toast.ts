'use client';

import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

type ToastifyParams = {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    options?: ToastOptions;
};

export function toastify({ message, type = 'success', options = {} }: ToastifyParams) {
    const config = { ...defaultOptions, ...options };
    switch (type) {
        case 'error':
            toast.error(message, config);
            break;
        case 'info':
            toast.info(message, config);
            break;
        case 'warning':
            toast.warning(message, config);
            break;
        default:
            toast.success(message, config);
    }
}
