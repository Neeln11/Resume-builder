declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: {
            type?: 'jpeg' | 'png' | 'webp';
            quality?: number;
        };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            onclone?: (doc: Document) => void;
            [key: string]: any;
        };
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: 'portrait' | 'landscape';
        };
    }

    interface Html2PdfInstance {
        set(options: Html2PdfOptions): Html2PdfInstance;
        from(element: HTMLElement): Html2PdfInstance;
        save(): Promise<void>;
        output(type: string): Promise<any>;
    }

    function html2pdf(): Html2PdfInstance;
    export default html2pdf;
}
