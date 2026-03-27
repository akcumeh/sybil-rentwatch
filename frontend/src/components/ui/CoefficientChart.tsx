'use client';

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const data = [
    { time: '00:00', value: 300 },
    { time: '04:00', value: 450 },
    { time: '08:00', value: 800 },
    { time: '12:00', value: 750 },
    { time: '16:00', value: 845 },
    { time: '20:00', value: 620 },
    { time: '24:00', value: 500 },
];

export function CoefficientChart() {
    return (
        <div className="w-full h-[300px] mt-8 bg-surface/30 p-4 clinical-border rounded-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />
            <h3 className="font-syne text-sm text-slate-400 mb-6 uppercase tracking-widest px-2 flex items-center justify-between">
                <span>Coefficient Volatility</span>
                <span className="font-mono text-xs text-primary/70">LIVE</span>
            </h3>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A85FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#1A85FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        fontFamily="var(--font-jet)"
                        tick={{ fill: '#64748B' }}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        fontFamily="var(--font-jet)"
                        tick={{ fill: '#64748B' }}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0A101D',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '0.125rem',
                            fontFamily: 'var(--font-jet)',
                        }}
                        itemStyle={{ color: '#1A85FF' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#1A85FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
