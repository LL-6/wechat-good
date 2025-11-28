import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { Icons } from './components/Icons';
import { CONTACTS, INITIAL_CHATS, MOCK_MOMENTS, CURRENT_USER, generateFakeNames } from './constants';
import { ChatSession, Message, Contact, Moment } from './types';
import { generateAIResponse } from './services/geminiService';
import { Heart, MessageSquare as CommentIcon } from 'lucide-react'; // Import Heart specifically

// --- Sub-components for Screens ---

// 1. Chats List Screen (WeChat)
const ChatsScreen: React.FC<{ chats: ChatSession[], contacts: Contact[], onChatClick: (id: string) => void }> = ({ chats, contacts, onChatClick }) => {
  const getContact = (id: string) => contacts.find(c => c.id === id);
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      <header className="sticky top-0 z-40 bg-[#ededed] px-4 h-12 flex items-center justify-between border-b border-gray-300">
        <span className="font-medium text-lg">微信</span>
        <div className="flex space-x-4">
          <Icons.PlusCircle size={20} />
        </div>
      </header>
      
      <div className="px-2 py-2 bg-[#ededed]">
        <div className="bg-white rounded flex items-center justify-center py-1 text-gray-400 text-sm">
          <Icons.Search size={14} className="mr-1" /> 搜索
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {chats.map(chat => {
          const contact = getContact(chat.contactId);
          if (!contact) return null;
          return (
            <div 
              key={chat.id} 
              onClick={() => onChatClick(chat.id)}
              className="flex items-center px-4 py-3 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-100 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-[6px] object-cover" />
                {chat.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-medium text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-400">{chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?.text || 'No messages'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Contacts Screen
const ContactsScreen: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const sortedContacts = [...contacts].sort((a, b) => (a.initial || '').localeCompare(b.initial || ''));
  const grouped = sortedContacts.reduce((acc, contact) => {
    const key = contact.initial || '#';
    if (!acc[key]) acc[key] = [];
    acc[key].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <div className="flex flex-col h-full bg-[#ededed] pb-20">
      <header className="sticky top-0 z-40 bg-[#ededed] px-4 h-12 flex items-center justify-between border-b border-gray-300">
        <span className="font-medium text-lg">通讯录</span>
        <Icons.PlusCircle size={22} />
      </header>
      
      <div className="px-2 py-2">
         <div className="bg-white rounded flex items-center justify-center py-1 text-gray-400 text-sm">
          <Icons.Search size={14} className="mr-1" /> 搜索
        </div>
      </div>

      <div className="bg-white mb-2">
         {[
           { name: '新的朋友', icon: Icons.Plus, bg: 'bg-orange-400' },
           { name: '群聊', icon: Icons.Contacts, bg: 'bg-[#07C160]' },
           { name: '标签', icon: Icons.Search, bg: 'bg-blue-500' }, 
           { name: '公众号', icon: Icons.User, bg: 'bg-blue-500' }
          ].map((item, idx) => (
           <div key={idx} className="flex items-center px-4 py-2.5 border-b border-gray-100 active:bg-gray-100">
             <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center text-white ${item.bg}`}>
                <item.icon size={20} />
             </div>
             <span className="ml-3 text-base">{item.name}</span>
           </div>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([initial, group]) => {
          const contactsList = group as Contact[];
          return (
            <div key={initial}>
              <div className="px-4 py-0.5 text-xs text-gray-500 bg-[#ededed]">{initial}</div>
              <div className="bg-white">
                {contactsList.map((contact, idx) => (
                  <div key={contact.id} className={`flex items-center px-4 py-2.5 active:bg-gray-100 ${idx !== contactsList.length -1 ? 'border-b border-gray-100' : ''}`}>
                    <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-[6px]" />
                    <span className="ml-3 text-base text-black">{contact.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Discover Screen (Menu)
const DiscoverScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-[#ededed] pb-20">
      <header className="sticky top-0 z-40 bg-[#ededed] px-4 h-12 flex items-center justify-between border-b border-gray-300">
        <span className="font-medium text-lg">发现</span>
        <div className="flex space-x-4">
           <Icons.Search size={20} />
           <Icons.PlusCircle size={20} />
        </div>
      </header>

      <div className="overflow-y-auto flex-1">
        <div className="bg-white mt-0 border-b border-gray-200">
           <div 
             className="flex items-center px-4 py-3 active:bg-gray-100 cursor-pointer"
             onClick={() => navigate('/moments')}
           >
             <div className="relative">
               <Icons.Compass size={24} className="text-gray-600" /> {/* Moments Icon usually colorful circle, using Compass for now */}
             </div>
             <span className="ml-4 text-base flex-1">朋友圈</span>
             <img src={MOCK_MOMENTS[0].images?.[0]} className="w-8 h-8 rounded-[6px] object-cover mr-2" alt="notification" />
             <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
             <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
           </div>
        </div>

        <div className="bg-white mt-2 border-y border-gray-200">
           <div className="flex items-center px-4 py-3 active:bg-gray-100 border-b border-gray-100">
             <div className="w-6 flex justify-center"><Icons.Camera size={20} className="text-orange-400" /></div>
             <span className="ml-4 text-base flex-1">视频号</span>
             <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
           </div>
           <div className="flex items-center px-4 py-3 active:bg-gray-100">
             <div className="w-6 flex justify-center"><Icons.Camera size={20} className="text-yellow-400" /></div>
             <span className="ml-4 text-base flex-1">直播</span>
             <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
           </div>
        </div>
        
         <div className="bg-white mt-2 border-y border-gray-200">
           <div className="flex items-center px-4 py-3 active:bg-gray-100 border-b border-gray-100">
             <div className="w-6 flex justify-center"><Icons.Search size={20} className="text-red-400" /></div>
             <span className="ml-4 text-base flex-1">搜一搜</span>
              <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
           </div>
        </div>

        <div className="bg-white mt-2 border-y border-gray-200">
           <div className="flex items-center px-4 py-3 active:bg-gray-100">
             <div className="w-6 flex justify-center"><Icons.User size={20} className="text-[#07C160]" /></div>
             <span className="ml-4 text-base flex-1">附近</span>
              <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Moments Generator & Feed ---

// Moment Creation / Simulator Screen
const CreateMomentScreen: React.FC<{ onPost: (m: Moment) => void, onCancel: () => void }> = ({ onPost, onCancel }) => {
  const [content, setContent] = useState('');
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10); // Random default start
  const [timeStr, setTimeStr] = useState('26分钟前');
  const [isLink, setIsLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('帮忙点一下，谢谢！');
  const [type, setType] = useState<'text' | 'link'>('text');

  const handlePost = () => {
    const fakeLikes = generateFakeNames(Number(likeCount));
    
    const newMoment: Moment = {
      id: Date.now().toString(),
      userId: 'me',
      content: content,
      timestamp: Date.now(), // We will override display time in UI but keep sort order
      likes: fakeLikes,
      comments: [],
      isLink: type === 'link',
      linkTitle: type === 'link' ? linkTitle : undefined,
      linkIcon: type === 'link' ? 'https://picsum.photos/id/1/100/100' : undefined,
      images: type === 'text' && !isLink ? [] : undefined 
    };
    onPost(newMoment);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="h-12 bg-[#ededed] flex items-center justify-between px-4 border-b border-gray-300">
        <button onClick={onCancel} className="text-black">取消</button>
        <span className="font-medium text-base">朋友圈生成器</span>
        <button onClick={handlePost} className="bg-[#07C160] text-white px-3 py-1 rounded-[4px] text-sm">发表</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
           <label className="block text-sm font-bold mb-2">类型</label>
           <div className="flex space-x-4">
              <button onClick={() => setType('text')} className={`px-4 py-2 rounded ${type === 'text' ? 'bg-green-100 text-green-700 border border-green-500' : 'bg-gray-100'}`}>纯文字/图</button>
              <button onClick={() => setType('link')} className={`px-4 py-2 rounded ${type === 'link' ? 'bg-green-100 text-green-700 border border-green-500' : 'bg-gray-100'}`}>转发链接</button>
           </div>
        </div>

        <div className="mb-4">
          <textarea 
            className="w-full p-2 border rounded bg-gray-50 h-24"
            placeholder="这一刻的想法..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        {type === 'link' && (
           <div className="mb-4 border p-3 rounded bg-gray-50">
             <label className="block text-xs text-gray-500 mb-1">链接标题 (例如: 帮我家孩子投一票)</label>
             <input 
               type="text" 
               className="w-full p-2 border rounded" 
               value={linkTitle}
               onChange={e => setLinkTitle(e.target.value)}
             />
           </div>
        )}

        <div className="border-t pt-4">
           <h3 className="font-bold mb-4">模拟数据设定 (逼真模式)</h3>
           
           <div className="mb-4">
             <label className="block text-sm text-gray-700 mb-1">点赞数量 ({likeCount}人)</label>
             <input 
               type="range" 
               min="0" 
               max="200" 
               value={likeCount} 
               onChange={e => setLikeCount(Number(e.target.value))}
               className="w-full"
             />
             <input 
                type="number"
                value={likeCount}
                onChange={e => setLikeCount(Number(e.target.value))}
                className="mt-1 border p-1 rounded w-20 text-center"
             />
           </div>

           <div className="mb-4">
             <label className="block text-sm text-gray-700 mb-1">发布时间显示</label>
             <input 
               type="text" 
               className="w-full p-2 border rounded" 
               value={timeStr}
               onChange={e => setTimeStr(e.target.value)}
               placeholder="例如: 26分钟前"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

const MomentsScreen: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const navigate = useNavigate();
  const [moments, setMoments] = useState<Moment[]>(MOCK_MOMENTS);
  const [showCreator, setShowCreator] = useState(false);

  const handlePost = (moment: Moment) => {
    setMoments(prev => [moment, ...prev]);
    setShowCreator(false);
  };

  const getSender = (userId: string) => {
    if (userId === 'me') return CURRENT_USER;
    return contacts.find(c => c.id === userId) || contacts[0];
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {showCreator && <CreateMomentScreen onPost={handlePost} onCancel={() => setShowCreator(false)} />}

      <header className="sticky top-0 z-40 bg-[#ededed]/90 backdrop-blur-md px-4 h-12 flex items-center justify-between transition-colors">
        <button onClick={() => navigate(-1)} className="flex items-center">
            <Icons.Back className="text-black" size={24} />
        </button>
        <div className="flex-1"></div>
        <button onClick={() => setShowCreator(true)}>
             <Icons.Camera className="text-black" size={22} />
        </button>
      </header>

      <div className="overflow-y-auto flex-1 -mt-12 pt-0 pb-10">
        {/* Cover Photo */}
        <div className="relative mb-16">
           <img src="https://picsum.photos/id/1015/800/600" className="w-full h-64 object-cover" alt="cover" />
           <div className="absolute -bottom-10 right-4 flex items-end">
              <span className="text-white font-bold text-lg mb-2 mr-4 drop-shadow-md">{CURRENT_USER.name}</span>
              <img src={CURRENT_USER.avatar} className="w-20 h-20 rounded-[8px] border-2 border-white bg-white" alt="avatar" />
           </div>
        </div>

        {/* Moments List */}
        <div className="px-3 pb-8 space-y-8">
           {moments.map(moment => {
             const sender = getSender(moment.userId);
             return (
               <div key={moment.id} className="flex items-start">
                  <img src={sender.avatar} className="w-10 h-10 rounded-[4px] mr-3" alt="avatar" />
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[#576b95] font-bold text-base leading-tight mb-1">{sender.name}</h4>
                     <p className="text-base text-black mb-2 leading-6 whitespace-pre-wrap">{moment.content}</p>
                     
                     {/* Link Card Style */}
                     {moment.isLink && (
                        <div className="flex bg-[#f7f7f7] p-1.5 mb-2 items-center cursor-pointer">
                           <img src={moment.linkIcon || "https://picsum.photos/id/48/100/100"} className="w-10 h-10 object-cover mr-2" />
                           <span className="text-sm text-black line-clamp-2 leading-tight flex-1">{moment.linkTitle}</span>
                        </div>
                     )}

                     {/* Image Grid Style (if not link) */}
                     {!moment.isLink && moment.images && moment.images.length > 0 && (
                        <div className={`grid gap-1.5 mb-2 ${moment.images.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
                           {moment.images.map((img, i) => (
                              <img key={i} src={img} className={`${moment.images!.length === 1 ? 'max-w-[70%] max-h-64' : 'w-full h-24'} object-cover`} />
                           ))}
                        </div>
                     )}

                     <div className="flex justify-between items-center text-xs text-[#b0b0b0] mt-1 mb-2">
                        <span>1小时前</span> {/* In a real app, use timestamp relative time */}
                        <div className="bg-[#f7f7f7] px-2 py-0.5 rounded text-[#576b95] font-bold">..</div>
                     </div>

                     {/* Likes & Comments Box */}
                     {(moment.likes.length > 0 || moment.comments.length > 0) && (
                        <div className="bg-[#f7f7f7] rounded-[4px] relative mt-2 text-sm">
                           {/* Triangle Up */}
                           <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#f7f7f7] transform rotate-45"></div>
                           
                           {/* Likes */}
                           {moment.likes.length > 0 && (
                             <div className="px-3 py-2 border-b border-gray-200/50 flex flex-wrap items-baseline leading-5">
                                <Heart size={14} className="mr-2 text-[#576b95] inline mt-0.5" fill="#576b95" strokeWidth={0} />
                                {moment.likes.map((name, i) => (
                                   <span key={i} className="text-[#576b95] font-medium break-words">
                                      {name}{i < moment.likes.length - 1 ? '，' : ''}
                                   </span>
                                ))}
                             </div>
                           )}

                           {/* Comments */}
                           {moment.comments.map((comment, i) => (
                              <div key={i} className="px-3 py-1">
                                 <span className="text-[#576b95] font-medium">{comment.user}</span>
                                 <span className="text-black">: {comment.text}</span>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};


// 4. Me Screen
const MeScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#ededed] pb-20">
       <div className="bg-white pt-12 pb-8 px-6 flex items-center mb-2">
          <img src={CURRENT_USER.avatar} alt="Me" className="w-16 h-16 rounded-[6px] mr-4" />
          <div className="flex-1">
             <h2 className="text-xl font-bold mb-1">{CURRENT_USER.name}</h2>
             <div className="flex items-center justify-between text-gray-500 text-sm">
                <span>微信号: {CURRENT_USER.wxid}</span>
                <div className="flex items-center">
                    <Icons.Back className="transform rotate-180 text-gray-300 mr-2" size={12} />
                    <Icons.Back className="transform rotate-180 text-gray-300" size={18} />
                </div>
             </div>
          </div>
       </div>

       {[
         { icon: Icons.Chat, label: '服务', color: 'text-[#07C160]' },
       ].map((item, i) => (
         <div key={i} className="bg-white mb-2 px-4 py-3 flex items-center active:bg-gray-100">
            <item.icon className={item.color} size={24} />
            <span className="ml-4 flex-1">{item.label}</span>
            <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
         </div>
       ))}

      <div className="bg-white mb-2">
       {[
         { icon: Icons.Contacts, label: '收藏', color: 'text-blue-500' },
         { icon: Icons.Discover, label: '朋友圈', color: 'text-blue-500' },
         { icon: Icons.Smile, label: '表情', color: 'text-yellow-500' },
         { icon: Icons.More, label: '设置', color: 'text-blue-500' },
       ].map((item, i) => (
         <div key={i} className={`px-4 py-3 flex items-center active:bg-gray-100 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
             {/* Using simple icons for demo, ideally correct ones */}
            <item.icon className={item.color} size={24} />
            <span className="ml-4 flex-1">{item.label}</span>
            <Icons.Back className="transform rotate-180 text-gray-300" size={16} />
         </div>
       ))}
       </div>
    </div>
  );
};

// 5. Chat Window Component
const ChatWindow: React.FC<{ 
  chatId: string; 
  onBack: () => void; 
  initialMessages: Message[];
  contact: Contact;
  onSendMessage: (text: string) => void;
}> = ({ chatId, onBack, initialMessages, contact, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
      setMessages(initialMessages);
  }, [initialMessages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      senderId: 'me',
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    onSendMessage(inputValue);

    if (contact.isAi) {
      setIsTyping(true);
      
      const history = messages.map(m => ({
        role: m.senderId === 'me' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: newMsg.text }] });

      const aiText = await generateAIResponse(history);
      
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        senderId: contact.id,
        timestamp: Date.now(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#ededed] flex flex-col">
      <div className="h-12 bg-[#ededed] flex items-center justify-between px-3 border-b border-gray-300 shrink-0">
        <button onClick={onBack} className="flex items-center text-black">
          <Icons.Back size={24} />
        </button>
        <span className="font-medium text-base">{contact.name} {isTyping ? '(对方正在输入...)' : ''}</span>
        <Icons.More size={24} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && <img src={contact.avatar} className="w-9 h-9 rounded-[4px] mr-2" alt="avatar" />}
              
              <div className={`max-w-[70%] px-3 py-2 rounded-[4px] text-base leading-relaxed break-words relative 
                ${isMe ? 'bg-[#95ec69] text-black' : 'bg-white text-black border border-gray-100'}`}>
                
                {isMe ? (
                   <div className="absolute top-3 -right-1.5 w-3 h-3 bg-[#95ec69] transform rotate-45"></div>
                ) : (
                   <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-100 transform rotate-45"></div>
                )}
                
                <span className="relative z-10">{msg.text}</span>
              </div>

              {isMe && <img src={CURRENT_USER.avatar} className="w-9 h-9 rounded-[4px] ml-2" alt="me" />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#f7f7f7] min-h-[56px] border-t border-gray-300 flex items-center px-2 py-2 shrink-0">
        <Icons.Mic size={28} className="text-gray-700 mx-1 p-1" />
        <div className="flex-1 mx-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white border-none rounded-[4px] py-2 px-3 text-base focus:outline-none"
              placeholder=""
            />
        </div>
        <Icons.Smile size={28} className="text-gray-700 mx-1 p-1" />
        {inputValue.length > 0 ? (
           <button onClick={handleSend} className="bg-[#07C160] text-white px-3 py-1 rounded-[4px] text-sm font-medium ml-1">发送</button>
        ) : (
           <Icons.Add size={28} className="text-gray-700 mx-1 p-1" />
        )}
      </div>
    </div>
  );
};


// --- Layout Wrapper ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'discover' | 'me'>('chats');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/chat')) setActiveTab('chats');
    else if (path === '/contacts') setActiveTab('contacts');
    else if (path === '/discover' || path === '/moments') setActiveTab('discover'); // Keep discover active for sub-routes
    else if (path === '/me') setActiveTab('me');
  }, [location]);

  const handleTabChange = (tab: string) => {
    if (tab === 'chats') navigate('/');
    else navigate(`/${tab}`);
  };

  const isFullScreen = location.pathname.startsWith('/chat/') || location.pathname === '/moments';

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 shadow-2xl relative overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      {!isFullScreen && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange as any} unreadCount={1} />
      )}
    </div>
  );
};

// --- Main App Logic ---
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  
  // Initialize messageStore dynamically from INITIAL_CHATS
  const [messageStore, setMessageStore] = useState<Record<string, Message[]>>(() => {
    const initialStore: Record<string, Message[]> = {};
    INITIAL_CHATS.forEach(chat => {
      if (chat.lastMessage) {
        initialStore[chat.id] = [{...chat.lastMessage}];
      } else {
        initialStore[chat.id] = [];
      }
    });
    return initialStore;
  });

  const handleChatClick = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    navigate(`/chat/${id}`);
  };

  const handleSendMessage = (chatId: string, text: string) => {
      setChats(prev => prev.map(c => {
          if (c.id === chatId) {
              return {
                  ...c,
                  lastMessage: {
                      id: Date.now().toString(),
                      text: text,
                      senderId: 'me',
                      timestamp: Date.now(),
                      type: 'text'
                  }
              };
          }
          return c;
      }));
      
      const newMsg: Message = {
        id: Date.now().toString(),
        text: text,
        senderId: 'me',
        timestamp: Date.now(),
        type: 'text'
      };
      
      setMessageStore(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMsg]
      }));
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ChatsScreen chats={chats} contacts={CONTACTS} onChatClick={handleChatClick} />} />
        <Route path="/contacts" element={<ContactsScreen contacts={CONTACTS} />} />
        <Route path="/discover" element={<DiscoverScreen />} />
        <Route path="/moments" element={<MomentsScreen contacts={CONTACTS} />} />
        <Route path="/me" element={<MeScreen />} />
        <Route path="/chat/:chatId" element={
            <ChatRoomWrapper 
                chats={chats} 
                contacts={CONTACTS} 
                messageStore={messageStore}
                onSendMessage={handleSendMessage}
            />
        } />
      </Routes>
    </Layout>
  );
};

const ChatRoomWrapper: React.FC<{
    chats: ChatSession[],
    contacts: Contact[],
    messageStore: Record<string, Message[]>,
    onSendMessage: (chatId: string, text: string) => void
}> = ({ chats, contacts, messageStore, onSendMessage }) => {
    const navigate = useNavigate();
    const loc = useLocation();
    const id = loc.pathname.split('/chat/')[1];
    
    const chat = chats.find(c => c.id === id);
    const contact = chat ? contacts.find(c => c.id === chat.contactId) : null;
    
    if (!chat || !contact) return <div>Chat not found</div>;

    return (
        <ChatWindow 
            chatId={chat.id} 
            contact={contact} 
            initialMessages={messageStore[chat.id] || []}
            onBack={() => navigate(-1)} 
            onSendMessage={(text) => onSendMessage(chat.id, text)}
        />
    );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;