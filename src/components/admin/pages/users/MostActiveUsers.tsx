// src/components/admin/users/MostActiveUsers.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Props {
  users: any[];
}

export const MostActiveUsers = ({ users }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Most Active Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((u, i) => (
            <div key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">#{i + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <Badge variant="secondary">{u.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};