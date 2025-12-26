
import React from 'react';
import { useNotification, NotificationType } from '../utils/NotificationContext';
import { Trophy, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const getNotificationStyle = (type: NotificationType) => {
  switch(type) {
    case 'record':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-500',
        text: 'text-yellow-900',
        iconBg: 'bg-yellow-400',
        iconColor: 'text-white',
        icon: <Trophy size={20} fill="currentColor" />
      };
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-900',
        iconBg: 'bg-green-400',
        iconColor: 'text-white',
        icon: <CheckCircle2 size={24} strokeWidth={3} />
      };
    case 'warning':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-900',
        iconBg: 'bg-orange-400',
        iconColor: 'text-white',
        icon: <AlertTriangle size={24} />
      };
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-900',
        iconBg: 'bg-blue-400',
        iconColor: 'text-white',
        icon: <Info size={24} />
      };
  }
};

export const GameNotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 w-full z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {notifications.map((note) => {
        const style = getNotificationStyle(note.type);
        
        return (
          <div 
            key={note.id}
            className={`
              pointer-events-auto
              relative w-full max-w-sm rounded-2xl border-l-[8px] ${style.border} ${style.bg}
              shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3 flex items-center gap-3
              animate-slide-down transition-all duration-300 transform font-sans
            `}
          >
            {/* Icon Bubble */}
            <div className={`${style.iconBg} ${style.iconColor} w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0`}>
              {style.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-display font-extrabold text-lg leading-none ${style.text} mb-1 drop-shadow-sm`}>
                {note.title}
              </h4>
              <p className={`text-xs font-bold opacity-90 leading-tight ${style.text}`}>
                {note.message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeNotification(note.id)}
              className="p-1 rounded-full hover:bg-black/5 transition-colors opacity-50 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
