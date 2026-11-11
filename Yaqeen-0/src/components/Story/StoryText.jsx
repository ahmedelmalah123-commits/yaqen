import React, { useEffect, useRef } from 'react';
import { useStoryStore } from '../../store/useStoryStore';

export default function StoryText({ content, images }) {
  const activeParagraphId = useStoryStore((state) => state.activeParagraphId);
  const paragraphRefs = useRef({});

  // Auto-scroll to active paragraph
  useEffect(() => {
    if (activeParagraphId && paragraphRefs.current[activeParagraphId]) {
      paragraphRefs.current[activeParagraphId].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeParagraphId]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-8 font-amiri text-2xl leading-relaxed">
      {content.map((paragraph, index) => {
        // Render an image every 2 paragraphs
        const shouldRenderImage = index > 0 && index % 2 === 0;
        const imageIndex = Math.floor(index / 2) - 1;
        const imageUrl = shouldRenderImage && images && images[imageIndex] ? images[imageIndex] : null;

        return (
          <React.Fragment key={paragraph.id}>
            {imageUrl && (
              <div className="w-full my-6 rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10 transition-transform duration-500 hover:scale-[1.02]">
                <img src={imageUrl} alt="Story visual" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            )}
            
            <p
              ref={(el) => (paragraphRefs.current[paragraph.id] = el)}
              className={`transition-all duration-500 p-4 rounded-xl ${
                activeParagraphId === paragraph.id
                  ? 'bg-accent/10 border-r-4 border-accent text-primary dark:text-accent font-bold scale-[1.02] shadow-sm'
                  : 'text-primary/70 dark:text-white/70'
              }`}
            >
              {paragraph.text}
            </p>
          </React.Fragment>
        );
      })}
    </div>
  );
}
