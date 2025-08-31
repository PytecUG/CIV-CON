import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon, MapPin, Calendar, X } from "lucide-react";

export function CreatePost() {
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview({ url, type: file.type });
    }
  };

  const clearMedia = () => {
    setMediaPreview(null);
  };

  return (
    <Card className="shadow-soft w-full max-w-full md:max-w-2xl lg:max-w-3xl mx-auto">
      <CardContent className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="flex flex-row items-start gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <Avatar className="h-8 w-8 xs:h-9 sm:h-10 md:h-12 lg:h-14">
            <AvatarImage src="/api/placeholder/40/40" alt="You" />
            <AvatarFallback className="bg-primary-foreground text-gray-700 text-xs xs:text-sm sm:text-base md:text-lg">
              YU
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              placeholder="What's happening in Uganda? Share your thoughts..."
              className="min-h-[80px] xs:min-h-[100px] sm:min-h-[120px] md:min-h-[140px] border-none resize-none focus-visible:ring-0 text-xs xs:text-sm sm:text-base md:text-lg"
            />

            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative mt-2 xs:mt-3 sm:mt-4">
                {mediaPreview.type.startsWith("image/") ? (
                  <img
                    src={mediaPreview.url}
                    alt="preview"
                    className="rounded-md max-h-48 xs:max-h-56 sm:max-h-64 md:max-h-72 w-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview.url}
                    controls
                    className="rounded-md max-h-48 xs:max-h-56 sm:max-h-64 md:max-h-72 w-full"
                  />
                )}
                <button
                  onClick={clearMedia}
                  className="absolute top-1 xs:top-2 right-1 xs:right-2 bg-black/50 text-white rounded-full p-1 xs:p-1.5"
                >
                  <X className="h-3 w-3 xs:h-4 xs:w-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-2 xs:mt-3 sm:mt-4">
              <div className="flex flex-row flex-wrap gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full xs:w-auto">
                {/* Hidden input for file upload */}
                <input
                  type="file"
                  accept="image/*,video/*"
                  id="media-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="media-upload" className="flex-1 xs:flex-none">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full xs:w-auto text-xs xs:text-sm sm:text-base md:text-lg"
                  >
                    <span className="flex items-center">
                      <ImageIcon className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-1 xs:mr-2" />
                      Media
                    </span>
                  </Button>
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 xs:flex-none text-xs xs:text-sm sm:text-base md:text-lg"
                >
                  <MapPin className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-1 xs:mr-2" />
                  Location
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 xs:flex-none text-xs xs:text-sm sm:text-base md:text-lg"
                >
                  <Calendar className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-1 xs:mr-2" />
                  Event
                </Button>
              </div>

              <Button
                variant="premium"
                className="hover:scale-105 transition-all duration-200 w-full xs:w-auto text-xs xs:text-sm sm:text-base md:text-lg px-3 xs:px-4 sm:px-5 md:px-6"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}