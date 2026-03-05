import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  Crown,
  Eye,
  Film,
  Lock,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsAdmin, useListVideos } from "../hooks/useQueries";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n: bigint | number): string {
  const num = typeof n === "bigint" ? Number(n) : n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

function formatDate(timestamp: bigint): string {
  // timestamp is in nanoseconds
  const ms = Number(timestamp / 1_000_000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  "data-ocid"?: string;
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  "data-ocid": ocid,
}: StatCardProps) {
  return (
    <Card
      data-ocid={ocid}
      className="relative overflow-hidden border-border/60 bg-card/80 backdrop-blur"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            )}
          </div>
          <div className="ml-4 p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── access denied ───────────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
      data-ocid="dashboard.error_state"
    >
      <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <Lock className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        This dashboard is private. Only the site owner can access this area.
      </p>
      <Button asChild variant="outline">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to site
        </Link>
      </Button>
    </div>
  );
}

// ─── loading skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-8" data-ocid="dashboard.loading_state">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <Skeleton key={k} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

// ─── custom tooltip for recharts ──────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        {formatNumber(payload[0].value)} views
      </p>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function OwnerDashboardPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: videos, isLoading: videosLoading } = useListVideos();

  const isLoading = adminLoading || videosLoading;

  // Derived analytics
  const analytics = useMemo(() => {
    if (!videos) return null;

    const totalVideos = videos.length;
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0n);
    const avgViews = totalVideos > 0 ? Number(totalViews) / totalVideos : 0;

    const sortedByViews = [...videos].sort(
      (a, b) => Number(b.viewCount) - Number(a.viewCount),
    );
    const top10 = sortedByViews.slice(0, 10);
    const top5ChartData = sortedByViews.slice(0, 5).map((v) => ({
      name: truncate(v.title, 14),
      fullTitle: v.title,
      views: Number(v.viewCount),
    }));

    return { totalVideos, totalViews, avgViews, top10, top5ChartData };
  }, [videos]);

  if (isLoading) return <DashboardSkeleton />;
  if (!isAdmin) return <AccessDenied />;

  return (
    <div data-ocid="dashboard.page" className="py-4 space-y-10">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/15 text-primary">
              <Crown className="h-5 w-5" />
            </div>
            <Badge
              variant="secondary"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Owner Access
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Private analytics for Florida Dave Network
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to site
          </Link>
        </Button>
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          data-ocid="dashboard.total_videos.card"
          icon={<Film className="h-5 w-5" />}
          label="Total Videos"
          value={String(analytics?.totalVideos ?? 0)}
          subtext="Uploaded clips"
        />
        <StatCard
          data-ocid="dashboard.total_views.card"
          icon={<Eye className="h-5 w-5" />}
          label="Total Views"
          value={formatNumber(analytics?.totalViews ?? 0n)}
          subtext="Across all videos"
        />
        <StatCard
          data-ocid="dashboard.total_followers.card"
          icon={<Users className="h-5 w-5" />}
          label="Followers"
          value="—"
          subtext="Login as owner to fetch"
        />
        <StatCard
          data-ocid="dashboard.avg_views.card"
          icon={<TrendingUp className="h-5 w-5" />}
          label="Avg Views / Video"
          value={formatNumber(Math.round(analytics?.avgViews ?? 0))}
          subtext="Per published clip"
        />
      </motion.div>

      {/* ── Bar Chart – Top 5 by Views ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Top 5 Videos by Views</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Performance snapshot — per-day analytics require richer
              time-series data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analytics?.top5ChartData.length ? (
              <div
                data-ocid="dashboard.chart_point"
                className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3"
              >
                <BarChart2 className="h-10 w-10 opacity-30" />
                <p className="text-sm">
                  No videos uploaded yet — chart will appear once content is
                  available.
                </p>
              </div>
            ) : (
              <div data-ocid="dashboard.chart_point" className="mt-2">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={analytics.top5ChartData}
                    margin={{ top: 4, right: 8, left: -8, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => formatNumber(v)}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "oklch(var(--muted) / 0.4)" }}
                    />
                    <Bar
                      dataKey="views"
                      fill="oklch(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={56}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Top Videos Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Top Videos</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Ranked by view count — top 10
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!analytics?.top10.length ? (
              <div
                data-ocid="dashboard.top_videos.table"
                className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3 px-6"
              >
                <Film className="h-10 w-10 opacity-30" />
                <p className="text-sm">No videos uploaded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="dashboard.top_videos.table">
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="w-10 text-center text-xs">
                        #
                      </TableHead>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs text-right">
                        Views
                      </TableHead>
                      <TableHead className="text-xs text-right hidden sm:table-cell">
                        Uploaded
                      </TableHead>
                      <TableHead className="text-xs text-right hidden md:table-cell">
                        Duration
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.top10.map((video, idx) => (
                      <TableRow
                        key={video.id}
                        data-ocid={
                          idx < 3
                            ? `dashboard.top_videos.row.${idx + 1}`
                            : undefined
                        }
                        className="border-border/30 hover:bg-muted/30"
                      >
                        <TableCell className="text-center">
                          {idx === 0 ? (
                            <span className="text-yellow-500 font-bold text-sm">
                              🥇
                            </span>
                          ) : idx === 1 ? (
                            <span className="text-slate-400 font-bold text-sm">
                              🥈
                            </span>
                          ) : idx === 2 ? (
                            <span className="text-amber-600 font-bold text-sm">
                              🥉
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm tabular-nums">
                              {idx + 1}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail.getDirectURL()}
                                alt={video.title}
                                className="w-10 h-7 object-cover rounded shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-7 bg-muted rounded shrink-0 flex items-center justify-center">
                                <Film className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-sm leading-tight truncate max-w-[160px] sm:max-w-[260px]">
                                {video.title}
                              </p>
                              {video.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[160px] sm:max-w-[260px]">
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums text-sm">
                          {formatNumber(video.viewCount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs hidden sm:table-cell">
                          {formatDate(video.uploadTimestamp)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs hidden md:table-cell">
                          {Number(video.duration)}s
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Performance Note ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="border-border/40 bg-muted/30">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Per-day analytics</strong>{" "}
              require time-series data stored per view event. The current
              backend records total view counts per video. To enable day-by-day
              charts (last 7 / 30 days), the backend would need a{" "}
              <code className="bg-muted px-1 rounded">
                recordView(videoId, timestamp)
              </code>{" "}
              call that logs each view with a timestamp.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
