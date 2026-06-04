/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebase";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { Star,  Trash2 } from "lucide-react";
import AppDialog from "../../components/common/AppDialog";
import { deletePostAdmin } from "../moderation/services/moderationService";
import { useToast } from "../../hooks/useToast";
import AppBreadcrumb from "../../components/common/AppBreadcrumb";

export default function PostDetailsPage() {

    const { theme } = useTheme();
    const { showToast } = useToast();

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);

                const postSnap = await getDoc(
                    doc(db, "posts", id)
                );

                if (!postSnap.exists()) {
                    return;
                }

                const postData: any = {
                    id: postSnap.id,
                    ...postSnap.data(),
                };

                setPost(postData);

                const userSnap = await getDoc(
                    doc(db, "users", postData.userId)
                );

                if (userSnap.exists()) {
                    setUser({
                        id: userSnap.id,
                        ...userSnap.data(),
                    });
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

    }, [id]);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!post) {
        return (
            <EmptyState
                title="Post not found"
                description="This post does not exist"
            />
        );
    }

    return (
        <>
            <div>
                <AppBreadcrumb 
                    items={[
                        {
                            label: "Content Moderation",
                            path: "/moderation"
                        },
                        {
                            label: "Post Details"
                        }
                    ]}
                />
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-4">

                        <div>
                            <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
                                Post Details
                            </h1>

                            <p className="mt-2" style={{ color: theme.subText }}>
                                Review post moderation details
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setDeleteOpen(true)}
                        className="p-3 rounded-2xl"
                        style={{ backgroundColor: theme.card }}
                    >
                        <Trash2 size={20} color={theme.error} />
                    </button>
                </div>

                {/* USER CARD */}
                <div 
                    onClick={() => navigate(`/users/${user?.id}`)}
                    className="flex items-center justify-between p-5 rounded-[28px] border cursor-pointer mb-6"
                    style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    }}
                >

                    <div className="flex items-center gap-4">
                        <img
                            src={user?.profileImage}
                            className="w-14 h-14 rounded-full object-cover"
                        />

                        <div>
                            <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
                                {user?.name}
                            </h2>

                            <p className="mt-1" style={{ color: theme.subText }}>
                                Exchanza User
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Star size={18} color={theme.gold} />

                        <span style={{ color: theme.text }}>
                            {user?.rating?.toFixed(1) || "0.0"}
                        </span>
                    </div>
                </div>

                {/* POST */}
                <div className="rounded-[28px] border p-8" 
                    style={{ backgroundColor: theme.card, borderColor: theme.border }}
                >
                    <h2 className="text-3xl font-bold mb-4" style={{ color: theme.text }}>
                        {post.title}
                    </h2>

                    <p className="leading-8 mb-8" style={{ color: theme.subText }}>
                        {post.description}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-3 mb-8">

                        {post.tags?.map((tag: string, index: number) => (

                            <div
                                key={index}
                                className="px-4 py-2 rounded-full text-sm font-semibold"
                                style={{
                                    backgroundColor: theme.lightGray,
                                    color: theme.subText,
                                }}
                            >
                                #{tag}
                            </div>
                        ))}
                    </div>

                    {/* TYPE */}
                    <div className="flex items-center justify-between">
                        <div className="px-5 py-2 rounded-full text-sm font-semibold"
                            style={{
                                backgroundColor: theme.lightBrown,
                                color: theme.brown,
                            }}
                        >
                            {post.type?.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <AppDialog 
                visible={deleteOpen}
                title="Delete Post"
                description="Are you sure you want to delete this post?"
                confirmText="Delete"
                variant="danger"
                onCancel={() => setDeleteOpen(false)}
                onConfirm={async () => {
                    await deletePostAdmin(post.id)
                    showToast("Post has been deleted", "success")
                    navigate(-1);
                }}
                icon={<Trash2 size={22} color={theme.red} />}
            />
        </>
    );
}