import React from 'react';
import { playGameSound } from '../utils/media';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 w-full shadow-inner ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            playGameSound('click');
            onChange(opt.value);
          }}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-black rounded-xl transition-all flex-1 whitespace-nowrap h-10 ${
            value === opt.value
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-gray-400 hover:bg-gray-200/50'
          }`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
