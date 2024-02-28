export function RedirectModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-content-light p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Leaving website</p>
          <p>If you connect your wallet and the site is malicious, you may lose funds.</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
              onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-700 transition"
              onClick={onConfirm}>
                I understand
            </button>
          </div>
        </div>
      </div>
    );
  }