
import React, { useState, useEffect } from 'react';
import { Download, WifiOff, CheckCircle2, ShieldCheck, Bell, HardDrive, Play } from 'lucide-react';
import { FLAG_NAMES_ID } from '../utils/flagData';
import { requestNotificationPermission } from '../utils/notifications';
import { useLanguage } from '../utils/i18n';

interface InstallWizardProps {
  onComplete: () => void;
}

export const InstallWizard: React.FC<InstallWizardProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'intro' | 'permissions' | 'download'>('intro');
  const [progress, setProgress] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [permStorage, setPermStorage] = useState(false);
  const [permNotify, setPermNotify] = useState(false);

  // STEP 2: Request Permissions
  const handleRequestPermissions = async () => {
    // 1. Storage Persistence
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      setPermStorage(isPersisted);
      console.log(`Persistence granted: ${isPersisted}`);
    } else {
      setPermStorage(true); // Assume true if API not available (auto-managed)
    }

    // 2. Notifications
    const isNotifyGranted = await requestNotificationPermission();
    setPermNotify(isNotifyGranted);

    // Lanjut ke download
    setTimeout(() => {
        setStep('download');
        startAssetDownload();
    }, 500);
  };

  // STEP 3: Download Assets
  const startAssetDownload = async () => {
    const flagCodes = Object.keys(FLAG_NAMES_ID);
    
    // Create list of URLs to cache
    const urlsToCache = [
      ...flagCodes.map(code => `https://flagcdn.com/w320/${code}.png`),
      ...flagCodes.map(code => `https://flagcdn.com/w640/${code}.png`), // For Quiz
      // Add sound effects if they were external files, but currently generated.
    ];

    setTotalAssets(urlsToCache.length);
    let loadedCount = 0;

    // Open Cache
    const cache = await caches.open('detektif-bendera-v4-assets');

    // Batch download to avoid blocking network too much
    const batchSize = 10;
    for (let i = 0; i < urlsToCache.length; i += batchSize) {
      const batch = urlsToCache.slice(i, i + batchSize);
      await Promise.all(batch.map(async (url) => {
        try {
          // Check if already in cache
          const match = await cache.match(url);
          if (!match) {
            await cache.add(url);
          }
        } catch (e) {
          console.warn('Failed to cache:', url);
        } finally {
          loadedCount++;
          setProgress(Math.round((loadedCount / urlsToCache.length) * 100));
        }
      }));
    }
    
    // Selesai
    setTimeout(() => {
        localStorage.setItem('db_setup_complete', 'true');
        onComplete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6 text-white font-sans">
      
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>

        {/* --- STEP 1: INTRO --- */}
        {step === 'intro' && (
           <div className="flex flex-col items-center text-center animate-pop-in">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                 <img src="https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png" className="w-16 h-16 object-contain" alt="Icon" />
              </div>
              <h1 className="text-3xl font-extrabold font-display mb-2">{t.installWizard.welcome}</h1>
              <p className="text-indigo-100 font-medium mb-8 leading-relaxed">
                {t.installWizard.introDesc} <span className="text-yellow-300">{t.installWizard.introHighlight}</span>!
              </p>
              
              <button 
                onClick={() => setStep('permissions')}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-4 rounded-2xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {t.installWizard.btnSetup} <Play size={20} fill="currentColor" />
              </button>
           </div>
        )}

        {/* --- STEP 2: PERMISSIONS --- */}
        {step === 'permissions' && (
           <div className="flex flex-col items-center text-center animate-pop-in">
              <ShieldCheck size={64} className="text-emerald-400 mb-4" />
              <h2 className="text-2xl font-extrabold font-display mb-2">{t.installWizard.permTitle}</h2>
              <p className="text-white/80 text-sm mb-6 font-medium">
                {t.installWizard.permDesc}
              </p>

              <div className="w-full space-y-3 mb-8">
                 <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 text-left">
                    <div className="bg-blue-500/20 p-2 rounded-lg"><HardDrive size={24} className="text-blue-300"/></div>
                    <div>
                       <h4 className="font-bold text-sm">{t.installWizard.permStorage}</h4>
                       <p className="text-xs text-white/60">{t.installWizard.permStorageDesc}</p>
                    </div>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 text-left">
                    <div className="bg-pink-500/20 p-2 rounded-lg"><Bell size={24} className="text-pink-300"/></div>
                    <div>
                       <h4 className="font-bold text-sm">{t.installWizard.permNotify}</h4>
                       <p className="text-xs text-white/60">{t.installWizard.permNotifyDesc}</p>
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleRequestPermissions}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl shadow-lg transform transition-all active:scale-95"
              >
                {t.installWizard.btnGrant}
              </button>
           </div>
        )}

        {/* --- STEP 3: DOWNLOADING --- */}
        {step === 'download' && (
            <div className="flex flex-col items-center text-center animate-pop-in">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-sky-500 blur-xl opacity-50 animate-pulse"></div>
                 <Download size={64} className="text-sky-300 relative z-10 animate-bounce" />
               </div>
               
               <h2 className="text-2xl font-extrabold font-display mb-2">{t.installWizard.downloadTitle}</h2>
               <p className="text-sky-200 font-bold text-sm mb-8">
                  {t.installWizard.downloadDesc}
               </p>

               {/* Progress Bar */}
               <div className="w-full bg-black/30 rounded-full h-6 relative overflow-hidden mb-2 border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <p className="text-xs font-mono text-white/50">{progress}% {t.installWizard.complete}</p>
            </div>
        )}

      </div>
    </div>
  );
};
