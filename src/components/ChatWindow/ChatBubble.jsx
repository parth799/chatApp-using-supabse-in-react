import React, { forwardRef, useState } from "react";
import chatService from "@/services/chatService";
import CheckboxList from "../CheckboxList";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"; /* prettier-ignore */
import { toast } from "sonner";
import { AiOutlineLoading3Quarters, AiFillCopy } from "react-icons/ai";
import { ImReply, ImForward } from "react-icons/im";

const ChatBubble = forwardRef(function ChatBubble(
  { user, message, previousMessage, inserted_at, channels, ...props },
  ref
) {
  const isCurrentUser = message.user_id === user.id;
  const currDate = inserted_at ?? new Date(message.inserted_at);
  const prevDate = new Date(previousMessage?.inserted_at);
  const hour = currDate.getHours().toString().padStart(2, "0");
  const minute = currDate.getMinutes().toString().padStart(2, "0");

  const [chatsToForwardMessageTo, setChatsToForwardMessageTo] = useState([]);

  const isDateChanged = previousMessage && currDate.getDate() !== prevDate.getDate();
  return (
    <>
      <div className="w-full">
        {isDateChanged && (
          <p className="w-20 mx-auto bg-gray-700 text-center text-sm text-gray-300 rounded-sm">
            {prevDate.toLocaleDateString()}
          </p>
        )}

        <div className={`flex justify-${isCurrentUser ? "end" : "start"}`}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`max-w-lg px-2 pt-1 rounded-sm ${
                  isCurrentUser ? "bg-lime-600 text-end" : "bg-gray-700 text-start"
                }`}
              >
                {/* only one of localUrl or imgurl would be rendered at runtime, so don't worry about double images */}
                {message.localUrl && (
                  <div className="relative">
                    <img
                      src={message.localUrl}
                      alt="image"
                      className={`rounded-sm my-1 ${
                        message.loading == true && "brightness-50"
                      }`}
                    />
                    <AiOutlineLoading3Quarters
                      className={`absolute top-1/2 left-1/2 text-2xl font-bold animate-spin ${
                        message.loading == false && "hidden"
                      }`}
                    />
                  </div>
                )}

                {message.imgurl && (
                  <img
                    src={chatService.fetchDownloadUrl(message.imgurl).publicUrl}
                    alt="image"
                    className="rounded-sm my-1"
                  />
                )}
                {message.message && <p className="text-white">{message.message}</p>}
                <p className="text-2xs text-gray-300">{`${hour}:${minute}`}</p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 bg-gray-700 text-white border-none">
              <ContextMenuItem>
                <div
                  className="flex gap-2 items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(message?.message);
                    toast.info("Message copied");
                  }}
                >
                  <AiFillCopy />
                  <p>Copy</p>
                </div>
              </ContextMenuItem>
              <ContextMenuItem>
                <div className="flex gap-2 items-center">
                  <ImReply />
                  <p>Reply</p>
                </div>
              </ContextMenuItem>
              <ContextMenuItem>
                <div
                  className="flex gap-2 items-center"
                  onClick={() => ref.current.showModal()}
                >
                  <ImForward />
                  <p>Forward</p>
                </div>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
      <dialog ref={ref} className="shadow-lg relative">
        <CheckboxList
          items={channels}
          setItems={setChatsToForwardMessageTo}
          filterAttribute="id"
          displayAttribute="slug"
        />
        {/* implement the rest of the functionality for forwarding messages */}
      </dialog>
    </>
  );
});

export default ChatBubble;
