export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title: string, body: string, iconUrl?: string) => {
  if (Notification.permission === 'granted') {
    // Coba gunakan Service Worker registration jika tersedia (untuk mobile)
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: iconUrl || 'https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png',
          vibrate: [200, 100, 200],
          badge: 'https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png',
          tag: 'leaderboard-update'
        } as any);
      });
    } else {
      // Fallback ke Desktop Notification API biasa
      new Notification(title, {
        body,
        icon: iconUrl || 'https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png',
      });
    }
  }
};
