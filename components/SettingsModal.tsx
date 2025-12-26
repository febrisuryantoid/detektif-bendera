
import React, { useState } from 'react';
import { X, Music, Volume2, Disc } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { playSound, getAudioState, setSFXEnabled, setMusicEnabled, setMusicTrack, MusicTrack } from '../utils/sound';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const initialState = getAudioState();
  const [sfx, setSfx] = useState(initialState.sfxEnabled);
  const [bgm, setBgm] = useState(initialState.musicEnabled);
  const [track, setTrack] = useState<MusicTrack>(initialState.currentTrack);

  const handleToggleSfx = () => {
    const newState = !sfx;
    setSfx(newState);
    setSFXEnabled(newState);
    if(newState) playSound('click');
  };

  const handleToggleBgm = () => {
    playSound('click');
    const newState = !bgm;
    setBgm(newState);
    setMusicEnabled(newState);
  };

  const handleChangeTrack = (newTrack: MusicTrack) => {
    playSound('click');
    setTrack(newTrack);
    setMusicTrack(newTrack);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="relative w-[90%] max-w-xs bg-white rounded-[2rem] border-[6px] border-indigo-500 shadow-2xl overflow-hidden">
        
        <div className="bg-indigo-500 p-4 text-center relative shrink-0">
          <h2 className="text-xl font-black text-white font-titan tracking-wider uppercase drop-shadow-md">
            {t.settings.title}
          </h2>
          <button onClick={() => { playSound('click'); onClose(); }} className="absolute top-4 right-4 text-white hover:scale-110">
             <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* MUSIC */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Music size={20} /></div>
                <span className="font-bold text-gray-700 text-sm">{t.settings.music}</span>
             </div>
             <button onClick={handleToggleBgm} className={`w-12 h-7 rounded-full p-1 transition-colors relative ${bgm ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${bgm ? 'translate-x-5' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* SFX */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Volume2 size={20} /></div>
                <span className="font-bold text-gray-700 text-sm">{t.settings.sfx}</span>
             </div>
             <button onClick={handleToggleSfx} className={`w-12 h-7 rounded-full p-1 transition-colors relative ${sfx ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${sfx ? 'translate-x-5' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* TRACK */}
          <div>
             <div className="flex items-center gap-2 mb-2">
                <Disc size={16} className="text-purple-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t.settings.track}</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {(['fun', 'adventure', 'chill'] as MusicTrack[]).map((tId) => (
                  <button
                    key={tId}
                    onClick={() => handleChangeTrack(tId)}
                    className={`
                      py-1.5 rounded-lg text-[10px] font-black uppercase border-b-2 active:border-b-0 active:translate-y-0.5 transition-all
                      ${track === tId ? 'bg-purple-500 text-white border-purple-700 shadow-md' : 'bg-gray-100 text-gray-500 border-gray-200'}
                    `}
                  >
                    {tId === 'fun' ? t.settings.trackFun : tId === 'adventure' ? t.settings.trackAdv : t.settings.trackChill}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t-2 border-gray-100 shrink-0">
           <button 
             onClick={() => { playSound('click'); onClose(); }}
             className="w-full bg-indigo-500 text-white font-black py-3 rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all shadow-md btn-3d"
           >
             {t.settings.btnClose}
           </button>
        </div>

      </div>
    </div>
  );
};
