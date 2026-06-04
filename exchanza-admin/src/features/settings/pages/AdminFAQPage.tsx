/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme'
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

const ADMIN_FAQS = [
  {
    q: 'How do I manage reported users?',
    a: 'Open the Reports section from dashboard to review and take actions on reports.'
  },
  {
    q: 'How can I block or unblock users?',
    a: 'Go to Users Management and toggle the user account status.'
  },
  {
    q: 'How do analytics work?',
    a: 'Analytics are generated from platform activity including users, trades, tags, and reports.'
  },
  {
    q: 'How can I export analytics reports?',
    a: 'Open Analytics page and click Download Analytics PDF.'
  },
  {
    q: 'What does completion rate mean?',
    a: 'It shows the percentage of successfully completed trades on the platform.'
  },
  {
    q: 'How is average completion time calculated?',
    a: 'It measures how long users take to complete accepted trades.'
  },
  {
    q: 'Can I search settings quickly?',
    a: 'Yes, use the settings search bar to instantly find settings pages.'
  },
  {
    q: 'How do I update admin profile?',
    a: 'Go to Settings → Edit Profile to update admin information.'
  },
  {
    q: 'How do I change my password?',
    a: 'Open Settings → Change Password and enter your current and new password.'
  },
  {
    q: 'What happens when a user is blocked?',
    a: 'Blocked users lose access to platform features depending on admin restrictions.'
  }
]

const FAQItem = ({ item, index, expanded, setExpanded, theme }: any) => {
  const isOpen = expanded === index

  return (
    <div
      className='rounded-3xl border overflow-hidden transition-all'
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border
      }}
    >
      <button
        onClick={() => setExpanded(isOpen ? null : index)}
        className='w-full px-6 py-5 flex items-center justify-center gap-4 text-left'
      >
        <div
          className='w-10 h-10 rounded-2xl flex items-center justify-center'
          style={{
            backgroundColor: `${theme.primary}15`
          }}
        >
          <HelpCircle size={18} color={theme.primary} />
        </div>

        <div className='flex-1'>
          <h3
            className='font-semibold text-lg leading-7'
            style={{ color: theme.text }}
          >
            {item.q}
          </h3>
        </div>

        {isOpen ? (
          <ChevronUp size={20} color={theme.subText} />
        ) : (
          <ChevronDown size={20} color={theme.subText} />
        )}
      </button>

      {isOpen && (
        <div
          className='px-6 pb-6 pt-2'
          style={{ borderTop: `1px solid ${theme.border}` }}
        >
          <p className='leading-8 mt-2 -mb-1' style={{ color: theme.subText }}>
            {item.a}
          </p>
        </div>
      )}
    </div>
  )
}

export default function AdminFAQPage () {
    
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "FAQs"
          }
        ]}
      />
      {/* HEADER */}
      <div className='flex items-center gap-4 mb-8'>
        <div>
          <h1 className='text-4xl font-bold' style={{ color: theme.primary }}>
            Admin FAQs
          </h1>

          <p className='mt-2' style={{ color: theme.subText }}>
            Common admin questions about analytics, users, reports, and
            dashboard management.
          </p>
        </div>
      </div>

      {/* HERO */}
      <div
        className='rounded-[32px] border p-8 mb-10'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <h2 className='text-3xl font-bold' style={{ color: theme.text }}>
          Need Help Managing Exchanza?
        </h2>

        <p
          className='mt-4 leading-8 max-w-3xl'
          style={{ color: theme.subText }}
        >
          Find quick answers related to analytics, trade management, blocked
          users, admin settings, reports, and dashboard features.
        </p>
      </div>

      {/* FAQS */}
      <div className='space-y-5'>
        {ADMIN_FAQS.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            index={index}
            expanded={expanded}
            setExpanded={setExpanded}
            theme={theme}
          />
        ))}
      </div>

      {/* SUPPORT CARD */}
      <div
        className='rounded-[32px] p-8 mt-10'
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.deepTeal})`
        }}
      >
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div>
            <h2 className='text-3xl font-bold text-white'>Still Need Help?</h2>

            <p className='text-white/90 mt-3 leading-7 max-w-2xl'>
              Our Exchanza support team can help resolve admin issues, dashboard
              problems, analytics questions, and account concerns.
            </p>
          </div>

          <button
            onClick={() => navigate('/settings/contact')}
            className='px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all hover:scale-105'
            style={{
              backgroundColor: 'white',
              color: theme.primary
            }}
          >
            <Mail size={18} />
            Contact Developers
          </button>
        </div>
      </div>
    </div>
  );
}
