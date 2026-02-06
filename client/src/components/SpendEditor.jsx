import { useState } from 'react';
import { formatCurrency } from '../utils/format';

export function SpendEditor({ items = [], total = 0, onChange }) {
  const [category, setCategory] = useState('drink');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [isPint, setIsPint] = useState(false);

  const categories = [
    { id: 'drink', label: 'Drink' },
    { id: 'merch', label: 'Merch' },
    { id: 'travel', label: 'Travel' },
    { id: 'food', label: 'Food' },
    { id: 'other', label: 'Other' },
  ];

  function handleAdd() {
    if (!label || !amount) return;

    const newItem = {
      id: `item-${Date.now()}`,
      category,
      label,
      amount: parseFloat(amount),
      is_pint: isPint,
    };

    onChange([...items, newItem]);
    setLabel('');
    setAmount('');
    setIsPint(false);
    setCategory('drink');
  }

  function handleDelete(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-2">Total spend</p>
        <p className="text-2xl font-bold text-accent-purple">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="space-y-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description (e.g. Cider)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
        />

        <input
          type="number"
          placeholder="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPint}
            onChange={(e) => setIsPint(e.target.checked)}
            className="w-4 h-4 rounded accent-purple"
          />
          <span className="text-sm text-gray-300">Mark as pint</span>
        </label>

        <button
          onClick={handleAdd}
          className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Add Item
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-dark-700 border border-dark-600 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-100">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-100">
                  {formatCurrency(item.amount)}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
