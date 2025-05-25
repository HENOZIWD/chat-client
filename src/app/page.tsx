'use client';

import { FormEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

    socket.on('chat message', (msg: string) => {
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
    e.preventDefault();

    if (input.trim() !== '') {
      socket.emit('chat message', input);
      setInput('');
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">실시간 채팅</h1>
      <div 
        className="border p-2 h-64 overflow-y-auto bg-gray-100 rounded"
        ref={chatRef}
      >
        {messages.map((msg, i) => (
          <p key={i} className="text-sm">{msg}</p>
        ))}
      </div>
      <form
        className="flex space-x-2"
        onSubmit={handleSendMessage}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="메시지를 입력하세요"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          전송
        </button>
      </form>
    </div>
  );
}
