/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { getAuth } from "firebase/auth";
import Loader from "../../../components/common/Loader";
import { BadgeCheck, CalendarDays, FileText, Flag, Handshake, Mail, Moon, Pencil, ShieldCheck, Sun, Users } from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import { getAdminProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";

export default function AdminProfilePage() {

    const { theme } = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                setLoading(true);

                const auth = getAuth();

                const adminId = auth.currentUser?.uid;

                if (!adminId) return;

                const data = await getAdminProfile(adminId);

                setProfile(data.user);
                setStats(data.stats);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div>

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
                    Admin Profile
                </h1>

                <p className="mt-2" style={{ color: theme.subText }}>
                    Manage your Exchanza administrator account
                </p>
            </div>

            {/* PROFILE CARD */}
<div
    className="rounded-[32px] border overflow-hidden"
    style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
    }}
>

    {/* TOP */}
    <div className="p-8">

        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">

            {/* LEFT */}
            <div className="flex flex-col sm:flex-row gap-6">

                {/* IMAGE */}
                <div
                    className="w-32 h-32 rounded-full overflow-hidden border-[4px]"
                    style={{
                        borderColor: theme.primary
                    }}
                >
                    <img
                        src={profile.profileImage}
                        alt="admin"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INFO */}
                <div>

                    {/* NAME + ROLE */}
                    <div className="flex flex-wrap items-center gap-3">

                        <h2
                            className="text-4xl font-black"
                            style={{ color: theme.text }}
                        >
                            {profile.name}
                        </h2>

                        <div
                            className="h-10 px-4 rounded-full flex items-center gap-2"
                            style={{
                                backgroundColor: theme.highlight,
                                color: theme.primary
                            }}
                        >
                            <ShieldCheck size={16} />

                            <span className="text-sm font-bold uppercase">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-3 mt-6">

                        <div
                            className="flex items-center gap-3"
                            style={{ color: theme.subText }}
                        >
                            <Mail size={18} />

                            <span className="text-[15px] font-medium">
                                {profile.email}
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-3"
                            style={{ color: theme.subText }}
                        >
                            <CalendarDays size={18} />

                            <span className="text-[15px] font-medium">
                                Joined {
                                    profile.createdAt?.seconds
                                        ? new Date(
                                            profile.createdAt.seconds * 1000
                                        ).toLocaleDateString()
                                        : "Recently"
                                }
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-3"
                            style={{ color: theme.subText }}
                        >
                            {profile.themePreference === "dark"
                                ? <Moon size={18} />
                                : <Sun size={18} />
                            }

                            <span className="text-[15px] font-medium capitalize">
                                {profile.themePreference} mode
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start xl:items-end gap-6">

                {/* SKILLS */}
                <div className="flex flex-wrap justify-start xl:justify-end gap-3 max-w-[420px]">

                    {(profile.skills || []).map((skill: string) => (

                        <div
                            key={skill}
                            className="px-5 h-11 rounded-2xl text-sm font-semibold flex items-center"
                            style={{
                                backgroundColor: theme.tagBg,
                                color: theme.tagText
                            }}
                        >
                            {skill}
                        </div>
                    ))}
                </div>

                {/* BUTTON */}
                <button
                    onClick={() => navigate("/profile/edit")}
                    className="flex items-center gap-3 px-6 h-14 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{
                        backgroundColor: theme.primary,
                        color: "white",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
                    }}
                >
                    <Pencil size={18} />

                    Edit Profile
                </button>

            </div>
        </div>
    </div>

    {/* BIO */}
    <div
        className="px-8 py-8 border-t"
        style={{
            borderColor: theme.border
        }}
    >

        <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold" style={{ color: theme.text }} >
                Bio
            </h3>
        </div>

        <p
            className="leading-8 text-[16px] max-w-5xl"
            style={{ color: theme.subText }}
        >
            {profile.bio || "No bio added yet."}
        </p>

    </div>

</div>

            {/* ANALYTICS */}
            <div className="mt-8">

                <h2 className="text-3xl font-bold mb-6" style={{ color: theme.text }}>
                    Analytics Summary
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                <StatsCard 
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users size={24} color="white" />}
                    color={theme.primary}
                />

                <StatsCard 
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon={<FileText size={24} color="white" />}
                    color={theme.secondary}
                />
                
                <StatsCard 
                    title="Total Trades"
                    value={stats.totalTrades}
                    icon={<Handshake size={24} color="white" />}
                    color={theme.blue}
                />

                <StatsCard 
                    title="Completed Trades"
                    value={stats.completedTrades}
                    icon={<BadgeCheck size={24} color="white" />}
                    color={theme.purple}
                />

                <StatsCard 
                    title="Completion Rate"
                    value={stats.completionRate}
                    icon={<BadgeCheck size={24} color="white" />}
                    color={theme.brown}
                />

                <StatsCard 
                    title="Report Count"
                    value={stats.reportCount}
                    icon={<Flag size={24} color="white" />}
                    color={theme.error}
                />

            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-8">

                <div className="rounded-[32px] border p-6"
                    style={{ backgroundColor: theme.card,borderColor: theme.border }}
                >

                    <h2 className="text-2xl font-bold mb-5"style={{ color: theme.text }}>
                        Account Information
                    </h2>

                    <div className="space-y-5">

                        <div>
                            <p className="text-sm" style={{ color: theme.subText }}>
                                Email
                            </p>

                            <h3 className="font-semibold mt-1" style={{ color: theme.text }}>
                                {profile.email}
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm" style={{ color: theme.subText }}>
                                Role
                            </p>

                            <h3  className="font-semibold mt-1 uppercase" style={{ color: theme.primary }}>
                                {profile.role}
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm" style={{ color: theme.subText }}>
                                Theme Preference
                            </p>

                            <h3 className="font-semibold mt-1 capitalize" style={{ color: theme.text }}>
                                {profile.themePreference}
                            </h3>
                        </div>
                    </div>

                </div>

                <div className="rounded-[32px] border p-6"
                    style={{ backgroundColor: theme.card, borderColor: theme.border }}
                >
                    <h2 className="text-2xl font-bold mb-5"style={{ color: theme.text }}>
                        Admin Insights
                    </h2>

                    <div className="space-y-4 leading-8"style={{ color: theme.subText }}>

                        <p>
                            You are managing the Exchanza platform with
                            access to moderation, analytics, reports,
                            notifications and platform controls.
                        </p>

                        <p>
                            Current platform trade completion indicates
                            strong user engagement and marketplace activity.
                        </p>

                        <p>
                            Continue monitoring reports, analytics and
                            community health for platform stability.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

            