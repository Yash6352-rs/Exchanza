/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import {
  markNotificationAsRead,
  subscribeToAdminNotifications
} from '../services/adminNotificationService'
import { Bell, BellCheck, BellRing, Megaphone, MessageSquare, Search, Settings } from 'lucide-react'
import AdminNotificationCard from '../components/AdminNotificationCard'
import EmptyState from '../../../components/common/EmptyState'
import AdminMessageModal from '../components/AdminMessageModal'
import AppInput from '../../../components/common/AppInput';
import InfoCard from '../../../components/common/InfoCard';

export default function AdminNotificationsPage () {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('incoming');
  const [notifications, setNotfications] = useState<any[]>([]);

  const [directOpen, setDirectOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAdminNotifications(setNotfications)

    return () => unsubscribe()
  }, []);

  const filteredNotifications = useMemo(() => {

    return notifications.filter((notification: any) => {
        const searchText = search.toLowerCase();

        return (
            notification.type?.toLowerCase().includes(searchText) ||
            notification.title?.toLowerCase().includes(searchText) ||
            notification.message?.toLowerCase().includes(searchText)
        );
    })
  }, [notifications, search])

  return (
    <div>
      <div className='space-y-7'>
        {/* TOP BAR */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
          {/* SEARCH */}
          <div className='w-full max-w-2xl'>
            <AppInput
              className='rounded-[100px]'
              icon={<Search size={18} />}
              placeholder='Search notifications or alerts...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* SETTINGS */}
          <button
            onClick={() => navigate('/notifications/notifications-settings')}
            className='w-14 h-14 rounded-2xl flex items-center justify-center transition-all'
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }}
          >
            <Settings size={24} />
          </button>
        </div>

        {/* HEADER */}
        <div>
          <h1
            className='text-4xl font-black tracking-tight'
            style={{ color: theme.text }}
          >
            Notifications
          </h1>

          <p
            className='mt-2 text-base max-w-2xl'
            style={{ color: theme.subText }}
          >
            Manage admin alerts, reports, announcements and communication
            activity.
          </p>
        </div>

        {/* STATS */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <InfoCard
            title='Total Notifications'
            value={notifications.length}
            description='All platform notifications'
            color={theme.primary}
            icon={<Bell size={22} color={theme.primary} />}
          />

          <InfoCard
            title='Read Notifications'
            value={notifications.filter((item: any) => item.isRead).length}
            description='Successfully viewed'
            color={theme.purple}
            icon={<BellCheck size={22} color={theme.purple} />}
          />

          <InfoCard
            title='Unread Notifications'
            value={notifications.filter((item: any) => !item.isRead).length}
            description='Pending notifications'
            color={theme.error}
            icon={<BellRing size={22} color={theme.error} />}
          />
        </div>

        {/* TABS */}
        <div
          className='inline-flex items-center p-1.5 rounded-2xl'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          <button
            onClick={() => setActiveTab('incoming')}
            className='px-6 py-3 rounded-xl text-sm font-semibold transition-all'
            style={{
              backgroundColor:
                activeTab === 'incoming' ? theme.primary : 'transparent',

              color: activeTab === 'incoming' ? 'white' : theme.text
            }}
          >
            Incoming Notifications
          </button>

          <button
            onClick={() => setActiveTab('send')}
            className='px-6 py-3 rounded-xl text-sm font-semibold transition-all'
            style={{
              backgroundColor:
                activeTab === 'send' ? theme.primary : 'transparent',

              color: activeTab === 'send' ? 'white' : theme.text
            }}
          >
            Send Notifications
          </button>
        </div>
      </div>

      {/* Incoming */}
      {activeTab === 'incoming' && (
        <div className='space-y-5 mt-7'>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <AdminNotificationCard
                key={notification.id}
                notification={notification}
                onClick={async () => {
                  if (notification.type === 'system') {
                    navigate('/reports?tab=system')
                  } else if (notification.type === 'user') {
                    navigate('/reports?tab=user')
                  } else if (notification.type === 'post') {
                    navigate('/reports?tab=post')
                  } else {
                    navigate('/reports?tab=trade')
                  }
                  await markNotificationAsRead(notification.id)
                }}
              />
            ))
          ) : (
            <EmptyState
              title='No notifications'
              description='No moderation notifications available'
            />
          )}
        </div>
      )}

      {/* Send */}
      {activeTab === 'send' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-7'>
          {/* Direct Message */}
          <button
            onClick={() => setDirectOpen(true)}
            className='rounded-[32px] p-8 text-left border transition-all hover:scale-[1.01]'
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <div
              className='w-16 h-16 rounded-[24px] flex items-center justify-center mb-5'
              style={{ backgroundColor: theme.primary + '20' }}
            >
              <MessageSquare size={28} color={theme.primary} />
            </div>

            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Send Direct Message
            </h2>

            <p className='mt-3 leading-7' style={{ color: theme.subText }}>
              Send warnings, moderation updates, or custom messages to specific
              users.
            </p>
          </button>

          {/* Announcement */}
          <button
            onClick={() => setAnnouncementOpen(true)}
            className='rounded-[32px] p-8 text-left border transition-all hover:scale-[1.01]'
            style={{ backgroundColor: theme.secondary + '20' }}
          >
            <div
              className='w-16 h-16 rounded-[24px] flex items-center justify-center mb-5'
              style={{ backgroundColor: theme.secondary + '20' }}
            >
              <Megaphone size={28} color={theme.secondary} />
            </div>

            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              Public Announcement
            </h2>

            <p className='mt-3 leading-7' style={{ color: theme.subText }}>
              Broadcast maintenance notices, updates, and announcements to all
              users.
            </p>
          </button>
        </div>
      )}

      {/* Direct Notification */}
      <AdminMessageModal
        open={directOpen}
        onClose={() => setDirectOpen(false)}
        mode='direct'
      />

      {/* Announcement */}
      <AdminMessageModal
        open={announcementOpen}
        onClose={() => setAnnouncementOpen(false)}
        mode='announcement'
      />

      <div className="h-[200px]"/>
    </div>
  )
}
