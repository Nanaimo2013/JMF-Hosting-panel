export const JmfConfig = {
    name: 'JMF Hosting',
    version: '1.0.0',
    colors: {
        primary: '#1a1c23',
        secondary: '#2d3748',
        accent: '#3182ce',
        text: '#e2e8f0',
        success: '#48bb78',
        danger: '#f56565',
        warning: '#ed8936',
    },
    notifications: {
        position: 'top-right',
        duration: 5000,
        maxVisible: 5,
    },
    fileManager: {
        maxUploadSize: 100 * 1024 * 1024, // 100MB
        allowedFileTypes: '*',
        maxConcurrentUploads: 3,
        defaultView: 'grid', // 'grid' or 'list'
        showHiddenFiles: false,
    },
    console: {
        maxLines: 1000,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        theme: {
            background: '#1a1c23',
            cursor: '#3182ce',
            black: '#1a1c23',
            red: '#fc8181',
            green: '#68d391',
            yellow: '#f6e05e',
            blue: '#63b3ed',
            magenta: '#b794f4',
            cyan: '#4fd1c5',
            white: '#f7fafc',
            brightBlack: '#4a5568',
            brightRed: '#feb2b2',
            brightGreen: '#9ae6b4',
            brightYellow: '#faf089',
            brightBlue: '#90cdf4',
            brightMagenta: '#d6bcfa',
            brightCyan: '#76e4dd',
            brightWhite: '#ffffff',
            selection: '#2d3748',
        },
    },
    sidebar: {
        minWidth: 64,
        maxWidth: 280,
        defaultWidth: 280,
    },
    charts: {
        refreshInterval: 2000,
        dataPoints: 20,
        smoothing: 0.3,
    },
    TERMINAL_PRELUDE: '[JMF Hosting]',
} as const;

export default JmfConfig; 