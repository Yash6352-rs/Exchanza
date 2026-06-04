/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { getGlobalStats, subscribeToAllPosts, subscribeToAllTrades } from "../services/moderationService";
import Loader from "../../../components/common/Loader";
import AppInput from "../../../components/common/AppInput";
import { BadgePlus, CheckCheck, CheckCircle2, Clock3, FileText, MessageCircleQuestion, Search, XCircle } from "lucide-react";
import PostCard from "../components/PostCard";
import EmptyState from "../../../components/common/EmptyState";
import AdminTradeCard from "../components/AdminTradeCard";
import InfoCard from "../../../components/common/InfoCard";

export default function ModerationPage() {
    const { theme } = useTheme();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("posts");
    const [search, setSearch] = useState("");

    const [posts, setPosts] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {

        const unsubPosts = subscribeToAllPosts((data) => {
            setPosts(data);
            setLoading(false);
        });

        const unsubTrades = subscribeToAllTrades((data) => {
            setTrades(data);
            setLoading(false);
        });

        return () => {
            unsubPosts();
            unsubTrades();
        };
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getGlobalStats();
                setStats(data);
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchStats();
    }, []);

    const filteredPosts = useMemo(() => {

        return posts.filter((post: any) =>
            post.title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [posts, search]);

    const filteredTrades = useMemo(() => {

        return trades.filter((trade: any) => 
            trade.postTitle?.toLowerCase().includes(search.toLowerCase())
        );
    }, [trades, search]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="space-y-7">

                {/* Search */}
                <div className="max-w-2xl">
                    <AppInput
                        className="rounded-[100px]"
                        icon={<Search size={18} />}
                        placeholder="Search posts, trades or users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight"
                            style={{ color: theme.text }}
                        >
                            Content Moderation
                        </h1>

                        <p className="mt-2 text-base max-w-2xl" style={{ color: theme.subText }}>
                            Review and verify community trades and skill exchange posts.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div
                        className="flex items-center p-1.5 rounded-2xl"
                        style={{
                            backgroundColor: theme.card,
                            border: `1px solid ${theme.border}`,
                        }}
                    >
                        <button
                            onClick={() => setActiveTab("posts")}
                            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{
                                backgroundColor: activeTab === "posts" ? theme.primary : "transparent",
                                color:activeTab === "posts" ? "white" : theme.text,
                            }}
                        >
                            Posts
                        </button>

                        <button
                            onClick={() => setActiveTab("trades")}
                            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{
                                backgroundColor: activeTab === "trades" ? theme.primary : "transparent",
                                color: activeTab === "trades" ? "white" : theme.text,
                            }}
                        >
                            Trades
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {activeTab === "posts" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InfoCard
                            title="Total Posts"
                            value={stats?.totalPosts || 0}
                            description="Community exchange posts"
                            color={theme.primary}
                            icon={<FileText size={22} color={theme.primary} />}
                        />
                        <InfoCard
                            title="Request Posts"
                            value={stats?.totalRequests || 0}
                            description="Post type Requests"
                            color={theme.purple}
                            icon={<BadgePlus size={22} color={theme.purple} />}
                        />
                        <InfoCard
                            title="Offer Posts"
                            value={stats?.totalOffers || 0}
                            description="Post type Offer"
                            color={theme.red}
                            icon={<MessageCircleQuestion size={22} color={theme.red} />}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 ">
                        <InfoCard
                            title="Completed Trades"
                            value={stats?.completedTrades}
                            description="Finished successfully"
                            color={theme.primary}
                            icon={<CheckCircle2 size={22} color={theme.primary} />}
                        />
                        <InfoCard
                            title="Pending Trades"
                            value={stats?.pendingTrades}
                            description="Awaiting approval"
                            color={theme.brown}
                            icon={<Clock3 size={22} color={theme.brown} />}
                        />
                        <InfoCard
                            title="Accepted Trades"
                            value={stats?.activeTrades}
                            description="Successfully accepted"
                            color={theme.yellow}
                            icon={<CheckCheck size={22} color={theme.yellow} />}
                        />
                        <InfoCard
                            title="Rejected Trades"
                            value={stats?.rejectedTrades}
                            description="User rejected the trade"
                            color={theme.red}
                            icon={<XCircle size={22} color={theme.red} />}
                        />
                    </div>
                )}
            </div>

            {/* POSTS */}
            {activeTab === "posts" && (

                <div>
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                            {filteredPosts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No posts found"
                            description="No moderation posts available"
                        />
                    )}
                </div>
            )}

            {/* TRADES */}
            {activeTab === "trades" && (
                <div>

                    {filteredTrades.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                            {filteredTrades.map((trade: any) => (
                                <AdminTradeCard key={trade.id} trade={trade} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No trade found"
                            description="No moderation trades available"
                        />
                    )}
                </div>
            )}
        </div>
    );
}