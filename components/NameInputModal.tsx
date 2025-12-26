
import React, { useState, useEffect } from 'react';
import { Play, UserCheck, UserPlus } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';
import { checkLocalNameExists } from '../utils/storage';

interface NameInputModalProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({ onSubmit, initialValue = '' }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Real-time check saat user mengetik
  useEffect(() => {
    const clean = name.trim();
    if (clean.length > 0) {
      const exists = checkLocalNameExists(clean);
      setIsExistingUser(exists);
    } else {
      setIsExistingUser(false);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    
    if (cleanName.length === 0) {
      setError(true);
      playSound('wrong');
      return;
    }
    
    playSound('click');
    onSubmit(cleanName); 
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-pop-in overflow-y-auto">
      <div className="
        bg-white rounded-[2.5rem] landscape:rounded-3xl shadow-2xl 
        border-b-8 landscape:border-b-0 landscape:border-r-8 border-indigo-600 
        relative overflow-hidden my-auto w-full max-w-sm landscape:max-w-2xl
        landscape:flex landscape:items-center landscape:h-auto
      ">
        
        {/* Header Decor (Top in Portrait, Left in Landscape) */}
        <div className="absolute top-0 left-0 w-full h-40 landscape:h-full landscape:w-40 bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0"></div>
        
        {/* Logo */}
        <div className="
           absolute top-10 left-1/2 -translate-x-1/2 
           landscape:top-1/2 landscape:left-20 landscape:-translate-y-1/2
           bg-white p-2 rounded-full shadow-2xl border-4 border-indigo-50 z-10
        ">
           <img 
              src="https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png" 
              alt="Logo" 
              className="w-24 h-24 landscape:w-16 landscape:h-16 object-contain"
           />
        </div>

        {/* Content */}
        <div className="
           mt-40 landscape:mt-0 
           pt-2 px-8 pb-8 landscape:p-6 landscape:pl-48 
           text-center landscape:text-left 
           relative z-0 w-full font-sans
        ">
          <h2 className="text-3xl landscape:text-2xl font-extrabold text-indigo-900 mb-2 font-display tracking-wide uppercase mt-2 landscape:mt-0">
            {t.nameModal.title}
          </h2>
          <p className="text-gray-500 font-medium text-sm landscape:text-xs mb-6 landscape:mb-3 leading-relaxed">
            {t.nameModal.desc}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  // AUTO CAPSLOCK LOGIC
                  setName(e.target.value.toUpperCase());
                  if(error) setError(false);
                }}
                maxLength={12}
                placeholder={t.nameModal.placeholder}
                className={`
                  w-full bg-gray-50 border-4 rounded-2xl px-4 py-3 landscape:py-2 text-center text-xl landscape:text-lg font-bold text-gray-700 outline-none transition-all placeholder-gray-300 uppercase
                  ${error ? 'border-red-400 bg-red-50 shake' : 'border-gray-200 focus:border-indigo-400 focus:bg-white'}
                `}
                autoFocus
              />
              
              {error && (
                <p className="absolute -bottom-5 left-0 w-full text-center text-red-500 text-xs font-bold animate-bounce">{t.nameModal.error}</p>
              )}
            </div>

            {/* STATUS AREA - MOVED HERE (Static Layout) */}
            <div className="h-6 flex items-center justify-center landscape:justify-start">
                {name.trim().length > 0 && !error && (
                  <div className={`text-[10px] font-bold flex items-center gap-1.5 px-3 py-1 rounded-full ${isExistingUser ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'}`}>
                    {isExistingUser ? (
                      <>
                        <UserCheck size={14} /> {t.nameModal.welcomeBack}
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} /> {t.nameModal.nameAvailable}
                      </>
                    )}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className={`
                w-full text-white font-bold py-3.5 landscape:py-2.5 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg group mt-1
                ${isExistingUser ? 'bg-blue-500 border-blue-700 hover:bg-blue-600' : 'bg-indigo-500 border-indigo-700 hover:bg-indigo-600'}
              `}
            >
              {isExistingUser ? t.nameModal.btnContinue : t.nameModal.btnStart} <Play size={20} className="fill-white group-hover:scale-110 transition-transform landscape:w-4 landscape:h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
