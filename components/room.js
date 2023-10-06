import React from 'react';

const ColorChangingContainer = ({ isTrue }) => {
  // Define a CSS class based on the boolean value
  const containerClassName = isTrue
    ? 'bg-blue-500 p-4 text-white'
    : 'bg-gray-200 p-4 text-black';

  return (
    <div className={containerClassName}>
      {isTrue ? 'Container is True' : 'Container is False'}
    </div>
  );
};

export default ColorChangingContainer;
