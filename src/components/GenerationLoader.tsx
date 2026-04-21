import React from 'react';

export function GenerationLoader() {
  const letters = "GENERATING".split('');
  
  return (
    <div className="loader-wrapper scale-75 md:scale-100">
      <div className="loader"></div>
      <div className="flex gap-1 font-mono tracking-widest font-semibold drop-shadow-md">
        {letters.map((char, i) => (
          <span key={i} className="loader-letter">{char}</span>
        ))}
      </div>
    </div>
  );
}
