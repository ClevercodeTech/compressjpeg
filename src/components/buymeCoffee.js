import React from 'react';

export default function DonateButton() {
  return (
    <a
      href={process.env.REACT_APP_BUYMECOFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#FFDD00',
        color: '#000',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginBottom: '10px',
      }}
    >
      ☕ Buy me a coffee
    </a>
  );
}
