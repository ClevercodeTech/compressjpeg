import React from 'react';
import ProgressBar from './ProgressBar';
import '../styles/FileItem.css';

function FileItem({ file, previewUrl, progress, compressedFile, compressionOption, onRemove }) {
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="file-item">
            <button className="remove-button" onClick={onRemove} title="Remove">
                ×
            </button>
            
            <div className="file-item-content">
                <div className="file-preview">
                    {previewUrl ? (
                        <img src={previewUrl} alt={file.name} className="preview-thumbnail" />
                    ) : (
                        <div className="preview-placeholder">
                            <span>Processing...</span>
                        </div>
                    )}
                </div>
                
                <div className="file-details">
                    <div className="file-name" title={file.name}>
                        {file.name}
                    </div>
                    <div className="file-size">
                        Original: {formatFileSize(file.size)}
                        {compressedFile && (
                            <span className="compressed-size">
                                {' → Compressed: '}
                                {formatFileSize(compressedFile.size)}
                                <span className="savings">
                                    {' '}({Math.round((1 - compressedFile.size / file.size) * 100)}% saved)
                                </span>
                            </span>
                        )}
                    </div>
                    
                    <ProgressBar progress={progress} hasFile={true} />
                </div>
            </div>
        </div>
    );
}

export default FileItem;
