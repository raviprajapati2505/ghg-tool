import Swal from 'sweetalert2';
import 'animate.css';

type SweetAlertIcon = 'warning' | 'error' | 'success' | 'info' | 'question';

interface ConfirmationDialogOptions {
    title?: string;
    text?: string;
    itemName?: string;
    confirmButtonText?: string;
    action?: string;
    onConfirm: () => void | Promise<void>;
    icon?: SweetAlertIcon;
    confirmColor?: string;
    cancelColor?: string;
}

type NotificationOptions = {
    title?: string;
    text: string;
    icon?: SweetAlertIcon;
    timer?: number;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    confirmButtonColor?: string;
};

export const showConfirmationDialog = ({
    title = 'Are you sure?',
    text,
    itemName,
    confirmButtonText,
    action = 'delete',
    onConfirm,
    icon = 'warning',
    confirmColor = '#d33',
    cancelColor = '#3085d6'
}: ConfirmationDialogOptions): void => {
    const dialogText = text || `You are about to ${action} ${itemName ? `"${itemName}"` : 'this item'}.`;
    Swal.fire({
        title,
        text: dialogText,
        icon,
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: cancelColor,
        confirmButtonText: confirmButtonText || `Yes, ${action} it!`,
        cancelButtonText: 'Cancel',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

export const showNotification = ({
    title,
    text,
    icon = 'success',
    timer = 3000,
    showConfirmButton = true,
    confirmButtonText = 'OK',
    confirmButtonColor = '#3085d6',
}: NotificationOptions): void => {
    const defaultTitles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Info',
        question: 'Question',
    };

    Swal.fire({
        title: title || defaultTitles[icon],
        text,
        icon,
        timer: showConfirmButton ? undefined : timer,
        timerProgressBar: !showConfirmButton,
        showConfirmButton,
        confirmButtonText,
        confirmButtonColor,
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
    });
};

export const showErrorNotification = (text: string, options?: Omit<NotificationOptions, 'text' | 'icon'>) => {
    showNotification({
        icon: 'error',
        text,
        ...options,
    });
};

export const showSuccessNotification = (text: string, options?: Omit<NotificationOptions, 'text' | 'icon'>) => {
    showNotification({
        icon: 'success',
        text,
        ...options,
    });
};

export const showInfoNotification = (text: string, options?: Omit<NotificationOptions, 'text' | 'icon'>) => {
    showNotification({
        icon: 'info',    
        text,
        ...options,
    });
};