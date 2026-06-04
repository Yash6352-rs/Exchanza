/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight, FileText, HelpCircle, Info, LifeBuoy, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../hooks/useTheme';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

const HelpItem = ({
  icon: Icon, iconColor, backgroundColor, title, desc, onClick, theme
}: any) => (
    
  <button
    onClick={onClick}
    className='w-full rounded-[30px] border p-5 flex items-center justify-between transition-all hover:scale-[1.01]'
    style={{
      backgroundColor: theme.card,
      borderColor: theme.border
    }}
  >
    <div className='flex items-center gap-5 flex-1 text-left'>
      <div
        className='w-16 h-16 rounded-2xl flex items-center justify-center'
        style={{
          backgroundColor
        }}
      >
        <Icon size={28} color={iconColor} />
      </div>

      <div className='flex-1'>
        <h3 className='text-lg font-bold' style={{ color: theme.text }}>
          {title}
        </h3>

        <p className='mt-2 leading-7' style={{ color: theme.subText }}>
          {desc}
        </p>
      </div>
    </div>

    <ChevronRight size={20} color={theme.subText} />
  </button>
)

export default function AdminHelpSupportPage () {
  const navigate = useNavigate()

  const { theme } = useTheme()

  return (
    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "Help & Support"
          }
        ]}
      />
      {/* HEADER */}
      <div className='flex items-center gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold' style={{ color: theme.primary }}>
            Help & Support
          </h1>

          <p className='mt-2' style={{ color: theme.subText }}>
            Get help related to admin dashboard, analytics, reports, users, and
            system management.
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
        <div className='flex flex-col items-center text-center'>
          <div
            className='w-28 h-28 rounded-full flex items-center justify-center mb-6'
            style={{
              backgroundColor: `${theme.primary}15`
            }}
          >
            <LifeBuoy size={60} color={theme.primary} />
          </div>

          <h2 className='text-3xl font-bold' style={{ color: theme.text }}>
            Need Help Managing Exchanza?
          </h2>

          <p
            className='max-w-3xl mt-4 leading-8'
            style={{ color: theme.subText }}
          >
            Search our admin knowledge base or contact support for analytics
            issues, reports, dashboard assistance, and platform management.
          </p>
        </div>
      </div>

      {/* HELP ITEMS */}
      <div className='space-y-5'>
        <HelpItem
          icon={ShieldCheck}
          iconColor={theme.purple}
          backgroundColor={`${theme.purple}20`}
          title='Account Status'
          desc='Review admin account status and platform access permissions.'
          onClick={() => navigate('/settings/account-status')}
          theme={theme}
        />

        <HelpItem
          icon={TriangleAlert}
          iconColor={theme.error}
          backgroundColor={`${theme.error}20`}
          title='Report a Problem'
          desc='Report technical issues, analytics bugs, or dashboard problems.'
          onClick={() => navigate('/settings/report-problem')}
          theme={theme}
        />

        <HelpItem
          icon={HelpCircle}
          iconColor={theme.success}
          backgroundColor={`${theme.success}20`}
          title='FAQs'
          desc='Browse frequently asked admin questions and answers.'
          onClick={() => navigate('/settings/faqs')}
          theme={theme}
        />

        <HelpItem
          icon={Mail}
          iconColor={theme.brown}
          backgroundColor={`${theme.brown}20`}
          title='Contact Developer'
          desc='Reach out directly to the Exchanza developer team.'
          onClick={() => navigate('/settings/contact')}
          theme={theme}
        />

        <HelpItem
          icon={FileText}
          iconColor={theme.blue}
          backgroundColor={`${theme.blue}20`}
          title='Privacy & Safety'
          desc='Learn how Exchanza protects platform and user data.'
          onClick={() => navigate('/settings/privacy-policy')}
          theme={theme}
        />

        <HelpItem
          icon={Info}
          iconColor={theme.secondary}
          backgroundColor={`${theme.secondary}20`}
          title='About Exchanza'
          desc='Learn more about Exchanza platform and admin ecosystem.'
          onClick={() => navigate('/settings/about-exchanza')}
          theme={theme}
        />
      </div>

      <div className='h-10' />
    </div>
  );
}
