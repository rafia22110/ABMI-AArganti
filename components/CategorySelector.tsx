import React from 'react';
import MedicalIcon from './icons/MedicalIcon';
import ImageIcon from './icons/ImageIcon';
import AudioIcon from './icons/AudioIcon';

interface CategorySelectorProps {
  onSelect: (query: string) => void;
  t: {
    medical: { label: string; query: string };
    image: { label: string; query: string };
    audio: { label: string; query: string };
  };
}

const CategoryButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-brand-secondary rounded-lg border border-transparent hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
    <span className="text-sm font-medium text-brand-text">{label}</span>
  </button>
);


const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, t }) => {
  const categories = [
    {
      id: 'medical',
      label: t.medical.label,
      icon: <MedicalIcon className="w-8 h-8 text-red-400" />,
      query: t.medical.query,
    },
    {
      id: 'image',
      label: t.image.label,
      icon: <ImageIcon className="w-8 h-8 text-blue-400" />,
      query: t.image.query,
    },
    {
      id: 'audio',
      label: t.audio.label,
      icon: <AudioIcon className="w-8 h-8 text-green-400" />,
      query: t.audio.query,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {categories.map((cat) => (
        <CategoryButton
          key={cat.id}
          icon={cat.icon}
          label={cat.label}
          onClick={() => onSelect(cat.query)}
        />
      ))}
    </div>
  );
};

export default CategorySelector;
