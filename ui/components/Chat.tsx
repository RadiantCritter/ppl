'use client';

import { useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import { Message } from './ChatWindow';
import MessageBox from './MessageBox';
import MessageBoxLoading from './MessageBoxLoading';

const Chat = ({
  loading,
  messages,
  sendMessage,
  messageAppeared,
  rewrite,
}: {
  messages: Message[];
  sendMessage: (message: string) => void;
  loading: boolean;
  messageAppeared: boolean;
  rewrite: (messageId: string) => void;
}) => {
  const [dividerWidth, setDividerWidth] = useState(0);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDividerWidth = () => {
      if (dividerRef.current) {
        setDividerWidth(dividerRef.current.scrollWidth);
      }
    };

    updateDividerWidth();

    window.addEventListener('resize', updateDividerWidth);

    return () => {
      window.removeEventListener('resize', updateDividerWidth);
    };
  });

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });

    if (messages.length === 1) {
      document.title = `${messages[0].content.substring(0, 30)} -  ash`;
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-6 pt-8 pb-44 lg:pb-32 sm:mx-4 md:mx-8">
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1;

        return (
          <>
            <MessageBox
              key={i}
              message={msg}
              messageIndex={i}
              history={messages}
              loading={loading}
              dividerRef={isLast ? dividerRef : undefined}
              isLast={isLast}
              rewrite={rewrite}
            />
            {!isLast && msg.role === 'assistant' && (
              <div className="h-px w-full bg-[#1C1C1C]" />
            )}
          </>
        );
      })}
      {loading && !messageAppeared && <MessageBoxLoading />}
      <div ref={messageEnd} className="h-0" />
      {dividerWidth > 0 && (
        <div
          className="bottom-24 lg:bottom-10 fixed z-40"
          style={{ width: dividerWidth }}
        >
          <MessageInput loading={loading} sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
};

export default Chat;
