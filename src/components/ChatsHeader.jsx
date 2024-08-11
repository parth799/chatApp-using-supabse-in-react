import React, { useRef, useState, useEffect } from "react";

import authService from "@/services/authService";
import chatService from "@/services/chatService";
import contactService from "../services/contactService";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { HiMiniPencilSquare, HiMiniPlus, HiMiniUsers } from "react-icons/hi2";
import CheckboxList from "./CheckboxList";

function ChatsHeader() {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const groupNameRef = useRef(null);
  const className =
    "p-1.5 flex justify-start items-center bg-gray-900 text-white font-medium rounded-md";

  useEffect(() => {
    const getContacts = async () => {
      const user = await authService.getCurrentUser();
      const userId = user.user.id;
      const contacts = await contactService.getAllContacts({ userId });
      setContacts(contacts);
    };
    getContacts();
  }, []);
  console.log(contacts)

  const handleNewContact = async () => {
    try {
      const email = emailRef.current.value;
      const nickname = nameRef.current.value;
      const user = await authService.getCurrentUser();
      const userId = user.user.id;
      await contactService.addContact({ userId, email, nickname });
      toast.info("Contact added successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleNewGroup = async () => {
    try {
      const type = "group";
      const slug = groupNameRef.current.value;
      const user = await authService.getCurrentUser();
      const userId = user.user.id;
      await chatService.createChannel({
        slug,
        createdBy: userId,
        type,
        participants: selectedContacts,
      });
      toast.info("Group created Successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center text-white text-xl mb-4">
      <strong>Chats</strong>
      <Popover>
        <PopoverTrigger>
          <div className="py-1 px-3">
            <HiMiniPencilSquare />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 bg-gray-700 border-0 flex flex-col gap-2"
          side="bottom"
          align="start"
          alignOffset={15}
        >
          <Dialog>
            <DialogTrigger>
              <div className={className}>
                <HiMiniPlus className="mr-2 text-lg" />
                <p>New Contact</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-0">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" ref={emailRef} />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input id="nickname" name="nickname" type="text" ref={nameRef} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <div className="mr-1 py-1.5 px-4 text-sm text-black font-semibold rounded-md bg-gray-100">
                    Cancel
                  </div>
                </DialogClose>

                <DialogClose>
                  <div
                    className="p-1.5 text-sm font-semibold rounded-md bg-lime-500"
                    onClick={async () => {
                      await handleNewContact();
                    }}
                  >
                    Add Contact
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className={className}>
                <HiMiniUsers className="mr-4 text-lg" />
                <p>New Group</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-0">
              <DialogHeader>
                <DialogTitle>Add New Group</DialogTitle>
              </DialogHeader>
              <Input name="Group Name" placeholder="Group Name" ref={groupNameRef} />
              <CheckboxList
                items={contacts}
                setItems={setselectedContacts}
                filterAttribute="contact_id"
                displayAttribute="contact_email"
              />
              <DialogFooter>
                <DialogClose>
                  <div className="mr-1 py-1.5 px-4 text-sm text-black font-semibold rounded-md bg-gray-100">
                    Cancel
                  </div>
                </DialogClose>

                <DialogClose>
                  <div
                    className="p-1.5 text-sm font-semibold rounded-md bg-lime-500"
                    onClick={async () => {
                      await handleNewGroup();
                    }}
                  >
                    Add Group
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ChatsHeader;
