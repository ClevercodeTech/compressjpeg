import React, { useState, useEffect } from 'react';
import CompressionMenu from '../components/CompressionMenu.js';
import DragDropArea from '../components/DragDropArea';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { compressJPEG } from '../utils/jpegCompressor';
import '../styles/Home.css';
import compressIcon from '../asset/compress-icon.png';

// Helper to check supported image types
function isSupportedImage(file) {
    const type = file.type;
    const name = file.name.toLowerCase();
    return (
        type === 'image/jpeg' ||
        type === 'image/png' ||
        type === 'image/webp' ||
        type === 'image/heic' ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.png') ||
        name.endsWith('.webp') ||
        name.endsWith('.heic')
    );
}

const Home = () => {
    const [progress, setProgress] = useState(0);
    const [compressedFile, setCompressedFile] = useState(null);
    const [compressionOption, setCompressionOption] = useState('medium');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isHeic, setIsHeic] = useState(false);

    // Accept JPEG, PNG, WebP, HEIC, compress to JPEG
    const handleFileDrop = async (file) => {
        setProgress(0);
        setCompressedFile(null);
        setSelectedFile(file);
        setIsHeic(false);

        if (isSupportedImage(file)) {
            const isHeicFile =
                file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
            setIsHeic(isHeicFile);

            if (!isHeicFile) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null); // Can't preview HEIC
            }

            const compressed = await compressJPEG(file, compressionOption, setProgress);

            // For HEIC, show preview after conversion and compression
            if (isHeicFile && compressed) {
                setPreviewUrl(URL.createObjectURL(compressed));
            }

            setCompressedFile(compressed);
        } else {
            alert('Only JPEG, PNG, WebP, and HEIC files are accepted.');
        }
    };

    // Re-compress if compression option changes and a file is selected
    useEffect(() => {
        const compressOnOptionChange = async () => {
            if (selectedFile) {
                setProgress(0);
                setCompressedFile(null);
                const isHeicFile =
                    selectedFile.type === 'image/heic' ||
                    selectedFile.name.toLowerCase().endsWith('.heic');
                setIsHeic(isHeicFile);

                if (!isHeicFile) {
                    setPreviewUrl(URL.createObjectURL(selectedFile));
                } else {
                    setPreviewUrl(null);
                }

                const compressed = await compressJPEG(selectedFile, compressionOption, setProgress);

                if (isHeicFile && compressed) {
                    setPreviewUrl(URL.createObjectURL(compressed));
                }

                setCompressedFile(compressed);
            }
        };
        compressOnOptionChange();
 
    }, [compressionOption]);

    // Handle URL paste and fetch
    const handlePasteUrl = async () => {
        try {
            const text = await navigator.clipboard.readText();
            // Simple URL validation
            if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|heic)$/i.test(text)) {
                setImageUrl(text);
                setProgress(10);
                // Fetch image as blob
                const response = await fetch(text);
                const blob = await response.blob();
                // Create a File object for compression
                const ext = text.split('.').pop().toLowerCase();
                const mimeType = ext === 'jpg' || ext === 'jpeg'
                    ? 'image/jpeg'
                    : ext === 'png'
                    ? 'image/png'
                    : ext === 'webp'
                    ? 'image/webp'
                    : ext === 'heic'
                    ? 'image/heic'
                    : '';
                const file = new File([blob], `image.${ext}`, { type: mimeType });
                setSelectedFile(file);

                const isHeicFile = mimeType === 'image/heic' || ext === 'heic';
                setIsHeic(isHeicFile);

                if (!isHeicFile) {
                    setPreviewUrl(URL.createObjectURL(file));
                } else {
                    setPreviewUrl(null);
                }

                const compressed = await compressJPEG(file, compressionOption, setProgress);

                if (isHeicFile && compressed) {
                    setPreviewUrl(URL.createObjectURL(compressed));
                }

                setCompressedFile(compressed);
            } else {
                alert('Clipboard does not contain a valid image URL (jpg, jpeg, png, webp, heic).');
            }
        } catch (err) {
            alert('Could not read clipboard or fetch image.');
        }
    };

    return (
        <div className="home-container">
            <div className="privacy-banner">
                <div className="privacy-title">Private and Secure</div>
                <div className="privacy-subtext">Runs locally on your browser</div>
            </div>
            <img src={compressIcon} alt="Logo" className="logo" />
    
            <p className="subtitle">
                Compress JPEG, PNG, WebP, HEIC or convert them to JPEG. 
            </p>
            <CompressionMenu onSelect={setCompressionOption} />
            <DragDropArea
                onDrop={handleFileDrop}
                accept="image/jpeg,image/png,image/webp,image/heic"
                previewUrl={previewUrl}
            />
            <div style={{ margin: '18px 0' }}>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="Paste image URL here..."
                    style={{
                        width: '70%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '1em',
                        marginRight: '8px'
                    }}
                />
                <button
                    type="button"
                    onClick={handlePasteUrl}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#1fa463',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Paste URL
                </button>
            </div>
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