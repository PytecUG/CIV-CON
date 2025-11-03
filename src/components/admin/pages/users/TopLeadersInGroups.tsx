// src/components/admin/users/TopLeadersInGroups.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Kampala Leaders", groups: 12 },
  { name: "Jinja Leaders", groups: 9 },
  { name: "Gulu Leaders", groups: 7 },
  { name: "Mbale Leaders", groups: 5 },
  { name: "Mbarara Leaders", groups: 4 },
];

export const TopLeadersInGroups = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Leader Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="groups" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};