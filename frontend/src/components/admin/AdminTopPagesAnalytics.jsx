import { useEffect, useMemo, useState } from "react";
import { FileText, BarChart3 } from "lucide-react";
import { fetchTopPages } from "../../services/analyticsService";

export default function AdminTopPagesAnalytics() {
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopPages = async () => {
      try {
        const data = await fetchTopPages();
        setTopPages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch top viewed pages:", error);
        setTopPages([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopPages();
  }, []);

  const totalViews = useMemo(() => {
    return topPages.reduce((sum, item) => sum + (item.views || 0), 0);
  }, [topPages]);

  const maxViews = useMemo(() => {
    return topPages.length > 0 ? Math.max(...topPages.map((item) => item.views || 0)) : 1;
  }, [topPages]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Most Viewed Pages</h2>
        <div className="bg-indigo-50 p-2 rounded-full">
          <BarChart3 className="text-indigo-600" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      ) : topPages.length > 0 ? (
        <div className="space-y-4">
          {topPages.map((item, index) => {
            const percentage = totalViews > 0 ? Math.round((item.views / totalViews) * 100) : 0;
            const barWidth = maxViews > 0 ? Math.max(8, Math.round((item.views / maxViews) * 100)) : 8;

            return (
              <div key={`${item.page}-${index}`} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-semibold text-slate-500 w-5">#{index + 1}</span>
                    <FileText className="text-slate-400 shrink-0" size={14} />
                    <span className="text-sm font-medium text-slate-700 truncate">{item.page}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {item.views} views • {item.uniqueUsers || 0} unique users
                    </div>
                    <div className="text-xs text-slate-500">{percentage}%</div>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-slate-400 py-8">No page view data yet</div>
      )}
    </div>
  );
}
