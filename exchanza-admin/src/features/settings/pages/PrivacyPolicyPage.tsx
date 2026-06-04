/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart3, Bell, Lock, Mail, MessageCircle, RefreshCcw, Repeat, Share2, Shield, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

const policies = [
    {
        icon: Shield,
        title: "User Information",
        desc: "We collect basic details like your name, email, skills, and profile data to manage your account.",
    },
    {
        icon: Lock,
        title: "Data Security",
        desc: "Your data is securely stored using Firebase infrastructure and protected from unauthorized access.",
    },
    {
        icon: MessageCircle,
        title: "Messages & Chats",
        desc: "Messages exchanged during trades are stored to support real-time communication.",
    },
    {
        icon: Repeat,
        title: "Trades & Activity",
        desc: "Trade activity and proposals are stored to ensure smooth and transparent exchanges.",
    },
    {
        icon: Star,
        title: "Ratings & Reviews",
        desc: "Ratings and reviews help build trust inside the Exchanza community.",
    },
    {
        icon: Bell,
        title: "Notifications",
        desc: "Notifications are used for trades, chats, updates, and platform activities.",
    },
    {
        icon: BarChart3,
        title: "Usage Analytics",
        desc: "Analytics help us improve app performance and future features.",
    },
    {
        icon: Share2,
        title: "Data Sharing",
        desc: "We never sell your data. Information is only shared when necessary.",
    },
    {
        icon: Trash2,
        title: "Account Deletion",
        desc: "Users can delete their accounts anytime and remove their data.",
    },
    {
        icon: RefreshCcw,
        title: "Policy Updates",
        desc: "Policies may change over time. Continued use means acceptance of updates.",
    },
];

const PolicyCard = ({ item, theme }: any) => {

    const Icon = item.icon;

    return (
        <div
            className="rounded-3xl p-5 border transition-all hover:scale-[1.01]"
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
        >
            <div className="flex items-start gap-4">

                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                        backgroundColor: `${theme.primary}15`,
                    }}
                >
                    <Icon size={24} color={theme.primary}/>
                </div>

                <div className="flex-1">

                    <h3 className="text-lg font-bold"
                        style={{ color: theme.text }}
                    >
                        {item.title}
                    </h3>

                    <p className="text-sm leading-7 mt-2"
                        style={{ color: theme.subText }}
                    >
                        {item.desc}
                    </p>

                </div>

            </div>
        </div>
    );
};

export default function PrivacyPolicyPage() {

    const navigate = useNavigate();
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
                    label: "Privacy Policy"
                }
                ]}
            />
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold"
                        style={{ color: theme.primary }}
                    >
                        Privacy Policy
                    </h1>

                    <p className="mt-2"
                        style={{ color: theme.subText }}
                    >
                        Protecting your data and ensuring a secure experience.
                    </p>
                </div>

            </div>

            {/* HERO */}
            <div
                className="rounded-[32px] p-8 border mb-10"
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                }}
            >
                <div>
                    <div>
                        <h2 className="text-3xl font-bold" style={{ color: theme.text }}>
                            Your Privacy Matters
                        </h2>

                        <p className="mt-4 leading-8 max-w-3xl"
                            style={{ color: theme.subText }}
                        >
                            Exchanza is committed to protecting your personal information,
                            trade activities, messages, and platform interactions while
                            maintaining a trusted and secure community.
                        </p>

                    </div>

                    <div
                        className="mt-4 -mb-1"
                    >
                        <p className="font-semibold" style={{ color: theme.primary }} >
                            Last Updated: 30 April 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* POLICIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {policies.map((item, index) => (
                    <PolicyCard
                        key={index}
                        item={item}
                        theme={theme}
                    />
                ))}

            </div>

            {/* CONTACT SECTION */}
            <div
                className="rounded-[32px] p-8 mt-10"
                style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.deepTeal})`,
                }}
            >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            Questions About Privacy?
                        </h2>
                        <p className="text-white/90 mt-3 max-w-2xl leading-7">
                            Our Exchanza privacy team is always ready to help
                            you understand how your data is handled and protected.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/settings/contact")}
                        className="px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                        style={{
                            backgroundColor: "white",
                            color: theme.primary,
                        }}
                    >
                        <Mail size={18} />
                        Contact Developers
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-10 text-center">

                <p className="text-sm"  style={{ color: theme.subText }}>
                    © 2026 Exchanza — Your Skills, Your Currency.
                </p>
            </div>

        </div>
    );
}