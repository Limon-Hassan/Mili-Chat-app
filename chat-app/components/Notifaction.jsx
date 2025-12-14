'use client';

export default function Notification() {
  const notifications = [
    {
      id: 1,
      user: 'Sadia',
      text: 'liked your photo',
      avatar: 'https://i.pravatar.cc/40?u=1',
      time: '3m',
      unread: true,
    },
    {
      id: 2,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 3,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 4,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 5,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 6,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 7,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 8,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 9,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
    {
      id: 10,
      user: 'Rahim',
      text: 'sent you a friend request',
      avatar: 'https://i.pravatar.cc/40?u=2',
      time: '1h',
      unread: false,
    },
  ];

  return (
    <div className="mobile:w-full tablet:w-full laptop:w-full computer:w-[400px] h-auto bg-transparent border border-white p-2 rounded-lg mobile:absolute mobile:top-[110px] mobile:left-0 tablet:absolute tablet:top-[110px] tablet:left-0 laptop:absolute laptop:top-[110px] laptop:left-0 computer:relative computer:top-0">
      <div className="px-4 py-3 border-b">
        <h3 className="font-bold text-[24px]">Notifications</h3>
      </div>

      <div className="flex flex-col gap-1 mt-5 overflow-auto w-full mobile:max-h-[455px] tablet:max-h-[455px] laptop:max-h-[455px] computer:max-h-[800px]">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              n.unread ? 'bg-[#1877F2]/30' : 'bg-gray-400/30'
            }`}
          >
            <img src={n.avatar} className="w-14 h-14 rounded-full" />

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{n.user}</span> {n.text}
              </p>
              <span className="text-xs text-white">{n.time}</span>
            </div>

            {n.unread && (
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
