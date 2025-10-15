import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../styles/DragDropArea.css';

function DragDropArea({ onDrop, accept, files, onRemove }) {
    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0 && typeof onDrop === 'function') {
            onDrop(acceptedFiles);
        }
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: handleDrop,
        accept: accept || 'image/jpeg, image/png',
        multiple: true,
        noClick: files && files.length > 0, // Disable click when files exist
    });

    const handleRemoveClick = (e, id) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(id);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
    };

    const handleAddMoreClick = (e) => {
        e.stopPropagation();
        open();
    };

    return (
        <div {...getRootProps({ className: 'drag-drop-area' })}>
            <input {...getInputProps()} />
            {files && files.length > 0 ? (
                <div className="preview-grid">
                    {files.map((fileItem) => (
                        <div key={fileItem.id} className="preview-item">
                            <button 
                                className="preview-remove-btn" 
                                onClick={(e) => handleRemoveClick(e, fileItem.id)}
                                title="Remove"
                            >
                                ×
                            </button>
                            
                            {fileItem.previewUrl ? (
                                <img src={fileItem.previewUrl} alt={fileItem.file.name} className="preview-thumbnail" />
                            ) : (
                                <div className="preview-placeholder-small">
                                    <span>...</span>
                                </div>
                            )}
                            
                            <div className="preview-info">
                                <div className="preview-filename" title={fileItem.file.name}>
                                    {fileItem.file.name.length > 12 
                                        ? fileItem.file.name.substring(0, 12) + '...' 
                                        : fileItem.file.name}
                                </div>
                                <div className="preview-size">
                                    {formatFileSize(fileItem.file.size)}
                                    {fileItem.compressedFile && (
                                        <span className="preview-compressed">
                                            {' → '}{formatFileSize(fileItem.compressedFile.size)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="preview-progress-bar">
                                <div 
                                    className="preview-progress-fill" 
                                    style={{ width: `${fileItem.progress}%` }}
                                >
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="preview-item add-more-item" onClick={handleAddMoreClick}>
                        <div className="add-more-icon">+</div>
                        <div className="add-more-text">Add more</div>
                    </div>
                </div>
            ) : isDragActive ? (
                <p>Drop the image files here...</p>
            ) : (
                <p>Drag 'n' drop image files here (JPEG, PNG, WebP, HEIC), or click to select</p>
            )}
        </div>
    );
}

export default DragDropArea;