import React, { useState, useRef, useEffect } from "react";
import { getGeminiResponse } from "/src/lib/geminiApi.js";

import { Minus, X, ArrowDown, Forward, MessageSquare, Bot } from "lucide-react";


const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);


const ChatWidget = () => {
  const initialMessage = {
    id: 1,
    sender: "ai",
    text: "Hello! How can I help you today?",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleEndChat = () => {
    setMessages([initialMessage]);
    setIsOpen(false);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "" || isBotTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsBotTyping(true);

    const aiText = await getGeminiResponse(userMessage.text);

    const aiResponse = {
      id: Date.now() + 1,
      sender: "ai",
      text: aiText,
    };

    setMessages((prevMessages) => [...prevMessages, aiResponse]);
    setIsBotTyping(false);
  };
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
      // Show button if user has scrolled up more than 100px from the bottom
      const isScrolledUp =
        container.scrollHeight - container.scrollTop >
        container.clientHeight + 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  return (
    <div className="fixed  bottom-5 right-5 z-50 font-sans">
      {/* Chat Window */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-[90vw] max-w-[400px] 
  sm:w-96 h-[70vh] sm:h-[500px] max-h-[90vh]
 bg-white rounded-lg shadow-2xl flex flex-col ">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 to-blue-400 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-bold">AI Sales Assistant</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMinimize}
                title="Minimize Chat"
                className="bg-blue-700 p-2 rounded-full hover:bg-blue-900"
              >
                <Minus
                  size={22}
                  stroke="white"
                  fill="none"
                  className="text-white"
                />
              </button>
              <button
                onClick={handleEndChat}
                title="End Chat"
                className="bg-blue-700 p-2 rounded-full hover:bg-blue-900"
              >
                <X
                  size={22}
                  stroke="white"
                  fill="none"
                  className="text-white"
                />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
             className="flex-1 p-4 overflow-y-auto relative scrollbar-thin"
            ref={messageContainerRef}
            onScroll={handleScroll}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && <Bot className="w-8 h-8 flex-shrink-0 rounded-full bg-white text-blue-800" />}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex mb-4 items-end justify-start">
                <Bot className="w-8 h-8 flex-shrink-0 rounded-full bg-white text-blue-800" />

                <div className="bg-gray-200 rounded-2xl rounded-bl-none">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            {showScrollButton && (
              <div className="sticky bottom-0 flex justify-center pb-3 sm:pb-4">
                <button
                  onClick={scrollToBottom}
                  className="p-1 rounded-full shadow-md hover:scale-110 transition-transform z-50"
                >
                  <ArrowDown size={20} className="bg-blue-500 rounded-full text-white sm:w-5 sm:h-5"/>
                </button>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-b-lg flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isBotTyping ? "Waiting for response..." : "Type a message..."
              }
              className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border bg-white text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-xs sm:text-sm"
              disabled={isBotTyping}
            />
            <button
              type="submit"
              className="ml-2 sm:ml-3 bg-blue-600 p-2 sm:p-2.5 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:bg-blue-500 disabled:cursor-not-allowed"
              disabled={isBotTyping}
            >
              <Forward className=" font-bold text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
          <button
            onClick={toggleOpen}
            className="bg-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 ease-in-out"
            aria-label="Open chat"
          >
            <MessageSquare
              className=" text-white font-bold"
              size={28}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
