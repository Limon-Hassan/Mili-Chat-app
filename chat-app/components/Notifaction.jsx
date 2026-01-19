'use client';

import { useEffect, useState } from 'react';
import { useGraphQL } from './Hook/useGraphQL';

export default function Notification() {
  let { request, loading, error } = useGraphQL();
  let [notifications, setNotifications] = useState([]);



  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const query = `
  query Notifications {
    notifications {
      id
      type
      message
      isRead
      createdAt
      relatedUser {
        id
        name
        avatar
      }
    }
  }
`;

        const data = await request(query);
        setNotifications(data.notifications);
        
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);


   const timeAgo = createdAt => {
     if (!createdAt) return '';

     const time = typeof createdAt === 'string' ? Number(createdAt) : createdAt;

     if (isNaN(time)) return '';

     const seconds = Math.floor((Date.now() - time) / 1000);

     if (seconds < 60) return 'Just now';
     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
     if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

     return `${Math.floor(seconds / 2592000)}mo ago`;
   };

  return (
    <div className=" laptop:w-full computer:w-125 h-auto bg-transparent border border-white p-3 rounded-lg laptop:absolute laptop:top-27.5 laptop:left-0 computer:relative computer:top-0">
      <div className="px-4 py-3 border-b">
        <h3 className="font-bold text-[24px]">Notifications</h3>
      </div>

      <div className="flex flex-col gap-1 mt-5 overflow-auto w-full computer:h-200">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              n.unread ? 'bg-[#1877F2]/30' : 'bg-gray-400/30'
            }`}
          >
            <img
              src={n.avatar || 'defult.png'}
              className="w-14 h-14 rounded-full"
            />

            <div className="flex-1">
              <p className="text-sm">{n.message}</p>
              <span className="text-xs text-white">{timeAgo(n.createdAt)}</span>
            </div>

            {n.isRead && (
              <span className="relative flex size-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-4 rounded-full bg-sky-500"></span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
