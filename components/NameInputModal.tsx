
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';

interface NameInputModalProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({ onSubmit, initialValue = '' }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError(true);
      playSound('wrong');
      return;
    }
    playSound('click');
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-pop-in overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-b-8 border-indigo-600 relative overflow-hidden my-auto w-full max-w-sm">
        
        {/* 
           FIX LAYOUT:
           Increased header height (h-40) to provide ample visual weight.
        */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
        
        {/* 
           FIX OVERLAP:
           Icon container positioned at top-10.
           Replaced Lucide Icon with Custom Game Logo
        */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-2xl border-4 border-indigo-50 z-10">
           <img 
              src="https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png" 
              alt="Logo" 
              className="w-24 h-24 object-contain"
           />
        </div>

        {/* 
           FIX OVERLAP:
           Used mt-40 (160px) to ensure the content starts well below the icon.
        */}
        <div className="mt-40 pt-2 px-8 pb-8 text-center relative z-0">
          <h2 className="text-3xl font-black text-indigo-900 mb-2 font-titan tracking-wide uppercase mt-2">{t.nameModal.title}</h2>
          <p className="text-gray-500 font-bold text-sm mb-6 leading-relaxed">{t.nameModal.desc}</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if(error) setError(false);
                }}
                maxLength={12}
                placeholder={t.nameModal.placeholder}
                className={`
                  w-full bg-gray-50 border-4 rounded-2xl px-4 py-3 text-center text-xl font-bold text-gray-700 outline-none transition-all placeholder-gray-300
                  ${error ? 'border-red-400 bg-red-50 shake' : 'border-gray-200 focus:border-indigo-400 focus:bg-white'}
                `}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs font-bold mt-2 animate-bounce">{t.nameModal.error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-bold py-3.5 rounded-2xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 hover:bg-indigo-600 shadow-lg group mt-2"
            >
              {t.nameModal.btnStart} <Play size={20} className="fill-white group-hover:scale-110 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
