import React, { useState, useEffect } from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ progress, hasFile }) {
    const [displayedProgress, setDisplayedProgress] = useState(progress);

    useEffect(() => {
        if (progress === 100 && displayedProgress < 100) {
            const timer = setTimeout(() => {
                setDisplayedProgress(100);
            }, 750);
            return () => clearTimeout(timer);
        } else {
            setDisplayedProgress(progress);
        }
    }, [progress]);

    let barText;
    if (!hasFile || displayedProgress === null) {
        barText = (
            <span className="progress-bar-text" style={{ color: '#888' }}>
                Waiting for image...
            </span>
        );
    } else if (displayedProgress < 100) {
        barText = (
            <span className="progress-bar-text">
                Processing {displayedProgress}%
            </span>
        );
    } else {
        barText = (
            <span className="progress-bar-text">
                Completed 100%
            </span>
        );
    }

    return (
        <div className="progress-bar-container">
            {barText}
            {(!hasFile || displayedProgress === null) ? (
                <div className="progress-bar-waiting">                
                </div>
            ) : (
                <div
                    className="progress-bar-fill"
                    style={{ width: `${displayedProgress}%` }}
                >                   
                </div>
            )}
            
        </div>
    );
}

export default ProgressBar;