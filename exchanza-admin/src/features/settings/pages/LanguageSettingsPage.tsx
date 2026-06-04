import { useTheme } from "../../../hooks/useTheme";
import { CheckCircle, Globe, Info } from "lucide-react";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

export default function LanguageSettingsPage() {
    const { theme } = useTheme();

    return (
        <div>
            <AppBreadcrumb
                items={[
                {
                    label: "Settings",
                    path: "/settings"
                },
                {
                    label: "Language Settings"
                }
                ]}
            />

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold"
                        style={{ color: theme.text }}
                    >
                        Language Settings
                    </h1>

                    <p
                        className="mt-1"
                        style={{ color: theme.subText }}
                    >
                        Manage your application language
                    </p>
                </div>
            </div>

            {/* HERO */}
            <div className="flex flex-col items-center text-center mb-10">

                <div
                    className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
                    style={{
                        backgroundColor:
                            theme.primary,
                    }}
                >
                    <Globe size={60} color="white" />
                </div>

                <h2
                    className="text-3xl font-bold"
                    style={{ color: theme.primary }}
                >
                    Choose your preferred language
                </h2>

                <p
                    className="max-w-2xl mt-4 leading-8 text-lg"
                    style={{ color: theme.subText }}
                >
                    Select the language you want to use
                    throughout the Exchanza admin panel.
                </p>
            </div>

            {/* LANGUAGE CARD */}
            <div
                className="rounded-[32px] border overflow-hidden"
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                }}
            >

                <button
                    className="w-full flex items-center justify-between px-8 py-7 transition-all hover:scale-[1.01]"
                >

                    {/* LEFT */}
                    <div className="flex items-center gap-5">

                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.highlight }}
                        >
                            <Globe size={28} color={theme.primary}
                            />
                        </div>

                        <div className="text-left">

                            <h3 className="text-2xl font-semibold"
                                style={{ color: theme.text }}
                            >
                                English
                            </h3>

                            <p
                                className="mt-1"
                                style={{
                                    color: theme.subText,
                                }}
                            >
                                Default application language
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <CheckCircle size={34} color={theme.primary}/>
                </button>
            </div>

            {/* INFO NOTE */}
            <div
                className="mt-7 rounded-[28px] border px-6 py-5 flex items-start gap-4"
                style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                }}
            >

                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                        backgroundColor: theme.highlight,
                    }}
                >
                    <Info size={22} color={theme.primary}/>
                </div>

                <div>
                    <h3
                        className="text-lg font-semibold mb-1"
                        style={{ color: theme.text }}
                    >
                        More languages coming soon
                    </h3>

                    <p
                        className="leading-7"
                        style={{ color: theme.subText }}
                    >
                        Currently, Exchanza Admin supports
                        English only. Additional languages
                        and localization options will be
                        added in future updates.
                    </p>
                </div>
            </div>
        </div>
    );
} 