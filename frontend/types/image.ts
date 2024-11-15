export interface ImageUploadProps {
    name: string;
    onFileSelect: (file: File | null) => void;
}