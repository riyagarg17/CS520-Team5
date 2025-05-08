import React from 'react';

const ColorStatus = ({ color, size }) => {
  const circleStyle = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: '50%',
  };

  return <div style={circleStyle}></div>;
};

export default ColorStatus;