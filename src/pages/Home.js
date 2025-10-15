import React, { useState, useEffect, useRef } from 'react';
import CompressionMenu from '../components/CompressionMenu.js';
import DragDropArea from '../components/DragDropArea';
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
    const [files, setFiles] = useState([]);
    const [compressionOption, setCompressionOption] = useState('medium');
    const [imageUrl, setImageUrl] = useState('');
    const [nextId, setNextId] = useState(0);
    const [autoDownload, setAutoDownload] = useState(true);
    const downloadedFilesRef = useRef(new Set());

    // Accept JPEG, PNG, WebP, HEIC, compress to JPEG
    const handleFileDrop = async (droppedFiles) => {
        const supportedFiles = droppedFiles.filter(file => isSupportedImage(file));
        
        if (supportedFiles.length === 0) {
            alert('Only JPEG, PNG, WebP, and HEIC files are accepted.');
            return;
        }

        const newFiles = supportedFiles.map((file, index) => {
            const id = nextId + index;
            const isHeicFile = file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
            
            return {
                id,
                file,
                progress: 0,
                compressedFile: null,
                previewUrl: isHeicFile ? null : URL.createObjectURL(file),
                isHeic: isHeicFile,
            };
        });

        setNextId(nextId + supportedFiles.length);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);

        // Process each file
        newFiles.forEach((fileItem) => {
            compressFileItem(fileItem.id, fileItem.file, fileItem.isHeic);
        });
    };

    const compressFileItem = async (id, file, isHeicFile) => {
        const setProgressForFile = (progress) => {
            setFiles(prevFiles => 
                prevFiles.map(f => 
                    f.id === id ? { ...f, progress } : f
                )
            );
        };

        const compressed = await compressJPEG(file, compressionOption, setProgressForFile);

        if (compressed) {
            setFiles(prevFiles => 
                prevFiles.map(f => {
                    if (f.id === id) {
                        return {
                            ...f,
                            compressedFile: compressed,
                            previewUrl: isHeicFile ? URL.createObjectURL(compressed) : f.previewUrl,
                        };
                    }
                    return f;
                })
            );
            
            // Auto-download if enabled
            if (autoDownload && !downloadedFilesRef.current.has(id)) {
                downloadedFilesRef.current.add(id);
                setTimeout(() => {
                    downloadFile(compressed, file.name);
                }, 100);
            }
        }
    };

    const downloadFile = (compressedFile, originalName) => {
        const baseName = originalName.replace(/\.[^/.]+$/, '');
        const optionLabel = compressionOption.replace(/\s+/g, '').toLowerCase();
        const fileName = `${baseName}_${optionLabel}.jpg`;
        const url = URL.createObjectURL(compressedFile);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Re-compress if compression option changes
    useEffect(() => {
        if (files.length > 0) {
            // Clear downloaded files tracker
            downloadedFilesRef.current.clear();
            
            // Reset progress and compressed files for all
            setFiles(prevFiles => 
                prevFiles.map(f => ({
                    ...f,
                    progress: 0,
                    compressedFile: null,
                }))
            );

            // Re-compress all files
            files.forEach((fileItem) => {
                compressFileItem(fileItem.id, fileItem.file, fileItem.isHeic);
            });
        }
    }, [compressionOption]);

    // Handle URL paste and fetch
    const handlePasteUrl = async () => {
        try {
            const text = await navigator.clipboard.readText();
            // Simple URL validation
            if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|heic)$/i.test(text)) {
                setImageUrl(text);
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
                
                // Add as a new file to process
                handleFileDrop([file]);
                setImageUrl(''); // Clear input after adding
            } else {
                alert('Clipboard does not contain a valid image URL (jpg, jpeg, png, webp, heic).');
            }
        } catch (err) {
            alert('Could not read clipboard or fetch image.');
        }
    };

    const handleRemoveFile = (id) => {
        downloadedFilesRef.current.delete(id);
        setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
    };

    const handleDownloadAll = () => {
        files.forEach((fileItem, index) => {
            if (fileItem.compressedFile) {
                setTimeout(() => {
                    downloadFile(fileItem.compressedFile, fileItem.file.name);
                }, index * 100);
            }
        });
    };

    const allFilesCompressed = files.length > 0 && files.every(f => f.compressedFile);

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
            
            <div className="auto-download-container">
                <label className="auto-download-label">
                    <input
                        type="checkbox"
                        checked={autoDownload}
                        onChange={(e) => setAutoDownload(e.target.checked)}
                        className="auto-download-checkbox"
                    />
                    <span>Auto-download compressed images</span>
                </label>
            </div>
            
            <DragDropArea
                onDrop={handleFileDrop}
                accept="image/jpeg,image/png,image/webp,image/heic"
                files={files}
                onRemove={handleRemoveFile}
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
            {!autoDownload && allFilesCompressed && (
                <button
                    onClick={handleDownloadAll}
                    className="download-all-button"
                >
                    Download All Compressed Images ({files.length})
                </button>
            )}
        </div>
    );
};

export default Home;