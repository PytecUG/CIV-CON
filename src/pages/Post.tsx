import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePost } from "@/components/form/CreatePost";
import { PlusCircle } from "lucide-react";

function Post() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end px-2 xs:px-3 sm:px-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="premium"
              className="hover:scale-105 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg px-3 xs:px-4 sm:px-5 md:px-6"
            >
              <PlusCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1 xs:mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] p-3 xs:p-4 sm:p-5">
            <DialogHeader>
              <DialogTitle className="text-sm xs:text-base sm:text-lg md:text-xl">
                Create a New Post
              </DialogTitle>
            </DialogHeader>
            <CreatePost />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Post;