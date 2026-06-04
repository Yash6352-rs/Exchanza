import { useTheme } from "../../hooks/useTheme";

type Props = {
  title: string
  value: string | number
  description?: string
  color?: string
  icon?: React.ReactNode
}

export default function InfoCard({
  title,
  value,
  description,
  color,
  icon,
}: Props) {

  const { theme } = useTheme()

  return (
    <div
      className='rounded-[30px] p-6 transition-all hover:-translate-y-1'
      style={{
        backgroundColor: theme.card,

        borderTop: `1px solid ${theme.border}`,
        borderRight: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${color || theme.primary}`,
      }}
    >
      {/* TOP */}
      <div className='flex items-start justify-between gap-4'>

        <div>
          <p
            className='uppercase tracking-[0.18em] text-[11px] font-bold'
            style={{ color: theme.subText }}
          >
            {title}
          </p>

          <h2
            className='text-4xl font-black mt-4 leading-none'
            style={{ color: theme.text }}
          >
            {value}
          </h2>
        </div>

        {icon && (
          <div className='w-10 h-10 rounded-full flex items-center justify-center'>
            {icon}
          </div>
        )}
      </div>

      {/* BOTTOM */}
      {description && (
        <div className='flex items-center gap-2 mt-5'>

          <p
            className='text-sm font-medium'
            style={{
              color: color || theme.text
            }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  )
}