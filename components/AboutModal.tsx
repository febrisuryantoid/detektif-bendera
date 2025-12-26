
import React, { useState } from 'react';
import { X, Globe, Layers, Code, Palette, Music, History, ChevronRight, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';
import { ChangelogModal } from './ChangelogModal';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [showChangelog, setShowChangelog] = useState(false);
  
  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
        <div className="relative w-[90%] max-w-sm bg-white rounded-[2rem] border-[6px] border-sky-500 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          
          <div className="bg-sky-500 p-4 text-center shrink-0">
            <h2 className="text-2xl font-black text-white font-titan tracking-wider uppercase drop-shadow-md">
              {t.about.title}
            </h2>
          </div>

          <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
            
            {/* DEVELOPER CARD (Refactored to include distinct button) */}
            <div className="bg-indigo-50 rounded-2xl p-4 border-2 border-indigo-100 mb-4 text-center transition-colors relative">
              
              {/* Profile Info */}
              <div className="flex justify-center mb-2">
                <div className="bg-white p-2 rounded-full shadow-sm border border-indigo-100">
                  <Code size={24} className="text-indigo-500" />
                </div>
              </div>
              <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">{t.about.dev}</p>
              <h3 className="text-xl font-black text-indigo-900 font-titan leading-none">Febri Suryanto</h3>
              <p className="text-[10px] font-bold text-indigo-600 mt-1 mb-4">Web Design & Develop Profesional</p>

              {/* Website Button */}
              <a 
                href="https://febrisuryanto.com" 
                target="_blank" 
                rel="noopener sponsor"
                onClick={() => playSound('click')}
                className="
                  w-full bg-indigo-500 text-white font-bold py-2.5 rounded-xl 
                  border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 
                  transition-all shadow-md btn-3d flex items-center justify-center gap-2 text-xs
                "
              >
                <Globe size={14} /> {t.about.btnWebsite}
              </a>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Layers size={16} className="text-gray-400" />
                <h4 className="font-black text-gray-700 text-xs uppercase tracking-wide">{t.about.assets}</h4>
              </div>

              <div className="grid gap-2">
                <CreditItem icon={<Palette size={14} className="text-pink-500" />} title={t.about.icons} desc="Flaticon & Lucide" bg="bg-pink-50" border="border-pink-100" />
                <CreditItem icon={<Globe size={14} className="text-green-500" />} title={t.about.flags} desc="FlagCDN" bg="bg-green-50" border="border-green-100" />
                <CreditItem icon={<Music size={14} className="text-orange-500" />} title={t.about.audio} desc="Web Audio API" bg="bg-orange-50" border="border-orange-100" />
              </div>
            </div>

            <div className="mt-6 text-center opacity-60">
              <p className="text-[10px] font-bold text-gray-400">
                {t.about.footer}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t-2 border-gray-100 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between px-1">
              <span className="text-gray-400 font-bold text-[10px]">{t.about.version} 1.5</span>
              <button 
                onClick={() => { playSound('click'); setShowChangelog(true); }}
                className="text-sky-500 hover:text-sky-700 font-bold text-[10px] flex items-center gap-1"
              >
                <History size={12} /> {t.about.btnChangelog}
              </button>
            </div>

            <button 
              onClick={handleClose}
              className="w-full bg-sky-500 text-white font-black py-3 rounded-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all shadow-md btn-3d"
            >
              {t.about.btnClose}
            </button>
          </div>

        </div>
      </div>
      
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
};

const CreditItem = ({ icon, title, desc, bg, border }: any) => (
  <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${bg} ${border}`}>
    <div className="bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="font-bold text-gray-800 text-xs">{title}</p>
      <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
    </div>
  </div>
);
