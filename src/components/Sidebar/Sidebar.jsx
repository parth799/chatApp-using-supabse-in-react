import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "@/services/authService";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { IoSettingsOutline } from "react-icons/io5"; /* prettier-ignore */

import ProfilePopover from "./ProfilePopover";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div
      className="h-full px-2 py-4 flex flex-col justify-end items-center"
      style={{
        backgroundImage: `url('/src/assets/chat_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <Popover>
          <PopoverTrigger>
            <div className="py-1 px-3">
              <IoSettingsOutline className="text-white text-2xl" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-44 bg-gray-700 border-0"
            side="right"
            sideOffset="1"
          >
            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                try {
                  await authService.signOut();
                  navigate("/", { replace: true });
                } catch (error) {
                  toast.error(error.message);
                  console.log(error);
                }
              }}
            >
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>

        <ProfilePopover authService={authService} />
      </div>
    </div>
  );
}

export default Sidebar;
