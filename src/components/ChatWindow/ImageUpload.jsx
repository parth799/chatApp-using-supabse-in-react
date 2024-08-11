import { useState, useRef, forwardRef } from "react";

import authService from "@/services/authService";
import chatService from "@/services/chatService";

import { IoImageOutline, IoSend, IoCloseCircle } from "react-icons/io5";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ImageUpload = forwardRef(function ImageUpload({ channelId, setMessages }, ref) {
  const [file, setFile] = useState(null);
  const msgRef = useRef(null);

  const handleDialogClose = () => {
    setFile(null);
    ref.current.close();
  };

  const handleNewMessage = async (file) => {
    try {
      const message = msgRef.current.value;
      const user = await authService.getCurrentUser();
      await chatService.createMessage({
        message,
        userId: user.user.id,
        channelId,
        file,
        setMessages
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <label htmlFor="image-upload" className="cursor-pointer">
        <IoImageOutline className="text-xl" />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            ref.current.showModal();
          }}
        />
      </label>
      <dialog ref={ref} className="shadow-lg relative">
        {file && (
          <>
            <div className="flex flex-col items-center max-h-96 bg-gray-700">
              <img
                src={URL.createObjectURL(file)}
                alt="Selected image"
                className="aspect-video max-h-96"
              />
              <div className="w-full px-4 py-3 absolute flex items-center gap-6 bottom-0 bg-gray-800 text-white">
                <ScrollArea className="w-full">
                  <textarea
                    type="text"
                    placeholder="Type Something..."
                    ref={msgRef}
                    className="w-full h-auto border-none bg-gray-800 outline-none focus:outline-none resize-none overflow-y-auto"
                    maxLength={255}
                    rows="1"
                  />
                </ScrollArea>

                <Button
                  variant="ghost"
                  onClick={() => {
                    handleNewMessage(file);
                    handleDialogClose();
                  }}
                >
                  <IoSend />
                </Button>
              </div>
            </div>
            <div className="absolute top-2 right-2 rounded-full">
              <IoCloseCircle
                className="text-2xl text-white cursor-pointer"
                onClick={handleDialogClose}
              />
            </div>
          </>
        )}
      </dialog>
    </>
  );
});

export default ImageUpload;
