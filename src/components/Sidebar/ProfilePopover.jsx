import React, { useEffect, useState} from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { getInit } from "../../utils/getInitialsFromName";

function ProfilePopover({ authService }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const getUser = async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarFallback>
            {getInit(user?.user.user_metadata.display_name ?? "")}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        className="w-44 bg-gray-700 border-0"
        side="right"
        sideOffset="1"
      ></PopoverContent>
    </Popover>
  );
}

export default ProfilePopover