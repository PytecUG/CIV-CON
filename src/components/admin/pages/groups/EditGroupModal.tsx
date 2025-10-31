// src/components/admin/groups/EditGroupModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Group {
  id: number;
  name: string;
  members: number;
  status: "Active" | "Suspended" | "Pending";
}

interface Props {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Group) => void;
}

export const EditGroupModal = ({ group, open, onOpenChange, onSave }: Props) => {
  const { toast } = useToast();
  const [edited, setEdited] = useState<Group | null>(null);

  useEffect(() => setEdited(group), [group]);

  const handleSave = () => {
    if (edited) {
      onSave(edited);
      toast({ title: "Saved", description: `${edited.name} updated.` });
      onOpenChange(false);
    }
  };

  if (!edited) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={edited.name} onChange={e => setEdited({ ...edited, name: e.target.value })} />
          </div>
          <div>
            <Label>Members</Label>
            <Input
              type="number"
              value={edited.members}
              onChange={e => setEdited({ ...edited, members: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={edited.status} onValueChange={v => setEdited({ ...edited, status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};