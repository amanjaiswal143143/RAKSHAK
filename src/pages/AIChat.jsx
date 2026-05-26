import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import { getGeminiResponse } from '../services/api/gemini';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        'Hello 👋 I am Rakshak AI. How can I help you during this emergency?',
    },
  ]);

  const [input, setInput] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  /* Auto Scroll */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: 'smooth',
      }
    );
  }, [messages]);

  /* SEND MESSAGE */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput('');

    setLoading(true);

    try {
      const aiReply =
        await getGeminiResponse(
          input
        );

      const aiMessage = {
        sender: 'ai',
        text: aiReply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            '❌ Failed to get AI response.',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background Glow */}

      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-500/10 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full" />

      {/* Main Content */}

      <div className="relative z-10 p-5">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-5xl font-black tracking-tight">
            Rakshak{' '}
            <span className="text-cyan-400">
              AI
            </span>
          </h1>

          <p className="text-zinc-400 mt-2 text-lg">
            Emergency Intelligence
            Assistant
          </p>

        </div>

        {/* Quick Suggestions */}

        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 no-scrollbar">

          {[
            'Accident',
            'Bleeding',
            'Fire',
            'Nearby Hospital',
            'SOS Help',
            'Panic Attack',
            'CPR Steps',
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setInput(item)
              }
              className="
                bg-zinc-900/80
                backdrop-blur-lg
                border
                border-zinc-700
                hover:border-cyan-400
                px-5
                py-3
                rounded-full
                text-sm
                whitespace-nowrap
                transition-all
                duration-300
                hover:scale-105
              "
            >
              {item}
            </button>
          ))}

        </div>

        {/* Chat Messages */}

        <div className="space-y-5 pb-40">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`flex ${
                  msg.sender ===
                  'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[85%] p-5 rounded-3xl shadow-2xl transition-all duration-300 ${
                    msg.sender ===
                    'user'
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-zinc-900/80 border border-cyan-500/20 backdrop-blur-xl'
                  }`}
                >

                  <p className="text-[15px] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                </div>

              </div>
            )
          )}

          {/* Loading */}

          {loading && (
            <div className="flex justify-start">

              <div className="bg-zinc-900/80 border border-cyan-500/20 backdrop-blur-xl px-5 py-4 rounded-3xl">

                <p className="animate-pulse">
                  🤖 Rakshak AI is
                  thinking...
                </p>

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>
      </div>

      {/* Input Area */}

      <div className="fixed bottom-20 left-0 w-full px-4 z-50">

        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-zinc-700 rounded-3xl p-3 flex items-center gap-3 shadow-2xl">

          <input
            type="text"
            placeholder="Ask Rakshak AI..."
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key ===
                'Enter' &&
              sendMessage()
            }
            className="
              flex-1
              bg-transparent
              px-3
              py-4
              outline-none
              text-white
              placeholder:text-zinc-500
            "
          />

          <button
            onClick={sendMessage}
            className="
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              text-black
              font-bold
              px-6
              py-4
              rounded-2xl
            "
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default AIChat;