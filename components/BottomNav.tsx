import React from 'react';
import { Icons } from './Icons';

type Tab = 'chats' | 'contacts' | 'discover' | 'me';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, unreadCount }) => {
  const navItems = [
    { id: 'chats' as Tab, label: '微信', icon: Icons.Chat },
    { id: 'contacts' as Tab, label: '通讯录', icon: Icons.Contacts },
    { id: 'discover' as Tab, label: '发现', icon: Icons.Discover },
    { id: 'me' as Tab, label: '我', icon: Icons.Me },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#f7f7f7] border-t border-gray-300 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-[60px]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center justify-center space-y-0.5 relative"
          >
            <div className="relative">
              <Icon
                size={26}
                className={isActive ? 'text-[#07C160]' : 'text-gray-800'}
                strokeWidth={1.5}
                fill={isActive ? '#07C160' : 'none'}
              />
              {item.id === 'chats' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-[#f7f7f7]">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${isActive ? 'text-[#07C160]' : 'text-gray-800'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;