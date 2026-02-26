"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { HeatmapData } from '@/lib/analytics'

interface MarginHeatmapProps {
    data: HeatmapData[]
}

// Color scale: red → yellow → green based on margin percentage
function getMarginColor(margin: number): string {
    if (margin >= 18) return '#29FFC6' // Excellent — teal
    if (margin >= 15) return '#4ADE80' // Good — green
    if (margin >= 12) return '#FACC15' // Average — yellow
    return '#F87171'                   // Low — red
}

export function MarginHeatmap({ data }: MarginHeatmapProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 50, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis
                        type="number"
                        domain={[0, 25]}
                        tickFormatter={(v: number) => `${v}%`}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }}
                        width={110}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0D1F35',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}
                        formatter={(value: unknown) => [`${value}%`, 'Margen']}
                        itemStyle={{ color: '#29FFC6' }}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar
                        dataKey="margin"
                        radius={[0, 6, 6, 0]}
                        barSize={18}
                        label={{
                            position: 'right',
                            formatter: (v: unknown) => `${Number(v)}%`,
                            fill: 'rgba(255,255,255,0.4)',
                            fontSize: 10,
                            fontWeight: 'bold'
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getMarginColor(entry.margin)}
                                fillOpacity={0.75}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
