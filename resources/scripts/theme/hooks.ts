import { useEffect, useState } from 'react';
import { useSignal } from '@preact/signals-react';
import JmfConfig from './config';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export const useFileManagerView = () => {
    const isGridView = useSignal(JmfConfig.fileManager.defaultView === 'grid');

    useEffect(() => {
        const savedView = localStorage.getItem('fileManagerView');
        if (savedView) {
            isGridView.value = savedView === 'grid';
        }
    }, []);

    const toggleView = () => {
        isGridView.value = !isGridView.value;
        localStorage.setItem('fileManagerView', isGridView.value ? 'grid' : 'list');
    };

    return { isGridView, toggleView };
};

export const useUploadProgress = () => {
    const uploads = useSignal<Record<string, { loaded: number; total: number }>>({});
    const totalProgress = useSignal(0);

    const updateProgress = (fileName: string, loaded: number, total: number) => {
        uploads.value = {
            ...uploads.value,
            [fileName]: { loaded, total },
        };

        const totalLoaded = Object.values(uploads.value).reduce((sum, file) => sum + file.loaded, 0);
        const totalSize = Object.values(uploads.value).reduce((sum, file) => sum + file.total, 0);
        totalProgress.value = totalSize > 0 ? (totalLoaded / totalSize) * 100 : 0;
    };

    const removeUpload = (fileName: string) => {
        const { [fileName]: removed, ...rest } = uploads.value;
        uploads.value = rest;
    };

    const clearUploads = () => {
        uploads.value = {};
        totalProgress.value = 0;
    };

    return { uploads, totalProgress, updateProgress, removeUpload, clearUploads };
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        docx: 'fa-file-word',
        xls: 'fa-file-excel',
        xlsx: 'fa-file-excel',
        ppt: 'fa-file-powerpoint',
        pptx: 'fa-file-powerpoint',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        png: 'fa-file-image',
        gif: 'fa-file-image',
        zip: 'fa-file-archive',
        rar: 'fa-file-archive',
        txt: 'fa-file-alt',
        js: 'fa-file-code',
        css: 'fa-file-code',
        html: 'fa-file-code',
        php: 'fa-file-code',
        json: 'fa-file-code',
        yml: 'fa-file-code',
        yaml: 'fa-file-code',
        mp3: 'fa-file-audio',
        wav: 'fa-file-audio',
        mp4: 'fa-file-video',
        avi: 'fa-file-video',
        mov: 'fa-file-video',
    };

    return `fas ${icons[ext] || 'fa-file'}`;
};

type Theme = 'JMF Hosting';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage('theme', JmfConfig.name);

    const updateTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return { theme, updateTheme };
};

export const useSidebar = () => {
    const [isMinimized, setIsMinimized] = useLocalStorage('sidebarMinimized', false);
    const width = useSignal(isMinimized ? JmfConfig.sidebar.minWidth : JmfConfig.sidebar.defaultWidth);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        width.value = !isMinimized ? JmfConfig.sidebar.minWidth : JmfConfig.sidebar.defaultWidth;
    };

    return { isMinimized, width, toggleSidebar };
};