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
      <div className="bg-dark-800 border border-dark-700 p-4">
        <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-2">Total spend</p>
        <p className="text-2xl font-black text-accent-orange">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="space-y-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-gray-100 font-mono text-sm focus:border-accent-orange focus:outline-none"
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
          className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
        />

        <input
          type="number"
          placeholder="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPint}
            onChange={(e) => setIsPint(e.target.checked)}
            className="w-4 h-4 accent-orange"
          />
          <span className="text-sm text-gray-300 font-mono">Mark as pint</span>
        </label>

        <button
          onClick={handleAdd}
          className="w-full bg-accent-orange text-gray-900 font-black py-3 hover:bg-accent-orange/90 transition-all duration-150 font-mono uppercase tracking-wide text-sm"
        >
          Add Item
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-dark-700 border border-dark-600 p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-mono text-gray-100">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">{item.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-black text-gray-100">
                  {formatCurrency(item.amount)}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
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
