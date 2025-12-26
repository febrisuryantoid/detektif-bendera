
import React from 'react';
import { X, Globe, ExternalLink, Heart, Layers, Code, Palette, Music } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  
  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] border-[8px] border-sky-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Decoration */}
        <div className="bg-sky-500 p-4 pt-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,#fff_2px,transparent_2px)] bg-[length:16px_16px]"></div>
          <h2 className="text-3xl font-black text-white font-titan tracking-wider uppercase drop-shadow-md relative z-10">
            {t.about.title}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Developer Card (Generic) */}
          <div className="bg-indigo-50 rounded-3xl p-5 border-4 border-indigo-100 mb-6 text-center relative overflow-hidden group">
             <div className="flex justify-center mb-3">
               <div className="bg-white p-3 rounded-full shadow-md border-2 border-indigo-100">
                 <Code size={32} className="text-indigo-500" />
               </div>
             </div>
             
             <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">{t.about.dev}</p>
             <h3 className="text-2xl font-black text-indigo-900 font-titan mb-3">FreeIT</h3>
          </div>

          {/* Credits / Assets Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={20} className="text-gray-400" />
              <h4 className="font-black text-gray-700 uppercase tracking-wide">{t.about.assets}</h4>
            </div>

            <div className="grid gap-3">
               <CreditItem 
                 icon={<Palette size={16} className="text-pink-500" />}
                 title={t.about.icons}
                 desc="Flaticon & Lucide"
                 bg="bg-pink-50"
                 border="border-pink-100"
               />
               <CreditItem 
                 icon={<Globe size={16} className="text-green-500" />}
                 title={t.about.flags}
                 desc="FlagCDN"
                 bg="bg-green-50"
                 border="border-green-100"
               />
               <CreditItem 
                 icon={<Music size={16} className="text-orange-500" />}
                 title={t.about.audio}
                 desc="Web Audio API"
                 bg="bg-orange-50"
                 border="border-orange-100"
               />
            </div>
          </div>

          <div className="mt-8 text-center opacity-60">
            <p className="text-xs font-bold text-gray-400 flex items-center justify-center gap-1">
              {t.about.footer}
            </p>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-4 bg-gray-50 border-t-2 border-gray-100">
           <button 
             onClick={handleClose}
             className="w-full bg-sky-500 text-white font-black py-3 rounded-2xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
           >
             {t.about.btnClose}
           </button>
        </div>

      </div>
    </div>
  );
};

const CreditItem = ({ icon, title, desc, bg, border }: { icon: React.ReactNode, title: string, desc: string, bg: string, border: string }) => (
  <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${bg} ${border}`}>
    <div className="bg-white p-2 rounded-xl shadow-sm">
      {icon}
    </div>
    <div>
      <p className="font-bold text-gray-800 text-sm">{title}</p>
      <p className="text-xs text-gray-500 font-medium">{desc}</p>
    </div>
  </div>
);
