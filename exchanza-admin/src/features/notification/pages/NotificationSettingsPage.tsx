import { useTheme } from "../../../hooks/useTheme";
import { useNotificationSettings } from "../../../context/NotificationSettingsContext";
import { Bell, CheckCheck, Moon, Trash2, Volume2 } from "lucide-react";
import { auth } from "../../../services/firebase/firebase";
import { clearAllNotifications, markAllNotificationsAsRead } from "../services/adminNotificationService";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

/* eslint-disable @typescript-eslint/no-explicit-any */
const SettingsRow = ({
    label, description, value, onChange, disabled
}: any) => {
    const { theme } = useTheme();

    return (

        <div className="flex items-center justify-between py-4 border-b"
            style={{ 
                borderColor: theme.border,
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <div>
                <h3 className="font-semibold"  style={{ color: theme.text }}>
                    {label}
                </h3>
                <p className="text-sm mt-1" style={{ color: theme.subText }} >
                    {description}
                </p>
            </div>

            <input 
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="w-5 h-5"
            />
        </div>
    );
}

export default function NotificationSettingsPage() {
    const { theme } = useTheme();
    const { settings, updateSetting } = useNotificationSettings();

    if (!settings) return null;
    
    return (

        <div>
            <AppBreadcrumb
                items={[
                {
                    label: "Notifications",
                    path: "/notifications"
                },
                {
                    label: "Notifications Settings"
                }
                ]}
            />
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
                        Notification Settings
                    </h1>
                    <p className="mt-1"style={{ color: theme.subText }} >
                        Manage admin alerts and
                        notifications.
                    </p>
                </div>
            </div>

            {/* MASTER */}
            <div className="rounded-3xl p-6 mb-6"
                style={{ backgroundColor: theme.card }}
            >
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.highlight }}
                        >
                            <Bell size={24} color={theme.primary}/>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold" style={{ color: theme.text}}>
                                Show Notifications
                            </h2>
                            <p style={{ color: theme.subText  }}>
                                Receive admin alerts
                            </p>
                        </div>
                    </div>
                    <input 
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => updateSetting("enabled", e.target.checked)}
                        className="w-5 h-5"
                    />
                </div>
            </div>

            {/* SETTINGS */}
            <div className="rounded-3xl p-6 mb-6"
                style={{ 
                    backgroundColor: theme.card, 
                    opacity: settings.enabled ? 1 : 0.5
                }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <Volume2 size={22} color={theme.primary}/>
                    <h2 className="text-xl font-bold"style={{ color: theme.text }}>
                        General Settings
                    </h2>
                </div>

                <SettingsRow 
                    label="Notification Badge"
                    description="Show unread count"
                    value={settings.badge}
                    onChange={(val: boolean) => updateSetting("badge", val)}
                    disabled={!settings.enabled}
                />

                <SettingsRow 
                    label="Notification Sound"
                    description="Play sound for alerts"
                    value={settings.sound}
                    onChange={(val: boolean) => updateSetting("sound", val)}
                    disabled={!settings.enabled}
                />
            </div>

            {/* QUIET HOURS */}
            <div className="rounded-3xl p-6 mb-6" 
                style={{ 
                    backgroundColor: theme.card, opacity: settings.enabled ? 1 : 0.5,
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Moon size={22} color={theme.primary} />
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: theme.text }}>
                                Quiet Hours
                            </h2>
                            <p className="text-sm" style={{ color: theme.subText }}>
                                12AM - 6AM
                            </p>
                        </div>
                    </div>
                    <input 
                        type="checkbox"
                        checked={settings.quietHours}
                        onChange={(e) => updateSetting("quietHours", e.target.checked)}
                        disabled={!settings.enabled}
                        className="w-5 h-5"
                    />
                </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-4">
                <button 
                    onClick={async () => {
                        if (!auth.currentUser?.uid) return;

                        await markAllNotificationsAsRead(auth.currentUser.uid);
                    }}
                    className="w-full rounded-2xl p-5 flex items-center gap-3"
                    style={{ backgroundColor:theme.card }}
                >
                    <CheckCheck size={20} color={theme.primary}/>
                    <span className="font-semibold" style={{ color:  theme.text }} >
                        Mark All As Read
                    </span>
                </button>

                <button 
                    onClick={async () => {
                        if (!auth.currentUser?.uid) return;

                        await clearAllNotifications(auth.currentUser.uid);
                    }}
                    className="w-full rounded-2xl p-5 flex items-center gap-3"
                    style={{ backgroundColor:theme.card }}
                >
                    <Trash2 size={20} color={theme.error}/>
                    <span className="font-semibold" style={{ color:  theme.error }} >
                        Clear All Notifications
                    </span>
                </button> 
            </div>
            
        </div>
    );
} 