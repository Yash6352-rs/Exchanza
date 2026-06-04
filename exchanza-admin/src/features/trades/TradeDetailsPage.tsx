/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { deleteTradeAdmin } from "../moderation/services/moderationService";
import AppDialog from "../../components/common/AppDialog";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebase";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { lightColors } from "../../components/constants/colors";
import { getTimeAgo } from "../../components/constants/time";
import AppBreadcrumb from "../../components/common/AppBreadcrumb";

export default function TradeDetailsPage() {

    const { id } = useParams();
    const { theme } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [trade, setTrade] = useState<any>(null);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const getStatusColor = () => {

        if (trade.status === "pending") {
            return theme.brown;
        }
        if (trade.status === "accepted") {
            return theme.secondary;
        }
        if (trade.status === "completed") {
            return theme.success;
        }
        return theme.error;
    }

    useEffect(() => {
        const fetchTrade = async () => {
            if (!id) return;

            try {
                setLoading(true);

                // TRADE
                const tradeSnap = await getDoc(doc(db, "trades", id));
                if (!tradeSnap.exists()) {
                    setTrade(null);
                    return;
                }

                const tradeData: any = {
                    id: tradeSnap.id,
                    ...tradeSnap.data(),
                };

                // POST
                const postSnap = await getDoc(doc(db, "posts", tradeData.postId));

                if (postSnap.exists()) {
                    setPost({
                        id: postSnap.id,
                        ...postSnap.data(),
                    });
                }

                // FROM USER
                const fromUserSnap = await getDoc(doc(db, "users", tradeData.fromUserId));

                // TO USER
                const toUserSnap = await getDoc(doc(db, "users", tradeData.toUserId));

                setTrade({
                    ...tradeData,

                    fromUser: fromUserSnap.exists() ? fromUserSnap.data() : null,
                    toUser: toUserSnap.exists() ? toUserSnap.data() : null
                });

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrade();

    }, [id]);

    if (loading) return <Loader fullScreen />;
    if (!trade) return <EmptyState title="Trade not found" />

    return (
        <>

        <AppBreadcrumb 
            items={[
                {
                    label: "Content Moderation",
                    path: "/moderation"
                },
                {
                    label: "Trade Details"
                }
            ]}
        />

        <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
                        Trade Details
                    </h1>

                    <p className="mt-2" style={{ color: theme.subText }}>
                        Review trade details, monitor exchange activity, and moderate.
                    </p>
                </div>
            </div>

            <button
                onClick={(e) =>  {
                    e.stopPropagation();
                    setDeleteOpen(true)}
                }
                className="p-3 rounded-2xl"
                style={{ backgroundColor: theme.card }}
            >
                <Trash2 size={20} color={theme.error} />
            </button>
        </div>


        <div className="rounded-[28px] border p-6 shadow-sm" 
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
                {/* TOP */}
                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-base font-bold" style={{ color: theme.primary }}>
                            TRADE #{trade.id.slice(0, 6)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="flex -space-x-3">
                            <img
                                src={trade.fromUser?.profileImage}
                                className="w-12 h-12 rounded-full border-2 object-cover"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/users/${trade.fromUserId}`)
                                }}
                            />

                            <img
                                src={trade.toUser?.profileImage}
                                className="w-12 h-12 rounded-full border-2 object-cover"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/users/${trade.toUserId}`)
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* USERS */}
                <div className="flex items-center gap-5 mt-4">

                    <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                        {trade.fromUser?.name || "User"} ↔ {trade.toUser?.name || "User"}
                    </h2>

                    <div className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                            backgroundColor: getStatusColor() + "20",
                            color: getStatusColor()
                        }}
                    >
                        {trade.status.toUpperCase()}
                    </div>
                </div>

                {/* STATUS BOX */}
                 <div className="rounded-2xl p-5 mt-5 flex items-center justify-between" 
                    style={{ backgroundColor: theme.border + "70" }}
                >
                    <div> 
                        <p className="text-xs font-semibold" style={{ color: theme.subText }}>
                            STATUS
                        </p>

                        <p className="mt-1 text-sm font-medium" style={{ color: theme.text }}>
                            {trade.status === "pending" && "Waiting for response"}
                            {trade.status === "accepted" && "Trade in progress"}
                            {trade.status === "completed" && "Trade completed"}
                            {trade.status === "rejected" && "Trade rejected"}
                        </p>
                    </div>

                </div>

                <div className="rounded-2xl border p-5 mt-5" style={{ backgroundColor: theme.border + "50", borderColor: theme.border }}>

                    <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text }}>
                        Exchange Details
                    </h3>

                    <div className="space-y-5">

                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: theme.subText }}>
                                📌 Post Title
                            </p>
                            <p style={{ color: theme.text }}>
                                {post?.title || "No post title"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: theme.subText }}>
                                📦 Offer
                            </p>

                            <p style={{ color: theme.text }}>
                                {trade.offerText}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: theme.subText }}>
                                🎯 Request
                            </p>

                            <p style={{ color: theme.text }}>
                                {trade.requestText}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="flex px-2 mt-5 justify-between items-center">
                    <p className="text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                        Created {getTimeAgo(trade.createdAt)}
                    </p>

                    <button className="flex items-center gap-2"
                        onClick={() => navigate(`/posts/${trade.postId}`)}
                    >
                        <span className="text-sm font-medium" style={{ color: theme.primary }}>                          
                            View Post
                        </span>
                        <ArrowRight size={16} color={theme.primary} />
                    </button>
                </div>
            </div>

            <AppDialog 
                visible={deleteOpen}
                title="Delete Trade"
                description="Are you sure you want to delete this trade?"
                confirmText="Delete"
                variant="danger"
                onCancel={() => setDeleteOpen(false)}
                onConfirm={async () => {
                    await deleteTradeAdmin(trade.id);
                    showToast("Trade has been deleted", "success")
                    setDeleteOpen(false);
                }}
                icon={<Trash2 size={22} color={theme.red} />}
            />
        </>
    );
}