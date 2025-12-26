
import React from 'react';
import { X, GitCommit, ChevronLeft } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';

interface ChangelogModalProps {
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  const logs = [
    { ver: "1.5", date: "2025-05-20", desc: t.changelog.v1_5, current: true },
    { ver: "1.4", date: "2025-04-15", desc: t.changelog.v1_4 },
    { ver: "1.3", date: "2025-03-10", desc: t.changelog.v1_3 },
    { ver: "1.2", date: "2025-02-28", desc: t.changelog.v1_2 },
    { ver: "1.1", date: "2025-01-20", desc: t.changelog.v1_1 },
    { ver: "1.0", date: "2024-12-01", desc: t.changelog.v1_0 },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="relative w-[90%] max-w-sm bg-white rounded-[2rem] border-[6px] border-emerald-500 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        <div className="bg-emerald-500 p-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-black text-white font-titan tracking-wider uppercase drop-shadow-md flex items-center gap-2">
            <GitCommit size={24} /> {t.changelog.title}
          </h2>
          <button onClick={handleClose} className="text-white hover:scale-110">
             <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="relative border-l-4 border-gray-200 ml-2 space-y-6">
            {logs.map((log, index) => (
              <div key={index} className="relative pl-6">
                <div className={`
                  absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm
                  ${log.current ? 'bg-emerald-500 scale-110' : 'bg-gray-300'}
                `}></div>
                
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-0.5">
                     <span className={`font-black text-base ${log.current ? 'text-emerald-600' : 'text-gray-700'}`}>v{log.ver}</span>
                     {log.current && <span className="bg-emerald-100 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Latest</span>}
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 mb-1">{log.date}</span>
                   <p className="text-xs font-medium text-gray-600 leading-snug bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                     {log.desc}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t-2 border-gray-100 shrink-0">
           <button 
             onClick={handleClose}
             className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 btn-3d"
           >
             <ChevronLeft size={18} strokeWidth={3} /> {t.changelog.btnClose}
           </button>
        </div>

      </div>
    </div>
  );
};
