// src/components/admin/groups/GroupProfile.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, GitBranch } from "lucide-react";
import { Group } from "@/types/group";



interface Props {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupProfile = ({ group, open, onOpenChange }: Props) => {
  if (!group) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green-600" />
            Group Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm">{group.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Members
            </span>
            <span className="text-sm font-medium">{group.members}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              className={
                group.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : group.status === "Suspended"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {group.status}
            </Badge>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="text-sm">Created</span>
            <span className="text-sm">{group.createdAt}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};