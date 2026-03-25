interface InternetBridge {
    showDialog: () => void;
    hideDialog: () => void;
    showErrorDialog: (options: { title: string; message: string; onRetry?: () => void }) => void;
    hideErrorDialog: () => void;
}

let internet: InternetBridge | null = null;

export const setInternetContext = (ctx: any) => {
    internet = ctx;
};

export const setInternetContextGetter = () => internet;
