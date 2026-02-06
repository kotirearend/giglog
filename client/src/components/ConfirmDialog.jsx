export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  confirmColor = 'pink',
}) {
  const colorMap = {
    purple: 'from-accent-purple to-accent-pink',
    pink: 'from-accent-pink to-accent-purple',
    red: 'from-red-600 to-pink-600',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-sm w-full">
        <p className="text-gray-100 mb-6 text-center">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-dark-700 border border-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:border-accent-purple transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 bg-gradient-to-r ${colorMap[confirmColor]} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
