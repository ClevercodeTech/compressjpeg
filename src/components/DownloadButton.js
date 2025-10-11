import React from 'react';

function DownloadButton({ file, originalName, compressionOption }) {
    if (!file) return null;

    // Get base name without extension
    const baseName = originalName
        ? originalName.replace(/\.[^/.]+$/, '')
        : 'compressed';

    // Format compression option for filename
    const optionLabel = compressionOption
        ? compressionOption.replace(/\s+/g, '').toLowerCase()
        : 'compressed';

    const fileName = `${baseName}_${optionLabel}.jpg`;
    const url = URL.createObjectURL(file);

    return (
        <a
            href={url}
            download={fileName}
            style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#2196f3',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                marginTop: '20px',
                fontWeight: 'bold'
            }}
        >
            Download Compressed JPEG
        </a>
    );
}

export default DownloadButton;