'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Search,
  Phone,
  Ellipsis,
  Send,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';

export default function MessagesView() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendChatMessage,
    simulateIncomingMessage,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  const activeChat = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = messages[activeConversationId] || [];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h1 className="text-[22px] font-extrabold flex items-center gap-2">
            <MessageCircle className="text-[#16a34a]" size={22} />
            <span>الرسائل</span>
            <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">
              3 جديدة
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                simulateIncomingMessage(
                  activeChat?.name || 'سارة فروزن',
                  'السلام عليكم، تم مراجعة مواصفات الشحنة والكمية جاهزة للتحميل.'
                )
              }
              className="h-9 px-4 bg-[#f0fdf4] text-[#15803d] border border-green-200 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-green-100 transition cursor-pointer shadow-2xs"
            >
              <span>تجربة وصول رسالة</span>
            </button>

            <button
              onClick={() => showToast('بحث في الرسائل قريباً')}
              className="h-9 px-4 bg-white border border-gray-100 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <Search size={14} />
              <span>بحث</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
          {/* Conversations sidebar */}
          <div className="w-full lg:w-[360px] border-b lg:border-b-0 lg:border-l border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-50">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="ابحث في المحادثات..."
                  className="w-full h-10 pr-8 pl-3 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto divide-y divide-gray-50">
              {filteredConversations.map((c) => {
                const isActive = activeConversationId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversationId(c.id)}
                    className={`w-full text-right p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${
                      isActive ? 'bg-[#f0fdf4]' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center font-bold shrink-0`}
                    >
                      {c.initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm truncate">{c.name}</span>
                        <span className="text-[11px] text-gray-400">{c.time}</span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 truncate max-w-[180px]">
                          {c.last}
                        </span>
                        {c.unread > 0 && (
                          <span className="w-5 h-5 bg-[#16a34a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {c.unread}
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">
                          {c.role}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="flex-1 flex flex-col bg-[#f9fafb]">
            {/* Header */}
            <div className="h-[64px] bg-white border-b border-gray-100 px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                    activeChat?.color || 'from-green-100 to-emerald-200 text-green-800'
                  } flex items-center justify-center font-bold`}
                >
                  {activeChat?.initial || 'م'}
                </div>
                <div>
                  <div className="font-bold text-sm">{activeChat?.name || 'محادثة'}</div>
                  <div className="text-[11px] text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>متصل الآن</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`اتصال بـ ${activeChat?.name}`)}
                  className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  <Phone size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <Ellipsis size={16} />
                </button>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-auto p-4 lg:p-6 space-y-3">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 shadow-sm ${
                      msg.sent
                        ? 'bg-[#16a34a] text-white rounded-br-sm'
                        : 'bg-white border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1 ${
                        msg.sent ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="اكتب رسالة..."
                className="flex-1 h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/30"
              />
              <button
                onClick={handleSend}
                className="w-11 h-11 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl flex items-center justify-center transition cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
