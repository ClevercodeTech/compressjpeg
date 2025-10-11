import React, { useState } from 'react';

function CompressionMenu({ onSelect }) {
    const [selectedOption, setSelectedOption] = useState('medium');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if (onSelect) {
            onSelect(event.target.value);
        }
    };

    return (
        <div className="compression-menu">
            <label htmlFor="compression-options">Select Compression Size:</label>
            <select
                id="compression-options"
                value={selectedOption}
                onChange={handleOptionChange}
            >
                <option value="large">Large</option>
                <option value="medium">Medium</option>
                <option value="small">Small</option>
                <option value="very small">Very Small</option>
            </select>
        </div>
    );
}

export default CompressionMenu;