// src/components/admin/users/EditUserModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const DISTRICTS = ["Kampala", "Gulu", "Jinja", "Mbale", "Mbarara", "Arua", "Lira", "Soroti", "Hoima", "Fort Portal"];
const ROLES = ["Citizen", "Journalist", "Leader", "Student", "NGO", "Admin"];

interface EditUserModalProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: any) => void;
}

export const EditUserModal = ({ user, open, onOpenChange, onSave }: EditUserModalProps) => {
  const { toast } = useToast();
  const [edited, setEdited] = useState(user);

  const handleSave = () => {
    onSave(edited);
    toast({ title: "User Updated", description: `${edited.name} has been updated.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={edited.name} onChange={e => setEdited({ ...edited, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={edited.email} onChange={e => setEdited({ ...edited, email: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={edited.phone || ""} onChange={e => setEdited({ ...edited, phone: e.target.value })} />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={edited.role} onValueChange={v => setEdited({ ...edited, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>District</Label>
            <Select value={edited.district} onValueChange={v => setEdited({ ...edited, district: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};