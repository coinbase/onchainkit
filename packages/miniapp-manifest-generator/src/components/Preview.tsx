import { useCallback, useState } from 'react';
import { Frame } from '../types';

type PreviewProps = {
  frame: Frame;
};

export function Preview({ frame }: PreviewProps) {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleOpenPreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  return (
    <div>
      {showPreview && frame && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
          data-testid="previewModalOverlay"
        >
          <div
            className="bg-gray-800 rounded-lg shadow-xl max-w-[400px] w-full"
            onClick={(e) => e.stopPropagation()}
            data-testid="previewModalContent"
          >
            <div className="flex items-center p-4 border-b border-gray-700 relative">
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-400"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-500 hover:text-gray-400"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-bold text-white flex-grow text-center">
                {frame?.name}
              </h3>
            </div>
            <div>
              <iframe
                src={frame?.homeUrl}
                className="w-full h-170"
                title="Mini App Preview"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-700 w-80">
        <img
          loading="lazy"
          src={frame?.imageUrl}
          alt="Launch basic"
          className="w-full opacity-100 aspect-[1.5/1] object-cover object-center rounded-t-lg"
        />

        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            className="!bg-gray-700 font-bold text-white px-6 py-2 rounded-b-lg w-full"
            onClick={handleOpenPreview}
          >
            Launch {frame?.name}
          </button>
        </div>
      </div>
    </div>
  );
}
