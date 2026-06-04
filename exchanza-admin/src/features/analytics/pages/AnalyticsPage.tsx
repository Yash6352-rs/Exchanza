/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {BadgeCheck, CheckCircle2, FileText, Flag, Handshake, Search, Tags, Timer, Users, UserX} from 'lucide-react'

import { useTheme } from '../../../hooks/useTheme'
import { useToast } from '../../../hooks/useToast'

import Loader from '../../../components/common/Loader'
import InfoCard from '../../../components/common/InfoCard'

import AnalyticsCharts from '../components/AnalyticsCharts'

import { downloadAnalyticsPDF } from '../services/downloadAnalyticsPDF'
import { getCachedAnalytics } from '../services/analyticsCache'
import { useNavigate } from 'react-router-dom'

export default function AnalyticsPage () {
  const { theme } = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [overview, setOverview] = useState<any>(null)
  const [tradeData, setTradeData] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])
  const [range, setRange] = useState('30d')
  const [avgCompletionTime, setAvgCompletionTime] = useState('0h')
  const [topUsers, setTopUsers] = useState<any[]>([])
  const [topTags, setTopTags] = useState<any[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        const data = await getCachedAnalytics(range)

        setOverview(data.overview)
        setTradeData(data.tradeData)
        setGrowthData(data.growthData)
        setAvgCompletionTime(data.avgCompletionTime)
        setTopUsers(data.topUsers)
        setTopTags(data.topTags)
        
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [range])

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true)

      await downloadAnalyticsPDF({
        overview,
        topUsers,
        topTags,
        avgCompletionTime,
        showToast
      })
    } catch (error) {
      console.log(error)
    } finally {
      setDownloading(false)
    }
  }

  const searchText = search.toLowerCase()
  const showUsers =
    search === '' || 'users blocked users top users'.includes(searchText)
  const showTrades =
    search === '' ||
    'trades completed trades trade analytics'.includes(searchText)
  const showPosts = search === '' || 'posts'.includes(searchText)
  const showTags =
    search === '' || 'tags skills trending skills radar'.includes(searchText)
  const showReports = search === '' || 'reports'.includes(searchText)
  const showCompletion =
    search === '' || 'completion completion rate'.includes(searchText)

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div id='analytics-pdf'>
      <div className='flex flex-col gap-6 mb-8'>
        {/* SEARCH BAR */}
        <div className='relative w-full max-w-2xl'>
          <Search
            size={18}
            className='absolute left-5 top-1/2 -translate-y-1/2 z-10'
            color={theme.subText}
          />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search analytics...'
            className='w-full h-[58px] rounded-[100px] pl-14 pr-5 outline-none transition-all'
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }}
          />
        </div>

        {/* TITLE + BUTTON */}
        <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5'>
          {/* LEFT */}
          <div>
            <h1
              className='text-5xl font-black'
              style={{ color: theme.primary }}
            >
              Analytics
            </h1>
            <p className='mt-3 text-lg' style={{ color: theme.subText }}>
              Platform insights & analytics reports
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* FILTER */}
          <div 
            className="inline-flex flex-wrap items-center p-1.5 rounded-2xl"
            style={{
              backgroundColor: theme.card, border: `1px solid ${theme.border}`
            }}
          >
            {[
              {
                label: '7 Days',
                value: '7d',
              },
              {
                label: '30 Days',
                value: '30d',
              },
              {
                label: '6 Months',
                value: '6m',
              },
              {
                label: '1 Years',
                value: '1y',
              },
            ].map(item => (
              <button
                key={item.value}
                onClick={() => setRange(item.value)}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                style={{
                  backgroundColor: range == item.value ? theme.primary : 'transparent',
                  color: range === item.value ? 'white' : theme.text
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            disabled={downloading}
            onClick={handleDownloadPDF}
            className='h-[54px] px-7 rounded-2xl font-semibold transition-all flex items-center justify-center min-w-[220px]'
            style={{
              backgroundColor: theme.primary,
              color: "white",
              opacity: downloading ? 0.7 : 1
            }}
          >
            {downloading ? 'Downloading...' : 'Download Analytics PDF'}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
        {showCompletion && (
          <InfoCard
            title='Completion Rate'
            description='Completion Rate'
            value={`${overview.completionRate || 0}%`}
            color={theme.primary}
            icon={<BadgeCheck size={24} color={theme.primary} />}
          />
        )}

        {showCompletion && (
          <InfoCard
            title='Avg Completion Time'
            description='Avg Completion Time'
            value={avgCompletionTime || 0}
            color={theme.purple}
            icon={<Timer size={24} color={theme.purple} />}
          />
        )}

        {showReports && (
          <InfoCard
            title='Report Count'
            description='Report Count'
            value={overview.reportsCount || 0}
            color={theme.error}
            icon={<Flag size={24} color={theme.error} />}
          />
        )}

        {showUsers && (
          <InfoCard
            title='Total Users'
            description='All registered Users'
            value={overview.totalUsers || 0}
            color={theme.secondary}
            icon={<Users size={24} color={theme.secondary} />}
          />
        )}

        {showTags && (
          <InfoCard
            title='Total Tags'
            description='Total Active Tags'
            value={overview.totalTags || 0}
            color={theme.brown}
            icon={<Tags size={24} color={theme.brown} />}
          />
        )}

        {showPosts && (
          <InfoCard
            title='Total Posts'
            description='Community exchange posts'
            value={overview.totalPosts || 0}
            color={theme.yellow}
            icon={<FileText size={24} color={theme.yellow} />}
          />
        )}

        {showTrades && (
          <InfoCard
            title='Total Trades'
            description='System Total Trades'
            value={overview.totalTrades || 0}
            color={theme.blue}
            icon={<Handshake size={24} color={theme.blue} />}
          />
        )}

        {showTrades && (
          <InfoCard
            title='Completed Trades'
            description='Completed Trades'
            value={overview.completedTrades || 0}
            color={theme.pink}
            icon={<CheckCircle2 size={24} color={theme.pink} />}
          />
        )}

        {showUsers && (
          <InfoCard
            title='Blocked Users'
            description='Blocked Users'
            value={overview.blockedUsers || 0}
            color={theme.darkGray}
            icon={<UserX size={24} color={theme.darkGray} />}
          />
        )}
      </div>

      {/* CHARTS */}
      <AnalyticsCharts
        tradeData={tradeData}
        growthData={growthData}
        tagData={topTags}
        overview={overview}
        search={search}
        isExport={document.body.classList.contains('pdf-export')}
      />

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mt-8'>
        <div
          className='rounded-[28px] border p-6'
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold'>Top Users</h2>
            <button
              onClick={() => navigate('/users')}
              className='text-xs font-bold uppercase tracking-[0.15em]'
              style={{ color: theme.subText }}
            >
              View All
            </button>
          </div>

          <div className='space-y-4'>
            {topUsers?.map((user, index) => (
              <div key={user.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full overflow-hidden'>
                    <img
                      src={
                        user.profileImage ||
                        `https://ui-avatars.com/api/?name=${user.name}`
                      }
                      alt='user'
                      className='w-full h-full object-cover'
                    />
                  </div>

                  <div>
                    <h3 className='font-semibold' style={{ color: theme.text }}>
                      #{index + 1} {user.name}
                    </h3>
                    <p className='text-sm' style={{ color: theme.subText }}>
                      {user.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div
                  className='font-bold text-lg'
                  style={{ color: theme.primary }}
                >
                  ⭐ {user.rating || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className='rounded-[28px] border p-6'
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold'>Trending Skills</h2>
            <p
              className='text-xs font-bold uppercase tracking-[0.15em]'
              style={{ color: theme.subText }}
            >
              Current Demand
            </p>
          </div>

          {/* SKILLS */}
          <div className='space-y-6'>
            {topTags?.slice(0, 4).map((tag: any, index: number) => {
              const percentage = Math.min(
                Math.max(tag.usageCount * 10, 15),
                100
              )

              const colors = [
                theme.primary,
                theme.secondary,
                theme.brown,
                theme.darkGray,
                theme.blue
              ]

              return (
                <div key={tag.id}>
                  {/* TOP */}
                  <div className='flex items-center justify-between mb-3'>
                    <h3
                      className='font-semibold text-sm'
                      style={{ color: theme.text }}
                    >
                      {tag.name}
                    </h3>

                    <p
                      className='text-sm font-bold'
                      style={{ color: colors[index % colors.length] }}
                    >
                      {percentage}%
                    </p>
                  </div>

                  {/* BAR */}
                  <div
                    className='w-full h-[8px] rounded-full overflow-hidden'
                    style={{ backgroundColor: theme.highlight }}
                  >
                    <div
                      className='h-full rounded-full transition-all duration-500'
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length]
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
