import React, { useEffect, useRef, useState } from "react";
import authService from "@/services/authService";
import chatService from "@/services/chatService";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import ChatBubble from "./ChatBubble";
import ImageUpload from "./ImageUpload";
import { IoSend, IoHappyOutline } from "react-icons/io5";
import { toast } from "sonner";

function ChatWindow({ currentChannel, channels }) {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const msgRef = useRef(null);
  const uploadImgRef = useRef(null);
  const msgActionsRef = useRef(null);

  useEffect(() => {
    const getMessages = async ({ channelId }) => {
      const messages = await chatService.fetchMessages({ channelId });
      setMessages(messages);
    };

    if (currentChannel) {
      chatService.subscribeToChannel({
        channelId: currentChannel.id,
        setMessages,
        user: currentUser.user,
      });
      getMessages({ channelId: currentChannel.id });
    }
  }, [currentChannel]);

  useEffect(() => {
    const getUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        backgroundImage: `url("/src/assets/chat_bg.png")`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      {currentChannel == null ? (
        <></>
      ) : (
        <>
          <div className="w-full p-4 flex justify-center items-center bg-gray-800 shadow-md font-semibold text-white">
            <p>{currentChannel.slug}</p>
          </div>
          <ScrollArea>
            <ul className="w-full p-2 text-white mb-16">
              {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : null;
                return (
                  <li key={message.id} className="mb-1">
                    <ChatBubble
                      user={currentUser.user}
                      message={message}
                      previousMessage={previousMessage}
                      channels={channels}
                      ref={msgActionsRef}
                    />
                  </li>
                );
              })}
            </ul>
          </ScrollArea>

          <div className="w-full px-4 py-3 absolute flex items-center gap-6 bottom-0 bg-gray-800 text-white">
            <IoHappyOutline className="text-xl" />
            <ImageUpload
              channelId={currentChannel.id}
              setMessages={setMessages}
              ref={uploadImgRef}
            />
            <ScrollArea className="w-full">
              <textarea
                ref={msgRef}
                type="text"
                placeholder="Type Something..."
                className="w-full h-auto border-none bg-gray-800 outline-none focus:outline-none resize-none overflow-y-auto"
                maxLength={255}
                rows="1"
              />
            </ScrollArea>

            <Button
              variant="ghost"
              onClick={() => {
                handleNewMessage();
              }}
            >
              <IoSend />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  async function handleNewMessage() {
    if (msgRef.current.value) {
      try {
        await chatService.createMessage({
          message: msgRef.current.value,
          userId: currentUser.user.id,
          channelId: currentChannel.id,
          setMessages
        });
        msgRef.current.value = "";
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }
}

export default ChatWindow;
