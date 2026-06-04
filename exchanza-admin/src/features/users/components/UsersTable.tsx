import { Shield, ShieldCheck, ShieldOff, Trash2, User } from "lucide-react";
import EmptyState from "../../../components/common/EmptyState";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  users: any[]
  theme: any
  navigate: any
  user: any
  handleBlockToggle: (
    userId: string,
    isBlocked: boolean
  ) => void
  setSelectedUser: (user: any) => void
  setDialogVisible: (visible: boolean) => void
}

export default function UsersTable({
  users, theme, navigate, user,
  handleBlockToggle,
  setSelectedUser,
  setDialogVisible
}: Props) {
  return (

    <div className='rounded-[34px] overflow-hidden'
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        boxShadow:
          theme.background === '#0B0F10'
            ? '0 10px 30px rgba(0,0,0,0.35)'
            : '0 10px 30px rgba(0,0,0,0.04)'
      }}
    >
      <div className='overflow-x-auto'>
        <table className='w-full'>

          <thead style={{ backgroundColor: theme.background}}>
            <tr>
              <th
                className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                style={{ color: theme.subText }}
              >
                User Details
              </th>

              <th
                className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                style={{ color: theme.subText }}
              >
                Role
              </th>

              <th
                className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                style={{ color: theme.subText }}
              >
                Status
              </th>

              <th
                className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                style={{ color: theme.subText }}
              >
                Joined Date
              </th>

              <th
                className='text-right px-8 py-6 text-xs uppercase tracking-[0.18em]'
                style={{ color: theme.subText }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map(item => (
                <tr
                  key={item.id}
                  className='transition-all hover:bg-opacity-40'
                  style={{
                    borderTop: `1px solid ${theme.border}`
                  }}
                >
                  {/* User */}
                  <td className='px-8 py-6'>
                    <div
                      className='flex items-center gap-4 cursor-pointer'
                      onClick={() => {
                        if (item.id === user?.uid) {
                          navigate('/profile')
                        } else {
                          navigate(`/users/${item.id}`)
                        }
                      }}
                    >
                      <div className='relative'>
                        <img
                          src={item.profileImage}
                          alt='avatar'
                          className='w-14 h-14 rounded-full object-cover'
                        />

                        {/* {!item.isBlocked && (
                          <span
                            className='absolute bottom-0 right-0 w-3 h-3 rounded-full border-2'
                            style={{
                              backgroundColor: theme.success,
                              borderColor: theme.card
                            }}
                          />
                        )} */}
                      </div>

                      <div>
                        <p className='font-bold text-[15px]' style={{ color: theme.text }}>
                          {item.name}
                        </p>

                        <p className='text-sm' style={{ color: theme.subText}}>
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className='px-8 py-6'>
                    <span
                      className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold capitalize'
                      style={{
                        backgroundColor: item.role === 'admin'
                            ? theme.lightPurple
                            : theme.lightGray,
                        color: item.role === 'admin'
                            ? theme.purple
                            : theme.darkGray
                      }}
                    >
                      {item.role === 'admin' ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <User size={14} />
                      )}

                      {item.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className='px-8 py-6'>
                    <span
                      className='px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide'
                      style={{
                        backgroundColor: item.isBlocked ? '#FEE2E2' : '#DCFCE7',
                        color: item.isBlocked ? theme.error : theme.success
                      }}
                    >
                      {item.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className='px-8 py-6'>
                    <div>
                      <p className='font-medium' style={{ color: theme.text }}>
                        {item.createdAt
                          ? new Date(
                              item.createdAt.seconds
                                ? item.createdAt.seconds * 1000
                                : item.createdAt
                            ).toLocaleDateString()
                          : '-'}
                      </p>

                      <p className='text-xs' style={{ color: theme.subText }}>
                        Joined
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  {item.role !== "admin" ? (
                    <td className='px-8 py-6'>
                      <div className='flex items-center justify-end gap-3'>
                        {/* Block */}
                        <button
                          onClick={() =>
                            handleBlockToggle(
                              item.id,
                              item.isBlocked
                            )
                          }
                          className='w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105'
                          style={{ backgroundColor: theme.background }}
                        >
                          {item.isBlocked ? (
                            <ShieldOff size={18} color={theme.success} />
                          ) : (
                            <Shield size={18} color={theme.error} />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedUser(item)
                            setDialogVisible(true)
                          }}
                          className='w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105'
                          style={{ backgroundColor: theme.background }}
                        >
                          <Trash2 size={18} color={theme.error}/>
                        </button>
                      </div>
                    </td>
                  ): (
                    <td className='px-8 py-6'>
                      <div className='flex justify-end'>
                        <div
                          className='inline-flex items-center gap-2 px-4 py-2 rounded-full'
                          style={{
                            backgroundColor: theme.lightPurple,
                            color: theme.purple
                          }}
                        >
                          <ShieldCheck size={15} />

                          <span className='text-xs font-bold uppercase tracking-wide'>
                            Protected
                          </span>
                        </div>
                      </div>
                    </td>
                  )}
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='py-20'>
                  <EmptyState
                    title='No users found'
                    description='Try searching with another keyword'
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {users.length > 0 && (
        <div
          className='flex items-center justify-between px-8 py-5'
          style={{
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: theme.background
          }}
        >
          <p className='text-sm'style={{ color: theme.subText }}>
            Showing{' '}
            <span className='font-bold' style={{ color: theme.text }}>
              {users.length}
            </span>{' '}
            users
          </p>
        </div>
      )}
    </div>
  )
}