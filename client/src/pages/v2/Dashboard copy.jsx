import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Total Posts", value: "128", icon: "✍️", change: "+4 this week" },
  {
    label: "Total Views",
    value: "94.2K",
    icon: "👁️",
    change: "+12% vs last month",
  },
  { label: "Followers", value: "3,810", icon: "👥", change: "+230 this month" },
  { label: "Comments", value: "1,540", icon: "💬", change: "+88 this week" },
];

const viewsData = [
  { name: "Jan", views: 3200 },
  { name: "Feb", views: 4800 },
  { name: "Mar", views: 4100 },
  { name: "Apr", views: 6200 },
  { name: "May", views: 5300 },
  { name: "Jun", views: 7800 },
  { name: "Jul", views: 9100 },
];

const trafficData = [
  { name: "Mon", visitors: 420 },
  { name: "Tue", visitors: 610 },
  { name: "Wed", visitors: 530 },
  { name: "Thu", visitors: 780 },
  { name: "Fri", visitors: 920 },
  { name: "Sat", visitors: 560 },
  { name: "Sun", visitors: 340 },
];

const tagData = [
  { name: "Technology", value: 38, color: "#3ecdc4" },
  { name: "Lifestyle", value: 22, color: "#117a7a" },
  { name: "Travel", value: 18, color: "#0fa8a0" },
  { name: "Health", value: 14, color: "#5ee8e0" },
  { name: "Finance", value: 8, color: "#0c3f3f" },
];

const recentPosts = [
  {
    title: "The Future of AI in Everyday Life",
    status: "Published",
    views: 4320,
    date: "Mar 20, 2026",
  },
  {
    title: "10 Tips for Mindful Morning Routines",
    status: "Published",
    views: 2810,
    date: "Mar 18, 2026",
  },
  {
    title: "Why Solo Travel Changes You Forever",
    status: "Draft",
    views: 0,
    date: "Mar 17, 2026",
  },
  {
    title: "Understanding Compound Interest at 25",
    status: "Published",
    views: 1950,
    date: "Mar 15, 2026",
  },
  {
    title: "Building a Second Brain with Noted",
    status: "Scheduled",
    views: 0,
    date: "Mar 25, 2026",
  },
];

const recentComments = [
  {
    author: "Priya Sharma",
    post: "Future of AI in Everyday Life",
    comment: "This was incredibly insightful!",
    time: "2h ago",
    avatar: "PS",
  },
  {
    author: "James Liu",
    post: "10 Tips for Mindful Mornings",
    comment: "I've been doing tip #3 for a year now 🙌",
    time: "5h ago",
    avatar: "JL",
  },
  {
    author: "Amara Osei",
    post: "Why Solo Travel Changes You",
    comment: "Absolutely agree with every point here.",
    time: "Yesterday",
    avatar: "AO",
  },
  {
    author: "Lucas Ferreira",
    post: "Compound Interest at 25",
    comment: "Can you write a part 2 on index funds?",
    time: "Yesterday",
    avatar: "LF",
  },
];

const drafts = [
  {
    title: "My 30-Day Digital Detox Experiment",
    updated: "2 hours ago",
    wordCount: "1,200 words",
  },
  {
    title: "Why Solo Travel Changes You Forever",
    updated: "Yesterday",
    wordCount: "980 words",
  },
  {
    title: "The Minimalist's Guide to Productivity",
    updated: "3 days ago",
    wordCount: "640 words",
  },
];

const scheduled = [
  {
    title: "Building a Second Brain with Noted",
    date: "Mar 25, 2026",
    time: "9:00 AM",
  },
  { title: "Summer Reading List 2026", date: "Apr 1, 2026", time: "8:00 AM" },
];

