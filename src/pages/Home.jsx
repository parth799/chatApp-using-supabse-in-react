import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { getInit } from "../utils/getInitialsFromName";
import localStorageService from "@/services/localStorageService";
import chatService from "@/services/chatService";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatsHeader from "../components/ChatsHeader";
import ChatWindow from "../components/ChatWindow/ChatWindow";

function Home() {
  const [currentChannel, setCurrentChannel] = useState(null);
  const channels = useLoaderData();
  return (
    <>
      <div className="h-screen w-full min-w-lg flex items-center justify-start">
        <Sidebar />
        <div className="h-full w-1/4 p-4 bg-gray-800 border-l border-r border-0.5 border-black">
          <ChatsHeader />
          <ul>
            {channels.map((channel) => (
              <li key={channel.id} className="mb-2">
                <div
                  className={`w-full p-2 flex items-center gap-4 hover:bg-gray-700 cursor-pointer rounded-md ${
                    currentChannel &&
                    currentChannel.id == channel.id &&
                    "bg-gray-700"
                  }`}
                  onClick={() => setCurrentChannel(channel)}
                >
                  <Avatar>
                    <AvatarFallback>{getInit(channel.slug)}</AvatarFallback>
                  </Avatar>
                  <strong className="text-white">{channel.slug}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-full w-3/4 bg-gray-800 relative">
          <ChatWindow currentChannel={currentChannel} channels={channels} />
        </div>
      </div>
    </>
  );
}

export const homeLoader = async (authService) => {

  // The below code is for preventing multi-tab access
  const preventMultiTabAccess = () => localStorageService.removeData("sessionId");
  window.addEventListener("beforeunload", preventMultiTabAccess);
  const existingSession = localStorageService.fetchData({ key: "sessionId" });
  if (existingSession) {
    window.removeEventListener("beforeunload", preventMultiTabAccess);
    return redirect("/error/multi-tab access blocked");
  }
  else localStorageService.setData({ key: "sessionId", data: uuidv4() });


  try {
    const user = await authService.getCurrentUser();
    const channels = await chatService.fetchChannels(user.user.id);
    return channels;
  } catch (error) {
    return redirect("/");
  }
};

export default Home;
