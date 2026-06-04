/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, User, ShieldCheck, Moon, Bell, LayoutDashboard, BarChart3, Flag, FileText, HelpCircle, 
    Mail, LogOut, Trash2, Lock, Globe} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { lightColors } from "../../../components/constants/colors";
import SettingsSection from "../components/SettingsSection";
import SettingsItem from "../components/SettingsItem";
import AppDialog from "../../../components/common/AppDialog";
import { IoCreateOutline, IoHelpBuoyOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { deleteAdminAccount, logoutAdmin } from "../../auth/services/authService";

export default function SettingsPage() {

    const { theme } = useTheme();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showLogout, setShowLogout] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const sections = [
        {
            title: 'Account Center',
            items: [
            {
                icon: User,
                label: 'About Admin Account',
                onClick: () => navigate('/settings/about-account')
            },
            {
                icon: IoCreateOutline,
                label: 'Edit Profile',
                onClick: () => navigate('/profile/edit')
            },
            {
                icon: Lock,
                label: 'Change Password',
                onClick: () => navigate('/settings/change-password')
            }
            ]
        },
        {
            title: 'Your Preferences',
            items: [
            {
                icon: Moon,
                label: 'Theme Preferences',
                onClick: () => navigate('/settings/theme-preference')
            },
            {
                icon: Bell,
                label: 'Notification Settings',
                onClick: () =>
                navigate('/notifications/notifications-settings')
            },
            {
                icon: Globe,
                label: 'Language Settings',
                onClick: () =>
                navigate('/settings/language-settings')
            }
            ]
        },
        {
            title: 'Management (Coming Soon)',
            items: [
            {
                icon: LayoutDashboard,
                label: 'Dashboard Appearance'
            },
            {
                icon: BarChart3,
                label: 'Analytics Settings'
            },
            {
                icon: Flag,
                label: 'Reports Preferences'
            },
            {
                icon: ShieldCheck,
                label: 'Moderation Preferences'
            }
            ]
        },
        {
            title: 'Platform Information',
            items: [
            {
                icon: IoIosInformationCircleOutline,
                label: 'About Exchanza',
                onClick: () => navigate('/settings/about-exchanza')
            },
            {
                icon: FileText,
                label: 'Privacy Policy',
                onClick: () => navigate('/settings/privacy-policy')
            },
            {
                icon: ShieldCheck,
                label: 'Admin Privileges',
                onClick: () => navigate('/settings/admin-privileges')
            },
            {
                icon: HelpCircle,
                label: 'FAQs',
                onClick: () => navigate('/settings/faqs')
            }
            ]
        },
        {
            title: 'Support',
            items: [
            {
                icon: IoHelpBuoyOutline,
                label: 'Help & Support',
                onClick: () => navigate('/settings/help-support')
            },
            {
                icon: Flag,
                label: 'Report Problem',
                onClick: () => navigate('/settings/report-problem')
            },
            {
                icon: Mail,
                label: 'Contact Developers',
                onClick: () => navigate('/settings/contact')
            }
            ]
        },
        {
            title: 'Security',
            items: [
            {
                icon: LogOut,
                label: 'Logout',
                danger: true,
                onClick: () => setShowLogout(true)
            },
            {
                icon: Trash2,
                label: 'Delete Admin Account',
                danger: true,
                onClick: () => setShowDelete(true)
            }
            ]
        }
    ];

    const filteredSections = sections.map(section => ({
        ...section,

        items: section.items.filter(item => 
            item.label?.toLowerCase().includes(search.toLowerCase())
            )
        })).filter(section => section.items.length > 0
    );

    return (
        <div>
            {/* SEARCH */}
            <div className="mb-7">

                <div className="rounded-[28px] border px-4 py-3 flex items-center gap-3"
                    style={{
                        backgroundColor:  theme.card || lightColors.card,
                        borderColor: theme.border || lightColors.border,
                    }}
                >
                    <Search size={18}color={theme.subText}/>

                    <input
                        placeholder="Search settings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)
                        }
                        className="bg-transparent outline-none flex-1"
                        style={{ color: theme.text }}
                    />
                </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
                    Settings
                </h1>

                <p className="mt-2" style={{ color: theme.subText }}>
                    Manage dashboard preferences and platform settings
                </p>
            </div>

            {/* SETTINGS SECTION */}
            <div className="space-y-8">
                {filteredSections.map(section => (

                    <SettingsSection 
                        key={section.title}
                        title={section.title}
                        theme={theme}
                    >
                        {section.items.map((item: any) => (

                            <SettingsItem 
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                danger={item.danger}
                                theme={theme}
                                onClick={item.onClick}
                            />
                        ))}
                    </SettingsSection>
                ))}
            </div>

            {/* DIALOGS */}
            <AppDialog
                visible={showLogout}
                title="Logout"
                description="Are you sure you want to logout?"
                onCancel={() => setShowLogout(false)}
                onConfirm={async () => {
                    try {
                        await logoutAdmin();
                        setShowLogout(false);
                        navigate("/");
                        
                    } catch (error) {
                        console.log("Logout error:", error);
                    }
                }}
            />
            
            <AppDialog
                visible={showDelete}
                title="Delete Admin Account"
                description="This action is permanent."
                confirmText="Delete"
                variant="danger"
                onCancel={() => setShowDelete(false)}
                onConfirm={async () => {
                    try {
                        await deleteAdminAccount();
                        navigate("/");
                    } catch (error: any) {
                        console.log(error);

                        if (error.code === "auth/requires-recent-login") {
                            alert("Please login again to delete account");
                        }
                    }
                }}
            />

        </div>
    );
}