const notifications = [
  { text: "Priya Sharma started following you", time: "1h ago", icon: "👥" },
  { text: "New comment on 'Future of AI'", time: "2h ago", icon: "💬" },
  { text: "Your post got 50 new likes", time: "4h ago", icon: "❤️" },
  { text: "James Liu mentioned you in a post", time: "6h ago", icon: "📣" },
  { text: "You crossed 3,800 followers!", time: "Yesterday", icon: "🎉" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Draft: "bg-amber-50  text-amber-600  border border-amber-200",
    Scheduled: "bg-cyan-50   text-cyan-700   border border-cyan-200",
  };
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const SectionCard = ({ title, icon, children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white border border-gray-100 shadow-sm p-5 ${className}`}
  >
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
      style={{ color: "#117a7a" }}
    >
      <span>{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c3f3f] rounded-xl px-3 py-2 text-xs shadow-xl text-white">
        <p className="font-semibold">{label}</p>
        <p style={{ color: "#3ecdc4" }}>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navItems = ["Dashboard", "Posts", "Comments", "Analytics", "Settings"];

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-800"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <div className="flex">
        {/* ── Sidebar ── */}
        <aside
          className="hidden lg:flex flex-col w-60 min-h-screen px-4 py-8 border-r border-white/10"
          style={{
            background:
              "linear-gradient(135deg, #0c3f3f 0%, #117a7a 50%, #3ecdc4 100%)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 px-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg,#3ecdc4,#117a7a)" }}
            >
              ✍
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Noted
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeNav === item
                    ? "bg-white/15 text-white shadow-inner border border-white/10"
                    : "text-teal-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-teal-200 hover:bg-white/10 hover:text-white transition-all">
              Log Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-screen-xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gray-400">Sunday, March 22, 2026</p>
              <h1 className="text-2xl font-bold" style={{ color: "#0c3f3f" }}>
                Good morning, Soumya 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#3ecdc4] transition-colors">
                🔔
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "#3ecdc4" }}
                />
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#117a7a,#3ecdc4)",
                }}
              >
                + New Post
              </button>
            </div>
          </header>

          {/* ── 1. Stats Strip ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 h-1 w-full rounded-t-2xl"
                  style={{
                    background: "linear-gradient(90deg,#117a7a,#3ecdc4)",
                  }}
                />
                <div className="flex items-center justify-between mb-2 mt-1">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold" style={{ color: "#0c3f3f" }}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* ── Row 2: Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SectionCard title="Content Performance" icon="📈">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={viewsData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(62,205,196,0.06)" }}
                  />
                  <Bar
                    dataKey="views"
                    radius={[6, 6, 0, 0]}
                    fill="url(#barGrad)"
                  />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3ecdc4" />
                      <stop offset="100%" stopColor="#117a7a" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Audience & Traffic" icon="📊">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#117a7a" />
                      <stop offset="100%" stopColor="#3ecdc4" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="url(#lineGrad)"
                    strokeWidth={3}
                    dot={{
                      fill: "#3ecdc4",
                      stroke: "#fff",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          {/* ── Row 3: Recent Posts + Tags ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SectionCard
              title="Recent Posts"
              icon="📝"
              className="lg:col-span-2"
            >
              <div className="space-y-1">
                {recentPosts.map((post, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-2.5 px-2 border-b border-gray-50 last:border-0 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {post.views > 0 && (
                        <span className="text-xs text-gray-400">
                          {post.views.toLocaleString()} views
                        </span>
                      )}
                      <StatusBadge status={post.status} />
                      <button
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "#117a7a" }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Tags & Categories" icon="🏷️">
              <div className="flex justify-center mb-3">
                <PieChart width={150} height={150}>
                  <Pie
                    data={tagData}
                    cx={70}
                    cy={70}
                    innerRadius={45}
                    outerRadius={68}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {tagData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2">
                {tagData.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: tag.color }}
                      />
                      <span className="text-gray-600">{tag.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: "#117a7a" }}>
                      {tag.value}%
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Row 4: Comments + Drafts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SectionCard title="Recent Comments" icon="💬">
              <div className="space-y-4">
                {recentComments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg,#117a7a,#3ecdc4)",
                      }}
                    >
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {c.author}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {c.time}
                        </span>
                      </div>
                      <p
                        className="text-xs truncate"
                        style={{ color: "#117a7a" }}
                      >
                        {c.post}
                      </p>
                      <p className="text-xs text-gray-500 italic mt-0.5">
                        "{c.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all font-medium">
                  Approve All
                </button>
                <button className="flex-1 py-1.5 text-xs rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-all font-medium">
                  Clear Spam
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Drafts & Scheduled" icon="🔖">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Drafts
              </p>
              <div className="space-y-2 mb-5">
                {drafts.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 hover:border-[#3ecdc4] transition-all cursor-pointer group"
                    style={{ "": "" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(62,205,196,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "")
                    }
                  >
                    <div>
                      <p className="text-sm text-gray-700 font-medium truncate max-w-[200px] group-hover:text-[#117a7a] transition-colors">
                        {d.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {d.wordCount} · {d.updated}
                      </p>
                    </div>
                    <span
                      className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#3ecdc4" }}
                    >
                      →
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Scheduled
              </p>
              <div className="space-y-2">
                {scheduled.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                    style={{
                      background: "rgba(62,205,196,0.06)",
                      borderColor: "rgba(62,205,196,0.25)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                      style={{ background: "rgba(62,205,196,0.15)" }}
                    >
                      🗓
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 font-medium truncate max-w-[180px]">
                        {s.title}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#117a7a" }}
                      >
                        {s.date} · {s.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Row 5: Activity + Quick Actions ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard
              title="Activity Feed"
              icon="🔔"
              className="lg:col-span-2"
            >
              <div className="space-y-1">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 px-2 border-b border-gray-50 last:border-0 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: "rgba(62,205,196,0.1)" }}
                    >
                      {n.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 text-sm transition-colors shrink-0">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Quick Actions" icon="⚡">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Post", icon: "✍️", primary: true },
                  { label: "View Blog", icon: "🌐", primary: false },
                  { label: "Comments", icon: "💬", primary: false },
                  { label: "Analytics", icon: "📊", primary: false },
                  { label: "Schedule Post", icon: "🗓️", primary: false },
                  { label: "Settings", icon: "⚙️", primary: false },
                ].map((action, i) => (
                  <button
                    key={i}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 text-xs font-semibold transition-all active:scale-95 ${
                      action.primary
                        ? "col-span-2 text-white shadow-md hover:opacity-90"
                        : "text-gray-600 border border-gray-100 bg-gray-50"
                    }`}
                    style={
                      action.primary
                        ? {
                            background:
                              "linear-gradient(135deg,#117a7a,#3ecdc4)",
                          }
                        : {}
                    }
                    onMouseEnter={(e) => {
                      if (!action.primary) {
                        e.currentTarget.style.borderColor = "#3ecdc4";
                        e.currentTarget.style.color = "#117a7a";
                        e.currentTarget.style.background =
                          "rgba(62,205,196,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!action.primary) {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.color = "";
                        e.currentTarget.style.background = "";
                      }
                    }}
                  >
                    <span className="text-xl">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          <p className="mt-8 text-center text-xs text-gray-300">
            © 2026 Noted · All rights reserved
          </p>
        </main>
      </div>
    </div>
  );
}
