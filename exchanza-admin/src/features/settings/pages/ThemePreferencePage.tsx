import { CheckCircle, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import type { ThemeMode } from "../../../context/theme-context";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

const OPTIONS = [
    {
        key: "system",
        title: "System Default",
        desc: "Automatically match your device theme",
        icon: Monitor,
    },
    {
        key: "light",
        title: "Light Mode",
        desc: "Always use light appearance",
        icon: Sun,
    },
    {
        key: "dark",
        title: "Dark Mode",
        desc: "Always use dark appearance",
        icon: Moon,
    },
];

export default function ThemePreferencePage() {

    const { theme, themeMode, setTheme } = useTheme();

    return (

        <div>

            <AppBreadcrumb
                items={[
                {
                    label: "Settings",
                    path: "/settings"
                },
                {
                    label: "Theme Preference"
                }
                ]}
            />
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold" style={{  color: theme.text }}>
                        Theme Preference
                    </h1>
                    <p className="mt-1" style={{ color: theme.subText }}>
                        Choose how Exchanza looks
                        on your device.
                    </p>
                </div>
            </div>

            {/* OPTIONS */}
            <div className="space-y-4 max-w-3xl">
                {OPTIONS.map((item) => {

                    const Icon = item.icon;
                    const isActive = themeMode === item.key;

                    return (
                        <button 
                            key={item.key}
                            onClick={() => setTheme(item.key as ThemeMode)}
                            className="w-full rounded-3xl p-5 text-left transition-all"
                            style={{
                                backgroundColor: theme.card,
                                borderColor: isActive
                                    ? `2px solid ${theme.primary}`
                                    : `1px solid ${theme.border}`
                            }}
                        >
                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">
                                        
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: theme.highlight }}
                                    >
                                        <Icon size={24} color={theme.primary} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                                            {item.title}
                                        </h2>
                                        <p className="mt-1 text-sm" style={{ color: theme.subText }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {isActive && (
                                    <CheckCircle size={24} color={theme.primary} />
                                )}

                             </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}