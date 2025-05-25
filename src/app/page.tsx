'use client';

import Message from "@/components/message";
import { MessageInfo } from "@/utils/type";
import { FormEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

    socket.on('chat message', (msg: MessageInfo) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    if (!socket.connected || !socket.id) {
      return;
    }

    e.preventDefault();

    if (input.trim() !== '') {
      const messageInfo: MessageInfo = {
        id: socket.id,
        name,
        message: input,
        sentAt: new Date().toISOString(),
      }

      socket.emit('chat message', messageInfo);
      setInput('');
    }
  }

  return (
    <div className="p-4 space-y-4 h-screen flex flex-col">
      <h1 className="text-xl font-bold">실시간 채팅</h1>
      <div 
        className="border p-2 overflow-y-auto bg-gray-00 rounded flex flex-col gap-3 flex-1"
        ref={chatRef}
      >
        {messages.map(({ id, name, message, sentAt }) => (
          <Message
            key={`${id}-${sentAt}`}
            name={name}
            message={message}
            sentAt={sentAt}
            isMine={id === socket.id}
          />
        ))}
      </div>
      <form
        className="flex space-x-2"
        onSubmit={handleSendMessage}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="이름을 입력하세요"
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="메시지를 입력하세요"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500"
          disabled={name === '' || input === ''}
        >
          전송
        </button>
      </form>
    </div>
  );
}
