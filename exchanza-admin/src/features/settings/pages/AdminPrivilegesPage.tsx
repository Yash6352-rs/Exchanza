/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "../../../hooks/useTheme";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../services/firebase/firebase";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

export default function AdminPrivilegesPage() {
    const { theme } = useTheme();

    const [adminData, setAdminData] = useState<any>(null);

    useEffect(() => {
        if (!auth.currentUser?.uid) return;
        
        const ref = doc(db, "users", auth.currentUser.uid);
        const unsub = onSnapshot(ref, (snap) => {
            setAdminData(snap.data());
        });

        return () => unsub();
    }, []);

    if (!adminData) return null;

    const privileges = [
        "Admin can view Dashboard that have details related to system",
        "Admin can block/unblock user account",
        "Admin can delete user account",
        "Admin can moderate create or delete tags",
        "Admin can view analytics and download report",
        "Admin can moderate content and delete posts/trades",
        "Admin can view system, user, post, and trade reports",
        "Admin can delete or send message to users from reports",
        "Admin can receive report notifications from users",
        "Admin can send public announcements to all users",
        "Admin can send personal custom messages to users",
        "Admin can report technical problems to developer",
    ];

    return (

        <div>
            <AppBreadcrumb
                items={[
                {
                    label: "Settings",
                    path: "/settings"
                },
                {
                    label: "Admin Privileges"
                }
                ]}
            />

             {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: theme.primary }}>
                        Admin Privileges
                    </h1>

                    <p className="mt-2" style={{ color: theme.subText }}>
                        View admin access and moderation
                        privileges across Exchanza.
                    </p>
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className="rounded-[32px] border p-8 mb-8 text-center"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
                <div className="mb-5">
                    <img src={adminData?.profileImage} alt="admin"
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4"
                        style={{ borderColor: theme.primary }}
                    />
                </div>

                <h2 className="text-3xl font-bold" style={{ color: theme.text }}>
                    {adminData?.name || "Admin"}
                </h2>

                <p className="mt-2" style={{ color: theme.subText }}>
                    {adminData?.email}
                </p>
            </div>

            {/* INFO */}
            <p className="text-center mb-8 max-w-4xl mx-auto leading-7"
                style={{ color: theme.subText }}
            >
                Admins manage platform moderation,
                analytics, reports, announcements,
                and user safety tools across Exchanza.
            </p>

            {/* Admin Privileges */}
            <div className="rounded-[32px] border p-5"
                style={{ backgroundColor: theme.card, borderColor: theme.border, }}
            >
                {privileges.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between px-3">
                            
                            <div className="flex items-center gap-4 mb-2.5">
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${theme.purple}12` }}
                                >  
                                    <ShieldCheck size={22} color={theme.purple} />
                                </div>  

                                <p className="font-medium text-[15px]"
                                    style={{ color: theme.text }}
                                >
                                    {item}
                                </p>
                            <CheckCircle2 size={24} color={theme.success} />

                            </div>  

                            {index !== privileges.length -1 && (
                                <div className="h-[1px]"
                                    style={{ backgroundColor: theme.border }}
                                />
                            )}
                        </div> 
                    </div>
                ))}
            </div>

        </div>
    );
}