/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import { collection, doc, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";
import AppButton from "../../../components/common/AppButton";
import { subscribeToUsers } from "../../users/services/userService";
import { Check, Megaphone, Search, ShieldAlert, X } from "lucide-react";
import AppInput from "../../../components/common/AppInput";

interface Props {
    open: boolean;
    onClose: () => void;
    mode?: "direct" | "announcement";
    defaultUserIds?: string[],
    reportId?: string;
}

export default function AdminMessageModal({
    open, onClose, mode = "direct", defaultUserIds = [], reportId
}: Props) {

    const { theme } = useTheme();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(defaultUserIds || []);

    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsubscribe = subscribeToUsers((data) => {
            const filtered = data.filter(
                (user: any) => user.role !== "admin"
            );

            setUsers(filtered);
        })

        return () => unsubscribe();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user: any) =>
            user.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const toggleUser = (user: any) => {
        const exists = selectedUsers.includes(user.id);

        if (exists) {
            setSelectedUsers((prev) =>
                prev.filter((id) => id !== user.id)
            );
        } else {
            setSelectedUsers((prev) => [...prev, user.id]);
        }
    };
    
    const handleSend = async () => {

        if (!title.trim() || !message.trim()) {
            showToast("Please fill all fields", "error")
            return;
        }

        if (mode === "direct" && selectedUsers.length === 0) {
            showToast("Please select users", "error");
            return;
        }

        try {
            setLoading(true);

            // PUBLIC ANNOUNCEMENT
            if (mode === "announcement") {
                const usersSnap = await getDocs(
                    collection(db, "users")
                );

                const batch = writeBatch(db);

                usersSnap.forEach((docSnap) => {
                    const user = docSnap.data();

                    if (user.role === "admin") return;
                    
                    const ref = doc(collection(db, "notifications"));

                    batch.set(ref, {
                        userId: docSnap.id,
                        type: "announcement",
                        title,
                        message,
                        isRead: false,
                        createdAt: serverTimestamp(),
                    });
                });

                await batch.commit();
            }

            // DIRECT MESSAGE
            else {
                const batch = writeBatch(db);

                selectedUsers.forEach((userId: string) => {

                    const ref = doc(collection(db, "notifications"));

                    batch.set(ref, {
                        userId: userId,
                        type: "admin-message",
                        title,
                        message,
                        reportId: reportId || null,
                        isRead: false,
                        createdAt: serverTimestamp(),
                    });
                });

                await batch.commit();
            }


            showToast("Notification sent successfully", "success");
            setSelectedUsers([]);
            setSearch("");
            setTitle("");
            setMessage("");
            onClose();
            
        } catch (error) {
            console.log(error);
            showToast("Failed to send notification", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">

            {/* MODAL */}
            <div
                className="w-full max-w-2xl rounded-[32px] overflow-hidden"
                style={{ backgroundColor: theme.card }}
            >

                {/* SCROLLABLE CONTENT */}
                <div className="max-h-[85vh] overflow-y-auto p-7">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">

                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-[24px]"
                                style={{
                                    backgroundColor:
                                        mode === "announcement"
                                            ? theme.secondary + "20"
                                            : theme.primary + "20",
                                }}
                            >
                                {mode === "announcement" ? (
                                    <Megaphone size={28} color={theme.secondary} />
                                ) : (
                                    <ShieldAlert size={28} color={theme.primary} />
                                )}
                            </div>

                            <div>
                                <h2
                                    className="text-3xl font-bold"
                                    style={{ color: theme.text }}
                                >
                                    {mode === "announcement"
                                        ? "Public Announcement"
                                        : "Send Notifications"}
                                </h2>

                                <p
                                    className="mt-2"
                                    style={{ color: theme.subText }}
                                >
                                    {mode === "announcement"
                                        ? "Broadcast message to all users"
                                        : "Send custom notifications message"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-xl p-2"
                            style={{ backgroundColor: theme.background }}
                        >
                            <X size={20} color={theme.text} />
                        </button>
                    </div>

                    <div className="space-y-6">

                        {/* USER SELECTOR */}
                        {mode === "direct" && (
                            <div>

                                <p
                                    className="mb-3 text-sm font-semibold"
                                    style={{ color: theme.subText }}
                                >
                                    Select Users
                                </p>

                                {/* SEARCH */}
                                <div>
                                    <AppInput
                                        icon={<Search size={18} color={theme.subText} />}
                                        placeholder="Search users..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                {/* SELECTED USERS */}
                                {selectedUsers.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-3">

                                        {selectedUsers.map((userId: string) => {

                                            const user = users.find(
                                                (u) => u.id === userId
                                            );

                                            if (!user) return null;

                                            return (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-3 rounded-full px-4 py-2"
                                                    style={{
                                                        backgroundColor:
                                                            theme.primary + "15",
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            user.profileImage ||
                                                            `https://ui-avatars.com/api/?name=${user.name}`
                                                        }
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />

                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: theme.text }}
                                                    >
                                                        {user.name}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            setSelectedUsers((prev) =>
                                                                prev.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        user.id
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <X
                                                            size={16}
                                                            color={theme.error}
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* USER LIST */}
                                <div
                                    className="mt-4 max-h-52 overflow-y-auto rounded-[24px] border p-3 space-y-2"
                                    style={{
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                    }}
                                >
                                    {filteredUsers.map((user: any) => {

                                        const selected =
                                            selectedUsers.includes(user.id);

                                        return (
                                            <button
                                                key={user.id}
                                                onClick={() => toggleUser(user)}
                                                className="flex w-full items-center justify-between rounded-2xl p-3 transition-all"
                                                style={{
                                                    backgroundColor: selected
                                                        ? theme.primary + "15"
                                                        : theme.card,
                                                }}
                                            >

                                                <div className="flex items-center gap-4">

                                                    <img
                                                        src={
                                                            user.profileImage ||
                                                            `https://ui-avatars.com/api/?name=${user.name}`
                                                        }
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />

                                                    <div className="text-left">
                                                        <p
                                                            className="font-semibold"
                                                            style={{
                                                                color: theme.text,
                                                            }}
                                                        >
                                                            {user.name}
                                                        </p>

                                                        <p
                                                            className="text-xs"
                                                            style={{
                                                                color:
                                                                    theme.subText,
                                                            }}
                                                        >
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                {selected && (
                                                    <div
                                                        className="flex h-8 w-8 items-center justify-center rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                theme.primary,
                                                        }}
                                                    >
                                                        <Check
                                                            size={16}
                                                            color="white"
                                                        />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TITLE */}
                        <div>
                            <p
                                className="mb-3 text-sm font-semibold"
                                style={{ color: theme.subText }}
                            >
                                Notification Title
                            </p>

                            <input
                                placeholder="Enter title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-14 w-full rounded-[24px] border px-5 outline-none"
                                style={{
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                }}
                            />
                        </div>

                        {/* MESSAGE */}
                        <div>
                            <p
                                className="mb-3 text-sm font-semibold"
                                style={{ color: theme.subText }}
                            >
                                Message
                            </p>

                            <textarea
                                placeholder="Write your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="h-36 w-full rounded-[24px] border p-5 outline-none resize-none"
                                style={{
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                }}
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-4 pt-2">

                            <AppButton
                                title="Cancel"
                                variant="outline"
                                onClick={onClose}
                            />

                            <AppButton
                                title={
                                    mode === "announcement"
                                        ? "Send Announcement"
                                        : "Send Notification"
                                }
                                loading={loading}
                                onClick={handleSend}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}