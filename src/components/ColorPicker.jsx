import { useState } from 'react';
import { FaPalette } from 'react-icons/fa';

const ColorPicker = () => {
  const [hexCode, setHexCode] = useState('');
  const [colorVariants, setColorVariants] = useState([]);
  const [colorHistory, setColorHistory] = useState([]);

  const handleColorChange = (e) => {
    const inputHex = e.target.value;
    setHexCode(inputHex);

    if (/^#[0-9A-F]{6}$/i.test(inputHex)) {
      generateVariants(inputHex);
      updateColorHistory(inputHex);
    }
  };

  const generateVariants = (hex) => {
    const variants = [];
    for (let i = -0.3; i <= 0.3; i += 0.2) {
      variants.push(adjustBrightness(hex, i));
    }
    setColorVariants(variants);
  };

  const adjustBrightness = (hex, factor) => {
    let [r, g, b] = hexToRgb(hex);

    r = Math.min(255, Math.max(0, Math.round(r + factor * 255)));
    g = Math.min(255, Math.max(0, Math.round(g + factor * 255)));
    b = Math.min(255, Math.max(0, Math.round(b + factor * 255)));

    return rgbToHex(r, g, b);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const updateColorHistory = (hex) => {
    setColorHistory((prevHistory) => {
      const newHistory = [hex, ...prevHistory];
      return newHistory.slice(0, 10); // Limit history to the last 10 colors
    });
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard`);
  };

  return (
    <div className="container">
      <div className="header">
        <FaPalette size={30} color="#e91e63" />
        <h1>Color Picker</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={hexCode}
          onChange={handleColorChange}
          placeholder="Enter a color hex code"
        />
      </div>
      <div className="color-grid">
        {colorVariants.map((color, index) => (
          <div
            key={index}
            className="color-box"
            style={{ backgroundColor: color }}
            onClick={() => copyToClipboard(color)}
          ></div>
        ))}
      </div>
      <div className="history">
        <h2>Color History</h2>
        <div className="history-grid">
          {colorHistory.map((color, index) => (
            <div
              key={index}
              className="history-box"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
