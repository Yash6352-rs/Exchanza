import { useNavigate } from 'react-router-dom'
import exchanza_logo from '../../../assets/images/exchanza_logo.png'
import { useTheme } from '../../../hooks/useTheme'
import {BadgeCheck, MessageCircle, Network, PlusCircle, RefreshCcw, Search, Sparkles, Users} from 'lucide-react'
import { lightColors } from '../../../components/constants/colors'
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function AboutExchanzaPage () {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const features = [
    {
      icon: Search,
      title: 'Discover Skills',
      desc: 'Explore posts using smart tags and search.',
      color: theme.purple,
      bg: theme.lightPurple
    },
    {
      icon: PlusCircle,
      title: 'Create Offers & Requests',
      desc: 'Post what you offer or what you need.',
      color: theme.error,
      bg: theme.error + '15'
    },
    {
      icon: RefreshCcw,
      title: 'Mutual Growth',
      desc: 'Exchange skills and learn collaboratively.',
      color: theme.success,
      bg: theme.success + '15'
    },
    {
      icon: Network,
      title: 'Build Networks',
      desc: 'Connect with talented people globally.',
      color: theme.brown,
      bg: theme.lightBrown
    },
    {
      icon: MessageCircle,
      title: 'Real-Time Chat',
      desc: 'Collaborate instantly after trade acceptance.',
      color: theme.blue,
      bg: theme.blue + '15'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Ratings',
      desc: 'Build trust through verified reviews.',
      color: theme.secondary,
      bg: theme.secondary + '15'
    }
  ]

  return (
    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "About Exchanza"
          }
        ]}
      />

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
            About Exchanza
          </h1>

          <p className="mt-2" style={{ color: theme.subText }}>
            Your Skills Your Currency.
          </p>
        </div>
      </div>

      {/* HERO */}
      <div
        className='rounded-[36px] p-10 border mb-8'
        style={{
          backgroundColor: theme.card || lightColors.card,
          borderColor: theme.border || lightColors.border
        }}
      >
        <div className='flex flex-col xl:flex-row items-center justify-between gap-10'>
          {/* LEFT */}
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <img
                src={exchanza_logo}
                alt='logo'
                className='w-[160px] h-[110px] -ml-8'
              />

              <div>
                <h2
                  className='text-5xl font-bold'
                  style={{
                    color: theme.primary
                  }}
                >
                  EXCHANZA
                </h2>

                <p
                  className='mt-2 text-lg'
                  style={{
                    color: theme.subText
                  }}
                >
                  Version 1.0.0
                </p>
              </div>
            </div>

            <div className='mt-8'>
              <h3
                className='text-3xl font-bold mb-4'
                style={{
                  color: theme.darkerTeal
                }}
              >
                Our Mission
              </h3>

              <p
                className='text-lg leading-9'
                style={{
                  color: theme.subText
                }}
              >
                Exchanza is building a modern skill exchange ecosystem where
                people collaborate through real value instead of money alone. We
                empower learning, growth, collaboration, and networking through
                trusted skill-based exchanges.
              </p>
            </div>

            {/* COMMUNITY */}
            <div className='flex items-center gap-4 mt-8'>
              <div
                className='w-16 h-16 rounded-full flex items-center justify-center'
                style={{
                  backgroundColor: theme.highlight
                }}
              >
                <Users size={30} color={theme.primary} />
              </div>

              <div>
                <h4
                  className='font-bold text-lg'
                  style={{
                    color: theme.text
                  }}
                >
                  Trusted Community
                </h4>

                <p style={{ color: theme.subText }}>
                  Verified users creating meaningful exchanges.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className='rounded-[32px] p-8 w-full xl:w-[350px]'
            style={{
              backgroundColor: theme.primary
            }}
          >
            <div className='flex items-center gap-3 mb-5'>
              <Sparkles size={26} color='white' />
              <h3 className='text-2xl text-white font-bold'>
                Community Network
              </h3>
            </div>

            <p className='text-white leading-8 text-lg'>
              Connecting minds, one exchange at a time.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className='mb-8'>
        <h2
          className='text-3xl font-bold mb-8'
          style={{
            color: theme.text
          }}
        >
          What You Can Do
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            
          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className='rounded-[30px] p-7 border transition-all hover:-translate-y-1'
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border
                }}
              >
                <div
                  className='w-16 h-16 rounded-2xl flex items-center justify-center mb-5'
                  style={{
                    backgroundColor: item.bg
                  }}
                >
                  <Icon size={28} color={item.color} />
                </div>

                <h3
                  className='text-xl font-bold mb-3'
                  style={{
                    color: theme.text
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className='leading-7'
                  style={{
                    color: theme.subText
                  }}
                >
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* LINKS */}
      <div
        className='rounded-[32px] p-8 border mb-8'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <h2
          className='text-2xl font-bold mb-6'
          style={{
            color: theme.text
          }}
        >
          Helpful Links
        </h2>

        <div className='flex flex-wrap gap-4'>
          <button
            onClick={() => navigate('/settings/privacy-policy')}
            className='px-5 py-3 rounded-2xl font-semibold'
            style={{
              backgroundColor: theme.highlight,

              color: theme.primary
            }}
          >
            Privacy Policy
          </button>

          <button
            onClick={() => navigate('/settings/help-support')}
            className='px-5 py-3 rounded-2xl font-semibold'
            style={{
              backgroundColor: theme.highlight,

              color: theme.primary
            }}
          >
            Help & Support
          </button>

          <button
            onClick={() => navigate('/settings/contact')}
            className='px-5 py-3 rounded-2xl font-semibold'
            style={{
              backgroundColor: theme.highlight,

              color: theme.primary
            }}
          >
            Contact Developers
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className='pb-10'>
        <p
          className='text-center text-sm'
          style={{
            color: theme.subText
          }}
        >
          © 2026 Exchanza — All Rights Reserved
        </p>
      </div>
    </div>
  )
}
