import { useNavigate } from 'react-router-dom'
import { Mail, HelpCircle, LifeBuoy, ChevronRight, ShieldAlert} from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme'
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function ContactPage () {

  const navigate = useNavigate()
  const { theme } = useTheme()

  const openLink = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "Contact Developer"
          }
        ]}
      />
      {/* HEADER */}
      <div className='flex items-center gap-4 mb-8'>
        <div>
          <h1 className='text-4xl font-bold' style={{ color: theme.primary }}>
            Contact Developer
          </h1>

          <p className='mt-2' style={{ color: theme.subText }}>
            Admin assistance, technical support, analytics help, and system
            inquiries.
          </p>
        </div>
      </div>

      {/* HERO CARD */}
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
            <Mail size={42} color={theme.primary} />
          </div>

          <h2 className='text-3xl font-bold' style={{ color: theme.text }}>
            Need Developer Support?
          </h2>

          <p
            className='max-w-2xl mt-4 leading-8'
            style={{ color: theme.subText }}
          >
            Our Exchanza support team is ready to help with dashboard issues,
            analytics reports, user management, and technical concerns.
          </p>

          <button className="text-base underline mt-6" style={{ color: theme.purple }}
            onClick={() => openLink('mailto:yashpanchal1422004@gmail.com')}
          >
            yashpanchal1422004@gmail.com
          </button>

          <button
            onClick={() => openLink('mailto:yashpanchal1422004@gmail.com')}
            className='mt-5 px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105'
            style={{
              backgroundColor: theme.primary,
              color: 'white'
            }}
          >
            Send Email
          </button>

          <p className='text-sm mt-6' style={{ color: theme.subText }}>
            Average response time within 24 hours
          </p>
        </div>
      </div>

      {/* SUPPORT CARDS */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* FAQ */}
        <button
          onClick={() => navigate('/settings/faqs')}
          className='rounded-[30px] border p-6 text-left transition-all hover:scale-[1.01]'
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border
          }}
        >
          <div className='flex items-start gap-5'>
            <div
              className='w-16 h-16 rounded-2xl flex items-center justify-center'
              style={{
                backgroundColor: `${theme.primary}15`
              }}
            >
              <HelpCircle size={28} color={theme.primary} />
            </div>

            <div className='flex-1'>
              <h3 className='text-2xl font-bold' style={{ color: theme.text }}>
                FAQs
              </h3>

              <p className='mt-2 leading-7' style={{ color: theme.subText }}>
                Browse frequently asked admin questions about analytics,
                reports, users, and settings.
              </p>
            </div>

            <ChevronRight size={22} color={theme.subText} />
          </div>
        </button>

        {/* HELP */}
        <button
          onClick={() => navigate('/settings/help-support')}
          className='rounded-[30px] border p-6 text-left transition-all hover:scale-[1.01]'
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border
          }}
        >
          <div className='flex items-start gap-5'>
            <div
              className='w-16 h-16 rounded-2xl flex items-center justify-center'
              style={{
                backgroundColor: `${theme.secondary}15`
              }}
            >
              <LifeBuoy size={28} color={theme.secondary} />
            </div>

            <div className='flex-1'>
              <h3 className='text-2xl font-bold' style={{ color: theme.text }}>
                Help & Support
              </h3>

              <p className='mt-2 leading-7' style={{ color: theme.subText }}>
                Get detailed support and guidance related to admin dashboard
                usage.
              </p>
            </div>

            <ChevronRight size={22} color={theme.subText} />
          </div>
        </button>
      </div>

      {/* SUPPORT TYPES */}
      <div
        className='rounded-[32px] border p-8 mt-10'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <h2 className='text-3xl font-bold mb-6' style={{ color: theme.text }}>
          Support Categories
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {[
            'Technical Issues',
            'Analytics Problems',
            'User Management',
            'Content Moderation',
            'Security Concerns',
            'System Reports'
          ].map((item, index) => (
            <div
              key={index}
              className='rounded-2xl p-5'
              style={{
                backgroundColor: `${theme.primary}10`
              }}
            >
              <div className='flex items-center gap-3'>
                <ShieldAlert size={18} color={theme.primary} />

                <p className='font-semibold' style={{ color: theme.text }}>
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIALS */}
      <div className='mt-12 text-center'>
        <p
          className='text-sm font-semibold tracking-wide'
          style={{ color: theme.subText }}
        >
          CONNECT WITH US
        </p>

        <div className='flex items-center justify-center gap-8 mt-6'>
          <button onClick={() => openLink("mailto:yashpanchal1422004@gamil.com")}>
            <Mail size={36} color={theme.primary} />
          </button>

          <button onClick={() => openLink("https://github.com/Yash6352-rs")}>
            <FaGithub size={36} color={theme.primary} />
          </button>

          <button onClick={() => openLink("https://in.linkedin.com/in/yash6352-rs")}>
            <FaLinkedin size={36} color={theme.primary} />
          </button>
        </div>
      </div>
    </div>
  );
}
