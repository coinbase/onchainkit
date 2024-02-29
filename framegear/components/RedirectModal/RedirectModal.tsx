export function RedirectModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-content-light rounded-lg p-6 text-black shadow-lg">
        <p className="text-lg font-semibold">Leaving website</p>
        <p>If you connect your wallet and the site is malicious, you may lose funds.</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="rounded-full bg-white px-4 py-2 text-black transition hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-black px-4 py-2 text-white transition hover:bg-gray-700"
            onClick={onConfirm}
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
