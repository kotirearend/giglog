export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  confirmColor = 'orange',
}) {
  const colorMap = {
    orange: 'bg-accent-orange text-gray-900 hover:bg-accent-orange/90',
    red: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-700 p-6 max-w-sm w-full">
        <p className="text-gray-100 mb-6 text-center">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-dark-700 border border-dark-600 text-gray-100 font-black py-3 hover:border-accent-orange transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-black py-3 transition-all duration-150 ${colorMap[confirmColor] || colorMap.orange}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
