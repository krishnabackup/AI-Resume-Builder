import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DocumentBreakdown = ({ resumesCount = 33 }) => {
    // Using static/prop data matching the UI closely, while allowing dynamic resumesCount
    const data = [
        { name: 'Resumes', value: resumesCount, color: '#0284c7' }, // Light blue
        { name: 'CVs', value: 2, color: '#1e3a8a' }, // Dark blue
        { name: 'Cover Letters', value: 1, color: '#f97316' }, // Orange
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-100 shadow-md rounded-md text-sm font-medium">
                    <span style={{ color: payload[0].payload.color }}>● </span>
                    {payload[0].name}: {payload[0].value}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Document Breakdown</h3>
                <p className="text-sm text-gray-500">Total creations across all types</p>
            </div>

            <div className="relative flex-grow flex items-center justify-center h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-bold pointer-events-none mt-4">
                    <span className="text-4xl text-gray-900">{total}</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-wider">TOTAL ASSETS</span>
                </div>
            </div>

            {/* Legend below */}
            <div className="mt-4 flex flex-wrap gap-4 justify-between px-2">
                {data.map((item, i) => (
                    <div key={i} className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-400 pl-4">{item.value} Units</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentBreakdown;
