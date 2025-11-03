import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Clock,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  district: string;
  role: string;
  status: "Active" | "Suspended" | "Pending";
  avatar?: string;
  createdAt: string;
  subscriptionEnd?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  subscriptionAmount?: number;
}

interface UserProfileProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfile = ({
  user,
  open,
  onOpenChange,
}: UserProfileProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Profile</span>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar & Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge
                variant={
                  user.status === "Active"
                    ? "default"
                    : user.status === "Suspended"
                    ? "destructive"
                    : "secondary"
                }
              >
                {user.status}
              </Badge>
            </div>
          </div>

          {/* Core info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{user.district}</span>
            </div>
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{user.role}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Sub ends:{" "}
                {user.subscriptionEnd
                  ? format(new Date(user.subscriptionEnd), "MMM d, yyyy")
                  : "Free"}
              </span>
            </div>
          </div>

          {/* Subscription info */}
          {user.subscriptionTier && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Subscription
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Tier:</div>
                <div className="font-medium">{user.subscriptionTier}</div>
                <div>Status:</div>
                <div className="font-medium">{user.subscriptionStatus}</div>
                <div>Amount:</div>
                <div className="font-medium">
                  UGX {user.subscriptionAmount?.toLocaleString() || 0}/mo
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
