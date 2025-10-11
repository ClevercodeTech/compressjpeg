import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../styles/DragDropArea.css';

function DragDropArea({ onDrop, accept, previewUrl }) {
    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0 && typeof onDrop === 'function') {
            onDrop(acceptedFiles[0]);
        }
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: accept || 'image/jpeg, image/png',
    });

    return (
        <div {...getRootProps({ className: 'drag-drop-area' })}>
            <input {...getInputProps()} />
            {previewUrl ? (
                <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                </div>
            ) : isDragActive ? (
                <p>Drop the JPEG or PNG file here...</p>
            ) : (
                <p>Drag 'n' drop a JPEG or PNG file here, or click to select one</p>
            )}
        </div>
    );
}

export default DragDropArea;