import React, { useState, useEffect } from 'react';
import CompressionMenu from '../components/CompressionMenu.js';
import DragDropArea from '../components/DragDropArea';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { compressJPEG } from '../utils/jpegCompressor';
import '../styles/Home.css';
import compressIcon from '../asset/compress-icon.png';
const Home = () => {
    const [progress, setProgress] = useState(0);
    const [compressedFile, setCompressedFile] = useState(null);
    const [compressionOption, setCompressionOption] = useState('medium');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Accept JPEG and PNG, compress to JPEG
    const handleFileDrop = async (file) => {
        setProgress(0);
        setCompressedFile(null);
        setSelectedFile(file);
        // Only accept JPEG, JPG, or PNG
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.name.toLowerCase().endsWith('.jpg')
        ) {
            // Show preview
            setPreviewUrl(URL.createObjectURL(file));
            const compressed = await compressJPEG(file, compressionOption, setProgress);
            setCompressedFile(compressed);
        } else {
            alert('Only JPEG and PNG files are accepted.');
        }
    };

    // Re-compress if compression option changes and a file is selected
    useEffect(() => {
        const compressOnOptionChange = async () => {
            if (selectedFile) {
                setProgress(0);
                setCompressedFile(null);
                const compressed = await compressJPEG(selectedFile, compressionOption, setProgress);
                setCompressedFile(compressed);
            }
        };
        compressOnOptionChange();
    }, [compressionOption]);

    return (
        <div className="home-container">
            <div className="privacy-banner">
                <div className="privacy-title">Private and Secure</div>
                <div className="privacy-subtext"> Processed without leaving your browser</div>
            </div>
            <img src={compressIcon} alt="Logo" className="logo" />
            <p className="subtitle">
                Compress JPEG or convert PNG to JPEG.
            </p>
            <CompressionMenu onSelect={setCompressionOption} />
            <DragDropArea onDrop={handleFileDrop} accept="image/jpeg,image/png" previewUrl={previewUrl} />
            <ProgressBar progress={progress} />
            {compressedFile && (
                <DownloadButton
                    file={compressedFile}
                    originalName={selectedFile ? selectedFile.name : ''}
                    compressionOption={compressionOption}
                />
            )}
        </div>
    );
};

export default Home;