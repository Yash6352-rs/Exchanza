/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import {
  markReportResolved,
  subscribeToReports
} from '../services/reportService'
import Loader from '../../../components/common/Loader'
import EmptyState from '../../../components/common/EmptyState'
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flag,
  Search
} from 'lucide-react'
import AdminMessageModal from '../../notification/components/AdminMessageModal'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../services/firebase/firebase'
import { useToast } from '../../../hooks/useToast'
import AppDialog from '../../../components/common/AppDialog'
import ExpandedReportCard from '../components/ExpandedReportCard'
import InfoCard from '../../../components/common/InfoCard'
import AppInput from '../../../components/common/AppInput'

export default function ReportsPage () {
  const { theme } = useTheme()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'system'
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reports, setReports] = useState<any[]>([])

  const [messageOpen, setMessageOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedReportId, setSelectedReportId] = useState('')

  const [resolveOpen, setResolveOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = subscribeToReports(data => {
      setReports(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter((report: any) => {
      const matchesTab = report.type === activeTab

      const matchesSearch =
        report.title?.toLowerCase().includes(search.toLowerCase()) ||
        report.description?.toLowerCase().includes(search.toLowerCase()) ||
        report.reporterName?.toLowerCase().includes(search.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [reports, activeTab, search])

  const handleViewContent = (report: any) => {
    if (report.type === 'user') {
      navigate(`/users/${report.targetId}`)
    } else if (report.type === 'post') {
      navigate(`/posts/${report.targetId}`)
    } else if (report.type === 'trade') {
      navigate(`/trades/${report.targetId}`)
    }
  }

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div>
      {/* SEARCH */}
      <div className='space-y-7'>
        <div className='max-w-2xl'>
          <AppInput
            className='rounded-[100px]'
            icon={<Search size={18} />}
            placeholder='Search reports, users or titles...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* HEADER */}
        <div className='flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
          <h1
            className='text-4xl font-black tracking-tight'
            style={{ color: theme.text }}
          >
            Reports Center
          </h1>

          <p
            className='mt-2 text-base max-w-2xl'
            style={{ color: theme.subText }}
          >
            Manage platform moderation reports and community violations.
          </p>
        </div>

        {/* STATS */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 b-5'>

            <InfoCard
                title='Total Reports'
                value={reports.length}
                description='All submitted reports'
                color={theme.primary}
                icon={<Flag size={22} color={theme.primary} />}
            />

            <InfoCard
                title='Resolved Reports'
                value={
                    reports.filter(
                    (report: any) => report.status === 'resolved'
                    ).length
                }
                description='Successfully resolved'
                color={theme.purple}
                icon={<CheckCircle size={22} color={theme.purple} />}
            />

            <InfoCard
                title='Remaining Reports'
                value={
                    reports.filter(
                    (report: any) => report.status !== 'resolved'
                    ).length
                }
                description='Pending moderation'
                color={theme.error}
                icon={<AlertTriangle size={22} color={theme.error} />}
            />
        </div>

        {/* TABS */}
        <div
          className='inline-flex flex-wrap items-center p-1.5 rounded-2xl'
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          {[
            {
              key: 'system',
              label: 'System Reports'
            },
            {
              key: 'user',
              label: 'Reported Users'
            },
            {
              key: 'post',
              label: 'Reported Posts'
            },
            {
              key: 'trade',
              label: 'Trade Reports'
            }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className='px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap'
              style={{
                backgroundColor:
                  activeTab === tab.key ? theme.primary : 'transparent',

                color: activeTab === tab.key ? 'white' : theme.text
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS */}
      {filteredReports.length === 0 ? (
        <EmptyState
          title='No reports found'
          description='No reports available in this section'
        />
      ) : (
        <div className='space-y-6 mt-8'>
          {filteredReports.map((report: any) => {
            const expanded = expandedId === report.id

            return (
              <div
                key={report.id}
                className='rounded-[32px] border p-7 shadow-sm'
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border
                }}
              >
                {/* TOP */}
                <div className='flex items-start justify-between'>
                  {/* USER */}
                  <div className='flex items-center gap-4'>
                    <img
                      src={report.reporterAvatar || ''}
                      className='w-14 h-14 rounded-full object-cover'
                    />
                    <div>
                      <h2
                        className='text-xl font-semibold'
                        style={{ color: theme.text }}
                      >
                        {report.reporterName}
                      </h2>

                      <p className='mt-1 capitalize' style={{ color: theme.subText }}>
                        {report.title}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className='flex items-center gap-4'>
                    <div
                      className='px-4 py-2 rounded-full text-sm font-semibold'
                      style={{
                        backgroundColor:
                          report.status === 'resolved'
                            ? theme.success + '20'
                            : theme.error + '20',
                        color:
                          report.status === 'resolved'
                            ? theme.subText
                            : theme.error
                      }}
                    >
                      {report.status === 'resolved' ? 'Resolved' : 'Open'}
                    </div>

                    <button
                      onClick={() => setExpandedId(expanded ? null : report.id)}
                    >
                      {expanded ? (
                        <ChevronUp size={20} color={theme.primary} />
                      ) : (
                        <ChevronDown size={20} color={theme.primary} />
                      )}
                    </button>
                  </div>
                </div>

                {/* EXPANDED */}
                {expanded && (
                  <ExpandedReportCard
                    report={report}
                    handleViewContent={handleViewContent}
                    onSendMessage={() => {
                      setSelectedUserId(report.userId)
                      setSelectedReportId(report.id)
                      setMessageOpen(true)
                    }}
                    onResolve={() => {
                      setSelectedReport(report)
                      setResolveOpen(true)
                    }}
                    onViewProfile={() => {
                      navigate(`/users/${report.reporterId}`)
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      <AdminMessageModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        mode='direct'
        defaultUserIds={selectedUserId ? [selectedUserId] : []}
        reportId={selectedReportId}
      />

      <AppDialog
        visible={resolveOpen}
        title='Mark Report Resolved'
        description='Are you sure you want to mark this report as resolved?'
        icon={<CheckCircle2 size={28} color={theme.primary} />}
        iconColor={theme.primary}
        confirmText='Mark Resolved'
        onCancel={() => {
          setResolveOpen(false)
          setSelectedReport(null)
        }}
        onConfirm={async () => {
          if (!selectedReport) return

          try {
            await markReportResolved(selectedReport.id)

            await addDoc(collection(db, 'notifications'), {
              userId: selectedReport.userId,
              type: 'admin-report',
              title: 'Report Resolved',
              message: 'Your report has been reviewed and resolved.',
              reportId: selectedReport.id || null,
              isRead: false,
              createdAt: serverTimestamp()
            })

            setResolveOpen(false)
            setSelectedReport(null)
            showToast('Marked resolved successfully', 'success')
          } catch (error) {
            console.log(error)
            showToast('Failed to resolve report', 'error')
          }
        }}
      />
    </div>
  )
}
