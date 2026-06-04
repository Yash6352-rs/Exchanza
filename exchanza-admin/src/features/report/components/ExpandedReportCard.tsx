/* eslint-disable @typescript-eslint/no-explicit-any */
import AppButton from "../../../components/common/AppButton";
import { useTheme } from "../../../hooks/useTheme";

type Props = {
  report: any
  handleViewContent: (report: any) => void
  onSendMessage: () => void
  onResolve: () => void
  onViewProfile: () => void
}

export default function ExpandedReportCard({
  report,
  handleViewContent,
  onSendMessage,
  onResolve,
  onViewProfile
}: Props) {

  const { theme } = useTheme();

  const buttonsCount = (report.type !== 'system' ? 1 : 0) 
    + 1 + (report.status !== 'resolved' ? 1 : 0);

  return (
    <div className='flex flex-col xl:flex-row gap-6 mt-7'>

      {/* LEFT */}
      <div
        className='w-full xl:w-[65%] rounded-[34px] border p-6'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <p
          className='text-xs uppercase tracking-[0.18em] font-bold mb-6'
          style={{ color: theme.subText }}
        >
        {report.type} Report • #{report.id?.slice(0, 8)}
        </p>

        {/* TITLE */}
        <div
          className='rounded-[26px] p-5'
          style={{
            backgroundColor: theme.background,
            border: `1px solid ${theme.border}`
          }}
        >
          <p
            className='text-[11px] uppercase tracking-[0.18em] font-bold mb-1'
            style={{ color: theme.subText }}
          >
            Report Title
          </p>

          <h3
            className='text-2xl font-black leading-tight'
            style={{ color: theme.text }}
          >
            {report.title}
          </h3>
        </div>

        {/* DESCRIPTION */}
        <div className='mt-6 px-3'>

          <p
            className='text-[11px] uppercase tracking-[0.18em] font-bold mb-2'
            style={{ color: theme.subText }}
          >
            Description
          </p>

          <p
            className='leading-8 text-[15px]'
            style={{ color: theme.text }}
          >
            {report.description}
          </p>
        </div>

        {/* META */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 px-2'>

          <div className='rounded-2xl p-4'
            style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`}}
          >
            <p className='mt-1 text-xs font-bold uppercase' style={{ color: theme.subText }}>
              Priority
            </p>

            <h3 className='mt-2 font-semibold'
              style={{ 
                color: report.type == 'system'
                    ? theme.error
                    : report.type === 'post'
                        ? theme.yellow
                        : theme.secondary
              }}
            >
                {report.type === 'system'
                    ? 'High'
                    : report.type === 'post'
                        ? 'Medium'
                        : 'Low'
                }
            </h3>
          </div>

          <div
            className='rounded-2xl p-5'
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`
            }}
          >
            <p
              className='text-xs font-bold uppercase'
              style={{ color: theme.subText }}
            >
              Created
            </p>

            <h3
              className='mt-2 font-semibold'
              style={{ color: theme.text }}
            >
              {report.createdAt?.seconds
                ? new Date(
                    report.createdAt.seconds * 1000
                  ).toLocaleDateString()
                : 'Recently'}
            </h3>
          </div>
        </div>

        {/* ACTIONS */}
        <div className='grid gap-4 mt-10 px-2'
            style={{
                gridTemplateColumns: buttonsCount === 1
                    ? '1fr'
                    : buttonsCount === 2
                        ? "1fr 1fr"  
                        : '1fr 1fr 1fr'
            }}
        >

          {report.type !== 'system' && (
            <AppButton
              title='View Content'
              variant='outline'
              onClick={() => handleViewContent(report)}
            />
          )}

          <AppButton
            title='Send Message'
            onClick={onSendMessage}
          />

          {report.status !== 'resolved' && (
            <AppButton
              title='Mark Resolved'
              variant='outline'
              onClick={onResolve}
            />
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div
        className='w-full xl:w-[35%] rounded-[34px] border p-6 h-fit'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <p
          className='text-xs uppercase tracking-[0.18em] font-bold mb-6'
          style={{ color: theme.subText }}
        >
          Reporter Information
        </p>

        {/* USER */}
        <div className='flex flex-col items-center text-center'>

          <div
            className='w-28 h-28 rounded-[28px] overflow-hidden border'
            style={{ borderColor: theme.border }}
          >
            <img
              src={report.reporterAvatar || ''}
              alt='reporter'
              className='w-full h-full object-cover'
            />
          </div>

          <h2
            className='text-3xl font-black mt-5'
            style={{ color: theme.text }}
          >
            {report.reporterName}
          </h2>

          <p
            className='mt-2 text-sm'
            style={{ color: theme.subText }}
          >
            Member since {
              report.reporterCreatedAt?.seconds
                ? new Date(
                    report.reporterCreatedAt.seconds * 1000
                  ).toLocaleDateString()
                : 'Recently'
            }
          </p>
        </div>

        {/* STATS */}
        <div className='grid grid-cols-2 gap-4 mt-7'>

          <div
            className='rounded-2xl p-5 text-center'
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`
            }}
          >
            <p
              className='text-[11px] uppercase font-bold'
              style={{ color: theme.subText }}
            >
              Ratings
            </p>

            <h3
              className='text-3xl font-black mt-3'
              style={{ color: theme.primary }}
            >
              ⭐ {report.reporterRating || 0}
            </h3>
          </div>

          <div
            className='rounded-2xl p-5 text-center'
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`
            }}
          >
            <p
              className='text-[11px] uppercase font-bold'
              style={{ color: theme.subText }}
            >
              Reports
            </p>

            <h3
              className='text-3xl font-black mt-3'
              style={{ color: theme.text }}
            >
              {report.reporterReportsCount || 0}
            </h3>
          </div>
        </div>

        {/* PROFILE BUTTON */}
        <button
          onClick={onViewProfile}
          className='w-full mt-8 py-4 rounded-2xl font-bold transition-all'
          style={{
            backgroundColor: theme.primary,
            color: 'white'
          }}
        >
          View Full Profile
        </button>
      </div>
    </div>
  )
}