/* eslint-disable @typescript-eslint/no-explicit-any */
import {ArrowRight, Bell, Clock3, FileText, Flag, Handshake, Search, Tags, Users} from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useState } from 'react'
import Loader from '../../../components/common/Loader'
import DashboardCharts from '../components/DashboardCharts'

import InfoCard from '../../../components/common/InfoCard'
import { useNavigate } from 'react-router-dom'
import { getCachedDashboardData } from '../services/dashboardCache' 
import { useAuth } from '../../../context/AuthContext';

export default function DashboardPage () {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [recentReports, setRecentReports] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)

        const data = await getCachedDashboardData()

        setStats(data.stats)
        setRecentReports(data.reports)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, []);

  const searchableItems = [
    {
      title: 'Total Users',
      path: '/users'
    },
    {
      title: 'Manage Users',
      path: '/users'
    },
    {
      title: 'Total Tags',
      path: '/tags'
    },
    {
      title: 'Manage Tags',
      path: '/tags'
    },
    {
      title: 'Total Posts',
      path: '/moderation'
    },
    {
      title: 'Total Trades',
      path: '/moderation'
    },
    {
      title: 'Content Moderation',
      path: '/moderation'
    },
    {
      title: 'Reports Count',
      path: '/reports'
    },
    {
      title: 'Open Analytics',
      path: '/analytics'
    },
    {
      title: 'Open Notifications',
      path: '/notifications'
    },
    {
      title: 'Open Admin Profile',
      path: '/profile'
    },
    {
      title: 'Open Admin Settings',
      path: '/settings'
    },
  ];

  const filteredResults = searchableItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className='space-y-7'>
      {/* TOP BAR */}
      <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5'>
        {/* SEARCH */}
        <div className='relative w-full max-w-2xl'>

          <Search
            size={18}
            className='absolute left-5 top-1/2 -translate-y-1/2 z-10'
            color={theme.subText}
          />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search dashboard...'
            className='w-full h-[56px] rounded-[100px] pl-14 pr-5 outline-none'
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }}
          />

          {/* RESULTS */}
          {search && (
            <div
              className='absolute top-[65px] left-0 w-full rounded-[26px] overflow-hidden z-50'
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
              }}
            >
              {filteredResults.length > 0 ? (
                filteredResults.slice(0, 6).map((item, index) => (

                  <button key={index}
                    onClick={() => {
                      navigate(item.path)
                      setSearch('')
                    }}
                    className='w-full px-5 py-4 flex items-center justify-between transition-all hover:bg-black/5'
                  >
                    <span  className='font-medium' style={{ color: theme.text }}>
                      {item.title}
                    </span>

                    <ArrowRight size={18}color={theme.subText}/>
                  </button>
                ))
              ) : (
                <div className='px-5 py-5 text-sm' style={{ color: theme.subText }}>
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-3 ml-auto'>
          {/* Notification */}
          <button
            onClick={() => navigate('/notifications')}
            className='relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all'
          >
            <Bell size={20} color={theme.text} />
          </button>

          {/* Admin Profile */}
          <div
            className='flex items-center gap-3 px-3 py-2 rounded-2xl'
            onClick={() => navigate('/profile')}
          >
            <div className='text-right'>
              <p
                className='text-sm font-semibold'
                style={{ color: theme.text }}
              >
                Admin User
              </p>
              <p className='text-xs uppercase' style={{ color: theme.subText }}>
                Super Admin
              </p>
            </div>

            <img
              src={user?.profileImage}
              alt='admin'
              className='w-11 h-11 rounded-full object-cover'
            />
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div>
        <h1 className='text-5xl font-black' style={{ color: theme.primary }}>
          Dashboard
        </h1>

        <p className='mt-3 text-lg' style={{ color: theme.subText }}>
          Welcome back, Admin 👋 Here’s your platform overview today.
        </p>
      </div>

      {/* STATS */}
      <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-5'>
        <InfoCard
          title='Total Users'
          value={stats.totalUsers || 0}
          description='All registered users'
          color={theme.primary}
          icon={<Users size={22} color={theme.primary} />}
        />

        <InfoCard
          title='Total Posts'
          value={stats.totalPosts || 0}
          description='Exchange posts created'
          color={theme.purple}
          icon={<FileText size={22} color={theme.purple} />}
        />

        <InfoCard
          title='Total Tags'
          value={stats.totalTags || 0}
          description='Platform tag collection'
          color={theme.yellow}
          icon={<Tags size={22} color={theme.yellow} />}
        />

        <InfoCard
          title='Total Trades'
          value={stats.totalTrades || 0}
          description='All platform trades'
          color={theme.brown}
          icon={<Handshake size={22} color={theme.brown} />}
        />

        <InfoCard
          title='Reports Count'
          value={stats.reportsCount || 0}
          description='Moderation reports'
          color={theme.error}
          icon={<Flag size={22} color={theme.error} />}
        />
      </div>

      <DashboardCharts stats={stats} />

      {/* REPORTS + QUICK ACTIONS */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-5'>
        {/* REPORTS */}
        <div
          className='xl:col-span-2 rounded-[32px] overflow-hidden'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          <div
            className='px-7 py-5 flex items-center justify-between'
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Recent Reports
            </h2>

            <button
              onClick={() => navigate('/reports')}
              className='text-base font-semibold'
              style={{ color: theme.primary }}
            >
              View All Reports
            </button>
          </div>

          <div className='divide-y' style={{ borderColor: theme.border }}>
            {recentReports.slice(0, 3).map(report => (
              <div
                key={report.id}
                className='px-7 py-5 flex items-start justify-between'
              >
                <div>
                  <h3
                    className='font-bold text-lg'
                    style={{ color: theme.text }}
                  >
                    {report.title}
                  </h3>

                  <p
                    className='mt-1.5 text-base'
                    style={{ color: theme.subText }}
                  >
                    {report.description}
                  </p>
                </div>

                <div className='flex items-center gap-3'>
                  <span
                    className='px-4 py-2 rounded-full text-sm font-bold'
                    style={{
                      backgroundColor: theme.highlight,
                      color: theme.primary
                    }}
                  >
                    {report.status}
                  </span>
                  <Clock3 size={18} color={theme.subText} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          className='rounded-[32px] p-6'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 className='text-2xl font-bold mb-6' style={{ color: theme.text }}>
            System Quick Actions
          </h2>

          <div className='space-y-4'>
            <button
              onClick={() => navigate('/users')}
              className='w-full h-[74px] rounded-[24px] flex items-center justify-between px-6 transition-all hover:scale-[1.01]'
              style={{ backgroundColor: theme.primary, color: 'white' }}
            >
              <span className='font-bold text-lg'>Manage Users</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate('/moderation')}
              className='w-full h-[74px] rounded-[24px] flex items-center justify-between px-6 transition-all hover:scale-[1.01]'
              style={{ backgroundColor: theme.purple, color: 'white' }}
            >
              <span className='font-bold text-lg'>Content Moderation</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate('analytics')}
              className='w-full h-[74px] rounded-[24px] flex items-center justify-between px-6 transition-all hover:scale-[1.01]'
              style={{
                backgroundColor: theme.darkGray + '20',
                color: theme.text
              }}
            >
              <span className='font-bold text-lg'>Open Analytics</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
