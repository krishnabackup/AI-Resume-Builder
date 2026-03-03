import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sep', score: 65 },
  { name: 'Oct', score: 68 },
  { name: 'Nov', score: 74 },
  { name: 'Dec', score: 72 },
  { name: 'Jan', score: 85 },
  { name: 'Feb', score: 92 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-indigo-600 font-bold text-lg">
          {payload[0].value}% <span className="text-xs text-gray-400 font-normal">ATS Score</span>
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance Over Time</h3>
          <p className="text-sm text-gray-500">Average ATS score progression</p>
        </div>
        <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>
      
      <div className="flex-grow w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
