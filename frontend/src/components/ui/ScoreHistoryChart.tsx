"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

const data = [
  { month: "Oct", score: 680 },
  { month: "Nov", score: 710 },
  { month: "Dec", score: 690 },
  { month: "Jan", score: 745 },
  { month: "Feb", score: 810 },
  { month: "Mar", score: 847 },
];

export function ScoreHistoryChart() {
  return (
    <div className="w-full h-full min-h-[300px] bg-surface-1 border border-border-subtle p-6 rounded-sm flex flex-col gap-6 shadow-xl">
      <h3 className="font-body text-[12px] uppercase tracking-widest font-bold text-text-primary">Historical Fluctuation</h3>
      <div className="flex-1 w-full relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <ReferenceLine y={900} stroke="#818CF8" strokeOpacity={0.4} strokeDasharray="4 4" />
            <ReferenceLine y={750} stroke="#F59E0B" strokeOpacity={0.4} strokeDasharray="4 4" />
            <ReferenceLine y={600} stroke="#94A3B8" strokeOpacity={0.4} strokeDasharray="4 4" />
            
            <XAxis dataKey="month" stroke="#4A5A75" fontSize={10} tickLine={false} axisLine={false} fontFamily="var(--font-jetbrains-mono)" dy={10} />
            <YAxis stroke="#4A5A75" fontSize={10} tickLine={false} axisLine={false} fontFamily="var(--font-jetbrains-mono)" domain={[500, 1000]} dx={-10} />
            <Tooltip 
               contentStyle={{ backgroundColor: "#0D1117", border: "1px solid #1F2D45", fontFamily: "var(--font-jetbrains-mono)", fontSize: "12px", borderRadius: "2px" }} 
               itemStyle={{ color: "#F59E0B" }} 
               cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            <Line type="stepAfter" dataKey="score" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#0D1117", stroke: "#F59E0B", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#F59E0B" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
