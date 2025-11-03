import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // unsigned preset

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [fallback, setFallback] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // TipTap no longer supports `onError`, so we use try/catch fallback
  useEffect(() => {
    if (!editor) return;
    try {
      editor.getHTML();
    } catch {
      console.error("TipTap init failed — fallback to textarea");
      setFallback(true);
    }
    return () => editor?.destroy?.();
  }, [editor]);

  if (fallback) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your article content here..."
        rows={8}
      />
    );
  }

  if (!editor) return null;

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    isActive,
    label,
  }: {
    icon: React.ElementType;
    onClick: () => void;
    isActive?: boolean;
    label: string;
  }) => (
    <Button
      type="button"
      size="sm"
      variant={isActive ? "default" : "ghost"}
      className="p-2"
      onClick={onClick}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const { data } = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.secure_url) {
          editor.chain().focus().setImage({ src: data.secure_url }).run();
          toast.success("Image uploaded successfully!");
        } else throw new Error("Missing Cloudinary URL");
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed. Try again.");
      }
    };

    input.click();
  };

  const handleAddLink = () => {
    const url = window.prompt("Enter a valid URL:");
    if (!url) return;
    try {
      new URL(url);
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      toast.success("Link added!");
    } catch {
      toast.error("Invalid URL format");
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2 rounded-t-lg">
        <ToolbarButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="Bold"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="Italic"
        />
        <ToolbarButton
          icon={Heading}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          label="Heading"
        />
        <ToolbarButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="Ordered List"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          label="Quote"
        />
        <ToolbarButton icon={LinkIcon} onClick={handleAddLink} label="Add Link" />
        <ToolbarButton icon={ImageIcon} onClick={handleImageUpload} label="Add Image" />
      </div>

      <div className="prose max-w-none p-4 min-h-[250px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
