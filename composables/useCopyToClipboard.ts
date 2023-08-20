import { useStore } from "~~/store";


export const useCopyToClipboard = () => {
    const store = useStore();
    return (text: string) => {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        store.pushNotification({
            type: "success",
            message: "Copied to clipboard",
            timeout: 5000,
        });
    }
}