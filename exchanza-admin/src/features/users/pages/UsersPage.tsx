/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { deleteUserAccount, subscribeToUsers, toggleBlockUser } from '../services/userService'
import { useToast } from '../../../hooks/useToast'
import Loader from '../../../components/common/Loader'
import AppInput from '../../../components/common/AppInput'
import { Bell, Search, UserCheck, Users, UserX } from 'lucide-react'

import AppDialog from '../../../components/common/AppDialog'
import { useAuth } from '../../../context/AuthContext'
import UsersTable from '../components/UsersTable';
import InfoCard from '../../../components/common/InfoCard';

export default function UsersPage() {
    const { theme } = useTheme()
    const { user } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [dialogVisible, setDialogVisible] = useState<any>(null)

    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'admins' | 'blocked'>('all')

    useEffect(() => {
        const unsubscribe = subscribeToUsers(data => {
            setUsers(data)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const filteredUsers = useMemo(() => {
        return users.filter(item => {
            const matchesSearch =
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.email?.toLowerCase().includes(search.toLowerCase())

            const matchesTab =
                activeTab === 'all'
                    ? true
                    : activeTab === 'admins'
                        ? item.role === 'admin'
                        : activeTab === 'users'
                            ? item.role === 'user'
                            : item.isBlocked

            return matchesSearch && matchesTab
        })
    }, [users, search, activeTab])

    const totalUsers = users.filter(u => u.role !== 'admin').length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalActiveUsers = users.filter(u => u.role !== 'admin' && !u.isBlocked).length;
    const totalBlockedUsers = users.filter(u => u.role !== 'admin' && u.isBlocked).length;

    const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
        try {
            await toggleBlockUser(userId, isBlocked)
            showToast(isBlocked ? 'User unblocked' : 'User blocked', 'success')
        } catch (error) {
            console.log(error)
            showToast('Failed to update user', 'error')
        }
    }

    const handleDeleteUser = async () => {
        try {
            await deleteUserAccount(selectedUser.id)
            showToast('User Deleted', 'success')

            setDialogVisible(false)
        } catch (error) {
            console.log(error)
            showToast('Failed to delete user', 'error')
        }
    }

    if (loading) {
        return <Loader fullScreen />
    }

    return (
        <div className='space-y-7'>
            
            {/* Top Header */}
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>

                {/* Search */}
                <div className='w-full max-w-xl'>
                    <AppInput
                        className="rounded-[100px]"
                        placeholder='Search for users, emails, or roles...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        icon={<Search size={18} />}
                    />
                </div>

                {/* Right Side */}
                <div className='flex items-center gap-3 ml-auto'>

                    {/* Notification */}
                    <button
                        onClick={() => navigate("/notifications")}
                        className='relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all'
                    >
                        <Bell size={20} color={theme.text} />
                    </button>

                    {/* Admin Profile */}
                    <div className='flex items-center gap-3 px-3 py-2 rounded-2xl'
                        onClick={() => navigate("/profile")}
                    >
                        <div className='text-right'>
                            <p className='text-sm font-semibold' style={{ color: theme.text }}>
                                Admin User
                            </p>
                            <p className='text-xs uppercase' style={{ color: theme.subText }}>
                                Super Admin
                            </p>
                        </div>

                        <img
                            src={user?.profileImage}
                            alt='admin'
                            className='w-11 h-11 rounded-full object-cover'
                        />
                    </div>
                </div>
            </div>

            {/* Heading */}
            <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
                <div>
                    <h1 className='text-4xl font-black tracking-tight' style={{ color: theme.primary }}>
                        Users Management
                    </h1>

                    <p className='mt-2 text-base max-w-2xl' style={{ color: theme.subText }}>
                        Oversee system participants, moderate roles, and manage account
                        statuses.
                    </p>
                </div>
            </div>

            {/* Stats + Filters */}
            <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>

                {/* Stats */}
                <InfoCard
                    title='Total Users'
                    value={totalUsers}
                    description='All registered users'
                    color={theme.primary}
                    icon={<Users size={22} color={theme.primary} />}
                />

                <InfoCard
                    title='Admins'
                    value={totalAdmins}
                    description='All registered admins'
                    color={theme.purple}
                    icon={<Users size={22} color={theme.purple} />}
                />

                <InfoCard
                    title='Total Active Users'
                    value={totalActiveUsers}
                    description='Active Users'
                    color={theme.yellow}
                    icon={<UserCheck size={22} color={theme.yellow} />}
                />

                <InfoCard
                    title='Total Blocked Users'
                    value={totalBlockedUsers}
                    description='Blocked Users'
                    color={theme.red}
                    icon={<UserX size={22} color={theme.red} />}
                />  
            </div>

            {/* FILTER TABS */}
            <div
                className="inline-flex flex-wrap items-center p-1.5 rounded-2xl"
                style={{
                backgroundColor: theme.card, border: `1px solid ${theme.border}`
                }}
            >
                {[
                {
                    key: 'all',
                    label: 'All',
                },
                {
                    key: 'admins',
                    label: 'Admins',
                },
                {
                    key: 'users',
                    label: 'Users',
                },
                {
                    key: 'blocked',
                    label: 'Blocked',
                }
                ].map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                    style={{
                    backgroundColor: activeTab === tab.key ? theme.primary : 'transparent',
                    color: activeTab == tab.key ? 'white' : theme.text
                    }}
                >
                    {tab.label}
                </button>
                ))}

            </div>

            {/* User Table */}
            <UsersTable
                users={filteredUsers}
                theme={theme}
                navigate={navigate}
                user={user}
                handleBlockToggle={handleBlockToggle}
                setSelectedUser={setSelectedUser}
                setDialogVisible={setDialogVisible}
            />

            <div className='h-10'/>

            {/* Delete Dialog */}
            <AppDialog
                visible={dialogVisible}
                title='Delete User'
                description='Are you sure you want to delete this user?'
                onCancel={() => setDialogVisible(false)}
                onConfirm={handleDeleteUser}
            />
        </div>
    )
}
