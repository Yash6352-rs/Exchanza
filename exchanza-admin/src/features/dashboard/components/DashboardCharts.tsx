/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts'
import { useTheme } from '../../../hooks/useTheme'

type Props = {
  stats: any
}

export default function DashboardCharts ({ stats }: Props) {
  const { theme } = useTheme()

  // =========================
  // DATA
  // =========================

  const tradeData = [
    {
      name: 'Pending',
      value: stats?.pendingTrades || 0
    },
    {
      name: 'Active',
      value: stats?.activeTrades || 0
    },
    {
      name: 'Rejected',
      value: stats?.rejectedTrades || 0
    },
    {
      name: 'Completed',
      value: stats?.completedTrades || 0
    }
  ]

  const postData = [
    {
      name: 'Offers',
      value: stats?.offerPosts || 0,
      color: theme.primary
    },
    {
      name: 'Requests',
      value: stats?.requestPosts || 0,
      color: theme.purple
    }
  ]

  const totalPosts = (stats?.offerPosts || 0) + (stats?.requestPosts || 0)

  const growthData = [
    {
      name: 'Users',
      value: stats?.totalUsers || 0
    },
    {
      name: 'Posts',
      value: stats?.totalPosts || 0
    },
    {
      name: 'Trades',
      value: stats?.totalTrades || 0
    }
  ]

  return (
    <div className='space-y-6'>
      {/* ===================== */}
      {/* TOP CHARTS */}
      {/* ===================== */}

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-5'>
        {/* TRADE STATISTICS */}
        <div
          className='xl:col-span-2 rounded-[32px] p-6'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
                Trade Statistics
              </h2>

              <p className='mt-1 text-sm' style={{ color: theme.subText }}>
                Trade activity overview
              </p>
            </div>

            {/* LEGENDS */}
            <div className='flex items-center gap-5 text-xs'>
              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{
                    backgroundColor: theme.primary
                  }}
                />

                <span style={{ color: theme.subText }}>Pending</span>
              </div>

              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{
                    backgroundColor: theme.secondary
                  }}
                />

                <span style={{ color: theme.subText }}>Active</span>
              </div>

              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{
                    backgroundColor: theme.blue
                  }}
                />

                <span style={{ color: theme.subText }}>Rejected</span>
              </div>

              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{
                    backgroundColor: theme.yellow
                  }}
                />

                <span style={{ color: theme.subText }}>Completed</span>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className='h-[340px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={tradeData} barGap={12}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray='3 3'
                  stroke={theme.border}
                />

                <XAxis
                  dataKey='name'
                  tick={{
                    fill: theme.subText,
                    fontSize: 13
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card
                  }}
                />

                <Bar dataKey='value' radius={[18, 18, 0, 0]}>
                  {tradeData.map((_, index) => {
                    const colors = [
                      theme.primary,
                      theme.secondary,
                      theme.blue,
                      theme.yellow
                    ]

                    return <Cell key={index} fill={colors[index]} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* POSTS DISTRIBUTION */}
        <div
          className='rounded-[32px] p-6'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div>
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Posts Distribution
            </h2>

            <p className='mt-1 text-sm' style={{ color: theme.subText }}>
              Offer vs request posts
            </p>
          </div>

          {/* DONUT CHART */}
          <div className='h-[280px] relative mt-3'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={postData}
                  dataKey='value'
                  innerRadius={78}
                  outerRadius={110}
                  stroke='none'
                  paddingAngle={3}
                >
                  {postData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
              <h2 className='text-5xl font-black' style={{ color: theme.text }}>
                {totalPosts}
              </h2>

              <p
                className='text-xs uppercase tracking-[0.25em] mt-2'
                style={{ color: theme.subText }}
              >
                Total Posts
              </p>
            </div>
          </div>

          {/* LEGENDS */}
          <div className='space-y-4 mt-2'>
            {postData.map(item => {
              const percent =
                totalPosts > 0
                  ? ((item.value / totalPosts) * 100).toFixed(0)
                  : 0

              return (
                <div
                  key={item.name}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <span
                      className='w-3 h-3 rounded-full'
                      style={{
                        backgroundColor: item.color
                      }}
                    />

                    <span className='font-medium' style={{ color: theme.text }}>
                      {item.name}
                    </span>
                  </div>

                  <span className='font-bold' style={{ color: theme.text }}>
                    {percent}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* PLATFORM GROWTH */}
      {/* ===================== */}

      <div
        className='rounded-[38px] p-8 overflow-hidden relative'
        style={{
          background: 'linear-gradient(135deg,#0F766E 0%, #134E4A 100%)'
        }}
      >
        {/* BG EFFECT */}
        <div
          className='absolute top-[-80px] right-[-80px] w-[260px] h-[260px] rounded-full'
          style={{
            background: 'rgba(255,255,255,0.05)'
          }}
        />

        <div
          className='absolute bottom-[-100px] left-[-80px] w-[220px] h-[220px] rounded-full'
          style={{
            background: 'rgba(255,255,255,0.04)'
          }}
        />

        <div className='relative z-10'>
          {/* TOP */}
          <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6'>
            <div>
              <h2 className='text-4xl font-black text-white'>
                Platform Growth
              </h2>

              <p className='mt-3 text-teal-100 text-lg max-w-2xl leading-8'>
                Real-time platform statistics showing current ecosystem scale
                and activity growth.
              </p>
            </div>

            {/* FLOATING STATS */}
            <div
              className='flex items-center gap-8 rounded-[30px] px-8 py-5'
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-teal-100'>
                  Users
                </p>

                <h3 className='text-4xl font-black text-white mt-2'>
                  {stats?.totalUsers || 0}
                </h3>
              </div>

              <div className='w-[1px] h-14 bg-white/10' />

              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-teal-100'>
                  Posts
                </p>

                <h3 className='text-4xl font-black text-white mt-2'>
                  {stats?.totalPosts || 0}
                </h3>
              </div>

              <div className='w-[1px] h-14 bg-white/10' />

              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-teal-100'>
                  Trades
                </p>

                <h3 className='text-4xl font-black text-white mt-2'>
                  {stats?.totalTrades || 0}
                </h3>
              </div>
            </div>
          </div>

          {/* MODERN CHART */}
          <div className='h-[340px] mt-10'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={growthData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 0
                }}
              >
                <CartesianGrid
                  strokeDasharray='4 4'
                  stroke='rgba(255,255,255,0.08)'
                  vertical={false}
                />

                <XAxis
                  dataKey='name'
                  tick={{
                    fill: '#CCFBF1',
                    fontSize: 14,
                    fontWeight: 600
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    stroke: 'rgba(255,255,255,0.15)',
                    strokeWidth: 2
                  }}
                  contentStyle={{
                    borderRadius: 20,
                    border: 'none',
                    backgroundColor: '#0F172A',
                    color: 'white',
                    padding: '12px 16px'
                  }}
                />

                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#FFFFFF'
                  strokeWidth={5}
                  dot={{
                    r: 7,
                    strokeWidth: 3,
                    fill: '#0F766E',
                    stroke: '#fff'
                  }}
                  activeDot={{
                    r: 9,
                    fill: '#fff',
                    stroke: '#0F766E',
                    strokeWidth: 4
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BOTTOM STATS */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6'>
            <div
              className='rounded-[24px] px-6 py-5'
              style={{
                background: 'rgba(255,255,255,0.06)'
              }}
            >
              <p className='text-sm text-teal-100'>Total Users</p>

              <h3 className='text-3xl font-black text-white mt-2'>
                {stats?.totalUsers || 0}
              </h3>
            </div>

            <div
              className='rounded-[24px] px-6 py-5'
              style={{
                background: 'rgba(255,255,255,0.06)'
              }}
            >
              <p className='text-sm text-teal-100'>Total Posts</p>

              <h3 className='text-3xl font-black text-white mt-2'>
                {stats?.totalPosts || 0}
              </h3>
            </div>

            <div
              className='rounded-[24px] px-6 py-5'
              style={{
                background: 'rgba(255,255,255,0.06)'
              }}
            >
              <p className='text-sm text-teal-100'>Total Trades</p>

              <h3 className='text-3xl font-black text-white mt-2'>
                {stats?.totalTrades || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
