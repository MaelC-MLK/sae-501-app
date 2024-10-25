import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Image from 'next/image';

interface ImageUploadProps {
    name: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name }) => {
    const { setValue } = useFormContext();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

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
            const extension = `.${droppedFile.name.split('.').pop() || ""}`;
            setValue(name, extension);
            setFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const extension = `.${selectedFile.name.split('.').pop() || ""}`;
            setValue(name, extension);
            setFile(selectedFile);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setValue(name, undefined
        );
    };

    return (
        <div
            className={`relative border-2 p-4 rounded-md ${dragActive ? 'border-blue-500' : 'border-gray-300'} ${file ? 'border-none' : 'border-dashed'}`}
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
        </div>
    );
};

export default ImageUpload;