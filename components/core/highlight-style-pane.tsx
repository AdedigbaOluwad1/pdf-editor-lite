import React from 'react';
import { toast } from 'sonner';

export default function HighlightStylePane() {
  return (
    <div className="flex flex-wrap gap-3 w-fit">
      {['#FFE28F', '#B4EEB4', '#ADD8E6', '#FFB6C1', '#FFCC99', '#D8BFD8'].map(
        (color, index) => (
          <button
            onClick={() => {
              if (!index) return;
              toast.info("📦 This one's still in the box. Stay tuned!");
            }}
            key={`colour_${index}`}
            className={`w-[2.75rem] aspect-square ${
              !index && 'outline-2 outline-[#000]'
            } rounded-full cursor-pointer`}
            style={{ background: color }}
          ></button>
        )
      )}
    </div>
  );
}
