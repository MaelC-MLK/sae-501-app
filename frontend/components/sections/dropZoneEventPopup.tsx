import React, { useState } from 'react';
import { UploadIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Image from 'next/image';
import { ImageUploadProps } from "@/types/image";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (!ALLOWED_FILE_TYPES.includes(droppedFile.type)) {
                setError('Veuillez déposer uniquement des fichiers JPG, PNG ou WEBP.');
                return;
            }
            if (droppedFile.size > MAX_FILE_SIZE) {
                setError('La taille du fichier ne doit pas dépasser 2MB.');
                return;
            }
            setFile(droppedFile);
            onFileSelect(droppedFile);
            setError(null);
        } else {
            setError('Veuillez déposer uniquement des fichiers JPG, PNG ou WEBP.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
                setError('Veuillez sélectionner uniquement des fichiers JPG, PNG ou WEBP.');
                return;
            }
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError('La taille du fichier dépasse la limite de 5MB.');
                return;
            }
            setFile(selectedFile);
            onFileSelect(selectedFile);
            setError(null);
        } else {
            setError('Veuillez sélectionner uniquement des fichiers image.');
        }
    };

    const handleRemove = () => {
        setFile(null);
        onFileSelect(null);
        setError(null);
    };

    return (
        <div
            className={`relative border-2 p-4 rounded-md ${dragActive ? 'border-teal-500' : 'border-gray-300'} ${file ? 'border-none' : 'border-dashed'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {file ? (
                <div className="relative w-fit">
                    <Image
                        src={URL.createObjectURL(file)}
                        alt="Uploaded Image"
                        width={50}
                        height={50}
                        className="object-cover rounded-md"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md"
                    >
                        <CrossCircledIcon className="w-5 h-5 text-black" />
                    </button>
                </div>
            ) : (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                        <UploadIcon className="w-7 h-7 text-gray-500 mb-3" />
                        <p className="text-center text-gray-500 text-sm">Glissez / déposez ou <span className='text-primary'>sélectionner une image</span> ici</p>
                        <p className='text-center text-gray-500 text-xs'>JPG, PNG ou WEBP</p>
                    </label>
                </>
            )}
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
};

export default ImageUpload;