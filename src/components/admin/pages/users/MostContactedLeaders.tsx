// src/components/admin/users/MostContactedLeaders.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const leaders = [
  { name: "Hon. Moses Ali", district: "Jinja", contacts: 342 },
  { name: "Sarah Namutebi", district: "Gulu", contacts: 289 },
  { name: "John Kizza", district: "Kampala", contacts: 198 },
];

export const MostContactedLeaders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Most Contacted Leaders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaders.map((l, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="font-medium">{l.name}</span>
              <span className="text-muted-foreground">{l.district} · {l.contacts} contacts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};