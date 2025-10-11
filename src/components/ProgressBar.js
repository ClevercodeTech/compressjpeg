import React from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ progress }) {
    return (
        <div className="progress-bar-container">
            {progress === 0 ? (
                <div className="progress-bar-waiting">
                    <span className="progress-bar-text" style={{ color: '#888' }}>
                        Waiting for image...
                    </span>
                </div>
            ) : (
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                >
                    <span className="progress-bar-text">{progress}%</span>
                </div>
            )}
        </div>
    );
}

export default ProgressBar;