import {Area,AreaChart,Bar,CartesianGrid,Cell,ComposedChart,Funnel,FunnelChart,LabelList,Line,Pie,PieChart,
    PolarAngleAxis,PolarGrid,PolarRadiusAxis,Radar,RadarChart,RadialBar,RadialBarChart,ResponsiveContainer,Scatter,
    ScatterChart,Tooltip,XAxis,YAxis,ZAxis} from 'recharts'
import { useTheme } from '../../../hooks/useTheme'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AnalyticsCharts ({
  tradeData, growthData, tagData, overview, isExport = false
}: any) {
  const { theme } = useTheme();

  const cardHeight = isExport ? "430px" : "470px";
  const largeCardHeight = isExport ? "620px" : "630px";
  //const mediumCardHeight = isExport ? "300px" : "450px";
  
  // DATA
  const completionData = [
    {
      name: 'Completed',
      value: tradeData.find((t: any) => t.name === 'Completed')?.value || 0,
      fill: theme.success
    }
  ]

  const activityData = growthData.map((item: any) => ({
    day: item.day,
    users: item.users,
    posts: item.posts,
    trades: item.trades
  }))

  const scatterData = growthData.map((item: any) => ({
    users: item.users,
    trades: item.trades,
    posts: item.posts
  }))

  const funnelData = [
    {
      value: overview?.totalPosts || 0,
      name: 'Posts'
    },
    {
      value: overview?.totalTrades || 0,
      name: 'Trades'
    },
    {
      value: overview?.completedTrades || 0,
      name: 'Completed'
    }
  ]

  const heatmapData = growthData.map((item: any) => ({
    day: item.day,
    activity: item.users + item.posts + item.trades
  }))

  return (
    <div className='space-y-6 mt-8'>
      
      {/* ROW 1 */}
      <div className={`${isExport
          ? "grid grid-cols-2 gap-5"
          : "grid grid-cols-1 xl:grid-cols-2 gap-5"}`}>
        {/* TRADE ANALYTICS */}
        <div
          id='trade-chart'
          className='rounded-[38px] p-8 overflow-hidden relative'
          style={{
            background: 'linear-gradient(135deg,#0F172A 0%, #1E293B 100%)'
          }}
        >
          {/* BG EFFECT */}
          <div
            className='absolute top-[-70px] right-[-70px] w-[220px] h-[220px] rounded-full'
            style={{
              background: 'rgba(255,255,255,0.04)'
            }}
          />

          <div
            className='absolute bottom-[-80px] left-[-50px] w-[180px] h-[180px] rounded-full'
            style={{
              background: 'rgba(255,255,255,0.03)'
            }}
          />

          <div className='relative z-10'>
            {/* HEADER */}
            <div className='flex items-start justify-between'>
              <div>
                <h2 className='text-3xl font-black text-white'>
                  Trade Analytics
                </h2>

                <p className='text-slate-300 text-sm mt-3 leading-7 max-w-sm'>
                  Visual breakdown of platform trade statuses
                </p>
              </div>

              {/* TOTAL */}
              <div
                className='rounded-[28px] px-6 py-5'
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <p className='text-xs uppercase tracking-[0.16em] text-slate-400'>
                  Total Trades
                </p>

                <h3 className='text-4xl font-black text-white mt-2'>
                  {overview?.totalTrades || 0}
                </h3>
              </div>
            </div>

            {/* CHART */}
            <div className='h-[340px] overflow-hidden'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tradeData}
                    dataKey='value'
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={5}
                    stroke='none'
                    isAnimationActive={!isExport}
                  >
                    {tradeData.map((_: any, index: number) => {
                      const colors = [
                        '#14B8A6',
                        '#8B5CF6',
                        '#3B82F6',
                        '#FACC15'
                      ]

                      return <Cell key={index} fill={colors[index]} />
                    })}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 20,
                      border: 'none',
                      backgroundColor: '#0F172A',
                      color: 'white',
                      padding: '10px 14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* CENTER */}
              <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-24'>
                <h2 className='text-5xl font-black text-white'>
                  {overview?.totalTrades || 0}
                </h2>

                <p className='text-xs uppercase tracking-[0.24em] text-slate-400 mt-3'>
                  Total Trades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PLATFORM GROWTH */}
        <div
          id='growth-chart'
          className='rounded-[34px] p-7 overflow-hidden relative'
          style={{
            background: 'linear-gradient(135deg,#0F766E 0%, #134E4A 100%)'
          }}
        >
          {/* BG EFFECT */}
          <div
            className='absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full'
            style={{
              background: 'rgba(255,255,255,0.05)'
            }}
          />

          <div className='relative z-10'>
            <h2 className='text-3xl font-black text-white'>Platform Growth</h2>

            <p className='mt-3 text-teal-100 text-sm leading-7'>
              Displays real platform growth based on analytics snapshots.
            </p>

            <div className='h-[300px] mt-12 overflow-hidden'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray='4 4'
                    stroke='rgba(255,255,255,0.08)'
                  />

                  <XAxis
                    dataKey='day'
                    tick={{
                      fill: '#CCFBF1',
                      fontSize: 12
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 20,
                      border: 'none',
                      backgroundColor: '#0F172A',
                      color: 'white'
                    }}
                  />

                  <Area
                    type='monotone'
                    dataKey='users'
                    stroke='#FFFFFF'
                    fill='rgba(255,255,255,0.18)'
                    strokeWidth={4}
                    isAnimationActive={!isExport}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* ROW 2 */}
      <div
        id='weekly-chart'
        className='rounded-[34px] p-7'
        style={{
          height: isExport ? "460px" : "450px",
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`
        }}
      >
        {/* HEADER */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Weekly Growth
            </h2>

            <p className='text-sm mt-2' style={{ color: theme.subText }}>
              Weekly users, posts and trades overview
            </p>
          </div>

          {/* MINI LEGENDS */}
          <div className='flex items-center gap-5 text-xs'>
            <div className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: theme.primary }}
              />

              <span style={{ color: theme.subText }}>Users</span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: theme.secondary }}
              />

              <span style={{ color: theme.subText }}>Posts</span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: theme.blue }}
              />

              <span style={{ color: theme.subText }}>Trades</span>
            </div>
          </div>
        </div>

        <div className='h-[260px] overflow-hidden'>

          {/* CHART */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id='usersFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor={theme.primary}
                    stopOpacity={0.35}
                  />

                  <stop offset='95%' stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>

                <linearGradient id='postsFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor={theme.secondary}
                    stopOpacity={0.35}
                  />

                  <stop
                    offset='95%'
                    stopColor={theme.secondary}
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient id='tradesFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={theme.blue} stopOpacity={0.35} />

                  <stop offset='95%' stopColor={theme.blue} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray='3 3'
                stroke={theme.border}
              />

              <XAxis
                dataKey='week'
                tick={{
                  fill: theme.subText,
                  fontSize: 12
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

              <Area
                type='monotone'
                dataKey='users'
                stroke={theme.primary}
                fill='url(#usersFill)'
                strokeWidth={3}
                isAnimationActive={!isExport}
              />

              <Area
                type='monotone'
                dataKey='posts'
                stroke={theme.secondary}
                fill='url(#postsFill)'
                strokeWidth={3}
                isAnimationActive={!isExport}
              />

              <Area
                type='monotone'
                dataKey='trades'
                stroke={theme.blue}
                fill='url(#tradesFill)'
                strokeWidth={3}
                isAnimationActive={!isExport}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 3 */}
      <div className={`${isExport
          ? "grid grid-cols-2 gap-5"
          : "grid grid-cols-1 xl:grid-cols-2 gap-5"}`}>

        {/* COMPLETION RATE */}
        <div
          id='completion-chart'
          className='rounded-[32px] p-6'
          style={{
            height: isExport ? "380px" : "400px",
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-5'>
            <div>
              <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
                Trade Completion
              </h2>

              <p className='text-sm mt-1' style={{ color: theme.subText }}>
                Successfully completed trades
              </p>
            </div>

            <div
              className='px-4 py-2 rounded-2xl'
              style={{
                backgroundColor: `${theme.success}15`
              }}
            >
              <span
                className='text-lg font-bold'
                style={{ color: theme.success }}
              >
                {overview?.completionRate || 0}%
              </span>
            </div>
          </div>

          {/* CHART */}
          <div className='relative h-[280px] overflow-hidden'>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius='68%'
                outerRadius='100%'
                barSize={18}
                data={completionData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  background={{
                    fill: theme.highlight
                  }}
                  cornerRadius={30}
                  dataKey='value'
                  fill={theme.success}
                  isAnimationActive={!isExport}
                />

                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>

            {/* CENTER */}
            <div className='absolute inset-0 flex flex-col items-center justify-center mt-8'>
              <h2 className='text-5xl font-black' style={{ color: theme.text }}>
                {overview?.completionRate || 0}%
              </h2>

              <p className='text-sm mt-2' style={{ color: theme.subText }}>
                Completion Rate
              </p>
            </div>
          </div>
        </div>

        {/* PLATFORM ACTIVITY */}
        <div
          id='activity-chart'
          className='rounded-[32px] p-6'
          style={{
            height: isExport ? "380px" : "400px",
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-5'>
            <div>
              <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
                Platform Activity
              </h2>

              <p className='text-sm mt-1' style={{ color: theme.subText }}>
                Posts and trades overview
              </p>
            </div>

            {/* LEGENDS */}
            <div className='flex items-center gap-4 text-xs'>
              <div className='flex items-center gap-2'>
                <span
                  className='w-2.5 h-2.5 rounded-full'
                  style={{
                    backgroundColor: theme.secondary
                  }}
                />

                <span style={{ color: theme.subText }}>Posts</span>
              </div>

              <div className='flex items-center gap-2'>
                <span
                  className='w-2.5 h-2.5 rounded-full'
                  style={{
                    backgroundColor: theme.primary
                  }}
                />

                <span style={{ color: theme.subText }}>Trades</span>
              </div>
            </div>
          </div>

          <div className='h-[240px] overflow-hidden'>
            {/* CHART */}
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={activityData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray='3 3'
                  stroke={theme.border}
                />

                <XAxis
                  dataKey='day'
                  tick={{
                    fill: theme.subText,
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card
                  }}
                />

                <Bar
                  dataKey='posts'
                  fill={theme.secondary}
                  radius={[14, 14, 0, 0]}
                  isAnimationActive={!isExport}
                />

                <Line
                  type='monotone'
                  dataKey='trades'
                  stroke={theme.primary}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: theme.primary
                  }}
                  isAnimationActive={!isExport}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 4 */}
      <div
        id='scatter-chart'
        className='rounded-[34px] p-7 overflow-hidden relative'
        style={{
          height: largeCardHeight,
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`
        }}
      >
        {/* HEADER */}
        <div className='relative z-10 flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              User vs Post vs Trade Activity
            </h2>

            <p className='text-sm mt-2' style={{ color: theme.subText }}>
              Relationship between users, posts and trades
            </p>
          </div>

          {/* LEGENDS */}
          <div className='flex items-center gap-5 text-xs'>
            <div className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{
                  backgroundColor: theme.primary
                }}
              />

              <span style={{ color: theme.subText }}>Activity</span>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className='relative z-10 h-[380px] overflow-hidden'>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10
              }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke={theme.border}
              />

              <XAxis
                type='number'
                dataKey='users'
                name='Users'
                tick={{
                  fill: theme.subText,
                  fontSize: 12
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type='number'
                dataKey='trades'
                name='Trades'
                tick={{
                  fill: theme.subText,
                  fontSize: 12
                }}
                axisLine={false}
                tickLine={false}
              />

              <ZAxis type='number' dataKey='posts' range={[80, 420]} />

              <Tooltip
                cursor={{
                  strokeDasharray: '4 4',
                  stroke: theme.primary
                }}
                contentStyle={{
                  borderRadius: 18,
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.card
                }}
              />

              <Scatter
                data={scatterData}
                fill={theme.primary}
                fillOpacity={0.75}
                isAnimationActive={!isExport}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM STATS */}
        <div className='grid grid-cols-3 gap-4 mt-5 relative z-10'>
          <div
            className='rounded-[22px] px-5 py-4'
            style={{
              backgroundColor: theme.highlight
            }}
          >
            <p
              className='text-xs uppercase tracking-[0.15em]'
              style={{ color: theme.subText }}
            >
              Users
            </p>

            <h3
              className='text-2xl font-black mt-2'
              style={{ color: theme.text }}
            >
              {overview?.totalUsers || 0}
            </h3>
          </div>

          <div
            className='rounded-[22px] px-5 py-4'
            style={{
              backgroundColor: theme.highlight
            }}
          >
            <p
              className='text-xs uppercase tracking-[0.15em]'
              style={{ color: theme.subText }}
            >
              Posts
            </p>

            <h3
              className='text-2xl font-black mt-2'
              style={{ color: theme.text }}
            >
              {overview?.totalPosts || 0}
            </h3>
          </div>

          <div
            className='rounded-[22px] px-5 py-4'
            style={{
              backgroundColor: theme.highlight
            }}
          >
            <p
              className='text-xs uppercase tracking-[0.15em]'
              style={{ color: theme.subText }}
            >
              Trades
            </p>

            <h3
              className='text-2xl font-black mt-2'
              style={{ color: theme.text }}
            >
              {overview?.totalTrades || 0}
            </h3>
          </div>
        </div>
      </div>


      {/* ROW 5 */}

      <div className={`${isExport
          ? "grid grid-cols-2 gap-5"
          : "grid grid-cols-1 xl:grid-cols-2 gap-5"}`}>
        {/* RADAR */}
        <div
          id='radar-chart'
          className='rounded-[34px] p-7 overflow-hidden relative'
          style={{
            height: cardHeight,
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div className='relative z-10 flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
                Skills & Tags Radar
              </h2>

              <p className='text-sm mt-2' style={{ color: theme.subText }}>
                Most popular skills and platform tags
              </p>
            </div>

            {/* BADGE */}
            <div
              className='px-4 py-2 rounded-2xl'
              style={{
                backgroundColor: `${theme.primary}15`
              }}
            >
              <span
                className='text-sm font-semibold'
                style={{ color: theme.primary }}
              >
                {tagData?.length || 0} Tags
              </span>
            </div>
          </div>

          {/* CHART */}
          <div className='relative z-10 h-[330px] overflow-hidden'>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={tagData}>
                <PolarGrid stroke={theme.border} />

                <PolarAngleAxis
                  dataKey='name'
                  tick={{
                    fill: theme.subText,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />

                <PolarRadiusAxis
                  tick={{
                    fill: theme.subText,
                    fontSize: 10
                  }}
                />

                <Radar
                  dataKey='usageCount'
                  stroke={theme.primary}
                  fill={theme.primary}
                  fillOpacity={0.35}
                  strokeWidth={3}
                  isAnimationActive={!isExport}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FUNNEL */}
        <div
          id='funnel-chart'
          className='rounded-[34px] p-7 overflow-hidden relative'
          style={{
            height: cardHeight,
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* HEADER */}
          <div className='relative z-10 flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
                Conversion Funnel
              </h2>

              <p className='text-sm mt-2' style={{ color: theme.subText }}>
                Post to trade conversion flow
              </p>
            </div>

            {/* BADGE */}
            <div
              className='px-4 py-2 rounded-2xl'
              style={{
                backgroundColor: `${theme.success}15`
              }}
            >
              <span
                className='text-sm font-semibold'
                style={{ color: theme.success }}
              >
                {overview?.completedTrades || 0} Completed
              </span>
            </div>
          </div>

          {/* CHART */}
          <div className='relative z-10 flex items-center justify-center h-[310px]'>
            <div className="h-[300px] overflow-hidden">
                <FunnelChart width={520} height={300}>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.card
                    }}
                  />

                  <Funnel dataKey='value' data={funnelData} isAnimationActive={!isExport}>
                    {/* POSTS */}
                    <Cell fill={theme.primary} />

                    {/* TRADES */}
                    <Cell fill={theme.secondary} />

                    {/* COMPLETED */}
                    <Cell fill={theme.success} />

                    <LabelList
                      position='right'
                      fill={theme.text}
                      stroke='none'
                      dataKey='name'
                    />
                  </Funnel>
                </FunnelChart>
            </div>
          </div>

          {/* LEGENDS */}
          <div className='relative z-10 flex items-center justify-center gap-6 mt-2'>
            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.primary
                }}
              />

              <span
                className='text-sm font-medium'
                style={{ color: theme.subText }}
              >
                Posts
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.secondary
                }}
              />

              <span
                className='text-sm font-medium'
                style={{ color: theme.subText }}
              >
                Trades
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.success
                }}
              />

              <span
                className='text-sm font-medium'
                style={{ color: theme.subText }}
              >
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6 */}
      {/* HEATMAP */}
      <div
        id='heatmap-chart'
        className='rounded-[34px] p-7 overflow-hidden relative'
        style={{
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`
        }}
      >
        {/* BG EFFECT */}
        <div
          className='absolute top-[-70px] right-[-70px] w-[220px] h-[220px] rounded-full blur-3xl'
          style={{
            background: `${theme.primary}10`
          }}
        />

        {/* HEADER */}
        <div className='relative z-10 flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Activity Heatmap
            </h2>

            <p className='text-sm mt-2' style={{ color: theme.subText }}>
              Daily activity intensity across platform
            </p>
          </div>

          {/* LEGENDS */}
          <div className='flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.highlight
                }}
              />

              <span style={{ color: theme.subText }}>Low</span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.secondary
                }}
              />

              <span style={{ color: theme.subText }}>Medium</span>
            </div>

            <div className='flex items-center gap-2'>
              <span
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: theme.primary
                }}
              />

              <span style={{ color: theme.subText }}>High</span>
            </div>
          </div>
        </div>

        {/* HEATMAP GRID */}
        <div 
          className='relative z-10 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-8'
        >
          {heatmapData.map((item: any, index: number) => {
            const isHigh = item.activity > 200
            const isMedium = item.activity > 100

            return (
              <div
                key={index}
                className='rounded-[24px] p-5 transition-all hover:scale-[1.03]'
                style={{
                  background: isHigh
                    ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                    : isMedium
                    ? `${theme.secondary}20`
                    : theme.blue + '20',

                  border: `1px solid ${
                    isHigh
                      ? 'transparent'
                      : isMedium
                      ? `${theme.secondary}30`
                      : theme.border
                  }`,

                  color: isHigh || isMedium ? 'white' : theme.text
                }}
              >
                {/* DATE */}
                <p
                  className='text-xs font-semibold uppercase tracking-[0.12em]'
                  style={{
                    opacity: 0.8
                  }}
                >
                  {new Date(item.day).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                {/* VALUE */}
                <h3 className='text-3xl font-black mt-4'>{item.activity}</h3>

                {/* STATUS */}
                <div className='mt-4 flex items-center justify-between'>
                  <span
                    className='text-xs font-semibold'
                    style={{
                      opacity: 0.85
                    }}
                  >
                    {isHigh
                      ? 'High Activity'
                      : isMedium
                      ? 'Moderate'
                      : 'Low Activity'}
                  </span>

                  <div
                    className='w-2.5 h-2.5 rounded-full'
                    style={{
                      backgroundColor: isHigh
                        ? '#fff'
                        : isMedium
                        ? theme.secondary
                        : theme.subText
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
