import React from 'react';
import ImageIcon from './icons/ImageIcon';
import RLIcon from './icons/RLIcon';
import SparkIcon from './icons/SparkIcon';
import MedicalIcon from './icons/MedicalIcon';
import AudioIcon from './icons/AudioIcon';
import TextIcon from './icons/TextIcon';

interface CategorySelectorProps {
  onSelect: (query: string) => void;
  t: {
    environments: { label: string; query: string };
    avatars: { label: string; query: string };
    meetSdk: { label: string; query: string };
    collaboration: { label: string; query: string };
    glassesFree: { label: string; query: string };
    pitch: { label: string; query: string };
  };
}

const CategoryButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-brand-secondary rounded-lg border border-transparent hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-200 ease-in-out transform hover:-translate-y-1 h-32 w-full"
    aria-label={label}
  >
    {icon}
    <span className="text-sm font-medium text-brand-text text-center">{label}</span>
  </button>
);


const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, t }) => {
  const categories = [
    {
      id: 'environments',
      label: t.environments.label,
      icon: <ImageIcon className="w-8 h-8 text-blue-400" />,
      query: t.environments.query,
    },
    {
      id: 'avatars',
      label: t.avatars.label,
      icon: <RLIcon className="w-8 h-8 text-purple-400" />,
      query: t.avatars.query,
    },
    {
      id: 'meetSdk',
      label: t.meetSdk.label,
      icon: <MedicalIcon className="w-8 h-8 text-red-400" />,
      query: t.meetSdk.query,
    },
    {
      id: 'collaboration',
      label: t.collaboration.label,
      icon: <AudioIcon className="w-8 h-8 text-green-400" />,
      query: t.collaboration.query,
    },
    {
      id: 'glassesFree',
      label: t.glassesFree.label,
      icon: <TextIcon className="w-8 h-8 text-yellow-400" />,
      query: t.glassesFree.query,
    },
    {
      id: 'pitch',
      label: t.pitch.label,
      icon: <SparkIcon className="w-8 h-8 text-brand-accent" />,
      query: t.pitch.query,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 w-full">
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