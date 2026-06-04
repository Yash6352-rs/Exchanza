/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from 'firebase/auth'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../services/firebase/firebase'
import Loader from '../../../components/common/Loader'
import { lightColors } from '../../../components/constants/colors';
import { CalendarDays, Mail, Moon, Pencil, ShieldCheck, Sun } from 'lucide-react';
import AppButton from '../../../components/common/AppButton';
import EmptyState from '../../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function AboutAccountPage () {

  const auth = getAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const ref = doc(db, 'users', userId)

    const unsub = onSnapshot(ref, snap => {
      setAdmin({
        id: snap.id,
        ...snap.data()
      })

      setLoading(false)
    })

    return () => unsub()
  }, []);

  if (loading) {
    return <Loader fullScreen />
  }

  if (!admin) return null

  const fields = [admin.bio, admin.profileImage, admin.skills?.length > 0]

  const completedCount = fields.filter(Boolean).length

  const progress = Math.round((completedCount / fields.length) * 100)

  const isComplete = progress === 100

  const joinDate = admin.createdAt?.seconds
    ? new Date(admin.createdAt.seconds * 1000).toDateString()
    : '—'

  return (
    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "About Account"
          }
        ]}
      />

      {/* HEADER */}
      <div className="items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
            About Account
          </h1>

          <p className="mt-2" style={{ color: theme.subText }}>
            Your administrator profile information
          </p>
      </div>

      {/* PROFILE CARD */}
      <div
        className='rounded-[32px] p-8 mb-6 border'
        style={{
          backgroundColor: theme.card || lightColors.card,

          borderColor: theme.border || lightColors.border
        }}
      >
        <div className='flex flex-col items-center'>

          <div className='w-32 h-32 rounded-full overflow-hidden border-[5px]'
            style={{ borderColor: theme.primary}}
          >
            <img
              src={admin.profileImage}
              alt='admin'
              className='w-full h-full object-cover'
            />
          </div>

          <h2 className='text-3xl font-bold mt-5' style={{ color: theme.primary}}>
            {admin.name}
          </h2>

          {/* ROLE */}
          <div
            className='mt-4 px-4 py-2 rounded-full flex items-center gap-2'
            style={{ backgroundColor: theme.highlight, color: theme.primary }}
          >
            <ShieldCheck size={16} />

            <span className='font-semibold uppercase text-sm'>
              {admin.role}
            </span>
          </div>

          {/* BIO */}
          <div className='mt-5 text-center max-w-2xl'>
            <p style={{  color: theme.subText  }}
            >
              {expanded ? admin.bio : admin.bio?.slice(0, 120)}

              {!expanded && admin.bio?.length > 120 && '...'}
            </p>

            {admin.bio?.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className='mt-3 font-semibold'
                style={{ color: theme.purple }}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE PROGRESS */}
      <div className='rounded-[32px] p-6 mb-6'
        style={{ backgroundColor: theme.tagText + '15'}}
      >
        <p className='text-sm font-semibold'
          style={{ color: theme.primary }}
        >
          PROFILE PROGRESS
        </p>

        <div className='flex items-center justify-between mt-5'>
          <div>
            <h2
              className='text-3xl font-bold'
              style={{
                color: theme.text
              }}
            >
              {progress}% Completed
            </h2>

            <div className='mt-4'>
              <AppButton 
                title='Edit Profile' 
                onClick={() => navigate("/profile/edit")} 
              />
            </div>
          </div>

          <div
            className='w-24 h-24 rounded-full border-4 flex items-center justify-center'
            style={{
              borderColor: theme.primary
            }}
          >
            {isComplete ? (
              <ShieldCheck size={34} color={theme.success} />
            ) : (
              <Pencil size={34} color={theme.primary} />
            )}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div
        className='rounded-[32px] p-6 mb-6 border'
        style={{
          backgroundColor: theme.card,

          borderColor: theme.border
        }}
      >
        <h2
          className='text-2xl font-bold mb-5'
          style={{
            color: theme.primary
          }}
        >
          Skills
        </h2>

        {admin.skills?.length > 0 ? (

          <div className='flex flex-wrap gap-3'>
            {admin.skills.map((skill: string, index: number) => (
              <div
                key={index}
                className='px-4 py-2 rounded-full font-medium'
                style={{
                  backgroundColor: theme.lightGray,
                  color: theme.primary
                }}
              >
                {skill}
              </div>
            ))}
          </div>

        ) : (
          <EmptyState
            title='No skills added'
            description='Add admin skills and expertise'
          />
        )}
      </div>

      {/* PERSONAL DETAILS */}
      <div
        className='rounded-[32px] p-6 border'
        style={{
          backgroundColor: theme.card,

          borderColor: theme.border
        }}
      >
        <h2
          className='text-2xl font-bold mb-6'
          style={{
            color: theme.primary
          }}
        >
          Personal Details
        </h2>

        <div className='space-y-5'>
          {/* EMAIL */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold mb-1' style={{ color: theme.subText}}>
                EMAIL
              </p>

              <h3 style={{ color: theme.text }}>
                {admin.email}
              </h3>
            </div>

            <Mail size={20} color={theme.subText} />
          </div>

          <div className='h-[1px]' style={{ backgroundColor: theme.border}}/>

          {/* JOINED */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold mb-1'
                style={{ color: theme.subText }}
              >
                JOINED
              </p>

              <h3 style={{ color: theme.text }}>
                {joinDate}
              </h3>
            </div>

            <CalendarDays size={20} color={theme.subText} />
          </div>

          <div className='h-[1px]'
            style={{ backgroundColor: theme.border}}
          />

          {/* THEME */}
          <div className='flex items-center justify-between'>
            <div>
              <p
                className='text-sm font-semibold mb-1'
                style={{ color: theme.subText }}
              >
                THEME PREFERENCE
              </p>

              <h3 className='capitalize'
                style={{ color: theme.text}}
              >
                {admin.themePreference}
              </h3>
            </div>

            {admin.themePreference === 'dark' ? (
              <Moon size={20} color={theme.subText} />
            ) : (
              <Sun size={20} color={theme.subText} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
