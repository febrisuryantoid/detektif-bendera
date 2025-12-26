
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

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] border-[6px] border-indigo-500 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-500 p-4 text-center relative">
          <h2 className="text-2xl font-black text-white font-titan tracking-wider uppercase drop-shadow-md">
            {t.settings.title}
          </h2>
          <button onClick={handleClose} className="absolute top-4 right-4 text-white hover:scale-110 transition-transform">
             <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* MUSIC TOGGLE */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                   <Music size={24} />
                </div>
                <span className="font-bold text-gray-700">{t.settings.music}</span>
             </div>
             <button 
               onClick={handleToggleBgm}
               className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${bgm ? 'bg-green-500' : 'bg-gray-300'}`}
             >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${bgm ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* SFX TOGGLE */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                   <Volume2 size={24} />
                </div>
                <span className="font-bold text-gray-700">{t.settings.sfx}</span>
             </div>
             <button 
               onClick={handleToggleSfx}
               className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${sfx ? 'bg-green-500' : 'bg-gray-300'}`}
             >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sfx ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* TRACK SELECTOR */}
          <div>
             <div className="flex items-center gap-2 mb-3">
                <Disc size={18} className="text-purple-500" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.settings.track}</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {(['fun', 'adventure', 'chill'] as MusicTrack[]).map((tId) => (
                  <button
                    key={tId}
                    onClick={() => handleChangeTrack(tId)}
                    className={`
                      py-2 rounded-xl text-xs font-black uppercase border-b-4 active:border-b-0 active:translate-y-1 transition-all
                      ${track === tId 
                        ? 'bg-purple-500 text-white border-purple-700 shadow-md' 
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}
                    `}
                  >
                    {tId === 'fun' ? t.settings.trackFun : tId === 'adventure' ? t.settings.trackAdv : t.settings.trackChill}
                  </button>
                ))}
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t-2 border-gray-100">
           <button 
             onClick={handleClose}
             className="w-full bg-indigo-500 text-white font-black py-3 rounded-2xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
           >
             {t.settings.btnClose}
           </button>
        </div>

      </div>
    </div>
  );
};
