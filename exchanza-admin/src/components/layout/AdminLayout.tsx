/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart3, Bell, Flag, LayoutDashboard, LogOut, Menu, Settings, ShieldAlert, Tags, UserCircle, Users, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../features/auth/services/authService";
import exchanza_logo from "../../assets/images/exchanza_logo.png"
import { auth, db } from "../../services/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { runBackgroundStatsSync } from "../../features/dashboard/services/backgroundStats";

type Props = {
    children: ReactNode;
}

const sideBarItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users Management",
        path: "/users",
        icon: Users,
    },
    {
        title: "Tags Management",
        path: "/tags",
        icon: Tags,
    },
    {
        title: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Content Moderation",
        path: "/moderation",
        icon: ShieldAlert,
    },
    {
        title: "Reports",
        path: "/reports",
        icon: Flag,
    },
    {
        title: "Notifications",
        path: "/notifications",
        icon: Bell,
    },
];

const bottomItems = [
    {
        title: "Profile",
        path: "/profile",
        icon: UserCircle,
    },
    {
        title: "Settings",
        path: "/settings",
        icon: Settings,
    },
    {
        title: "Logout",
        path: "/logout",
        icon: LogOut,
    },
];

export default function AdminLayout({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        runBackgroundStatsSync();
    }, []);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const ref = doc(db, "users", userId);

        const unsub = onSnapshot(ref, snap => {
            setAdmin({
                id: snap.id,
                ...snap.data()
            })
        })

        return () => unsub();
    }, []);
    
    return (
        <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
            className={`
                sticky top-0 h-screen
                bg-white border-r border-slate-200
                flex flex-col transition-all duration-300
                ${collapsed ? "w-[92px]" : "w-[270px]"}
            `}
        >

            {/* TOP */}
            <div className="pt-6 px-4 -mt-2.5">

                <div className="flex items-center justify-between">

                    {!collapsed && (
                        <div className="-ml-2 flex items-center gap-3">

                            <img
                                src={exchanza_logo}
                                alt="logo"
                                className="w-16 h-16 object-contain"
                            />

                            <h1 className="-ml-3 text-2xl font-black tracking-tight">
                                Exchanza
                            </h1>
                        </div>
                    )}

                    <button
                        onClick={() =>
                            setCollapsed(!collapsed)
                        }
                        className="w-11 h-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
                    >
                        {collapsed ? (
                            <Menu size={20} />
                        ) : (
                            <X size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* CENTER MENU */}
            <div className="flex-1 overflow-y-auto px-3">

                <div className="space-y-1">

                    {sideBarItems.map((item) => {

                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3 
                                    px-4 py-3.5 rounded-2xl 
                                    transition-all group

                                    ${
                                    isActive
                                        ? "bg-teal-700 text-white shadow-lg shadow-teal-100"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }
                                    `
                                }
                            >
                                <Icon size={20} />
                                {!collapsed && (
                                    <span className="font-medium text-[15px]">
                                        {item.title}
                                    </span>
                                )}
                            </NavLink>
                        )
                    })}
                </div>
            </div>

            {/* BOTTOM FIXED */}
            <div className="px-3 pb-3 pt-4 border-t border-slate-200 bg-white">

                {/* PROFILE CARD */}
                {!collapsed && (
                    <div className="mb-4">

                        <div className="bg-slate-100 rounded-3xl p-3 flex items-center gap-3">

                            <img
                                src={admin?.profileImage || ""}
                                alt="admin"
                                className="w-12 h-12 rounded-full object-cover"
                            />

                            <div className="min-w-0">

                                <p className="font-bold text-sm truncate">
                                    {admin?.name || "Admin User"}
                                </p>

                                <p className="text-xs text-slate-500 truncate">
                                    System Admin
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* BOTTOM MENU */}
                <div className="space-y-1">

                    {bottomItems.map((item) => {

                        const Icon = item.icon

                        // LOGOUT
                        if (item.title === "Logout") {

                            return (
                                <button
                                    key={item.title}
                                    onClick={async () => {

                                        await logoutAdmin()

                                        navigate("/")
                                    }}
                                    className="
                                        w-full flex items-center gap-3
                                        px-4 py-3.5 rounded-2xl
                                        hover:bg-red-50 text-red-500
                                        transition-all
                                    "
                                >

                                    <Icon size={20} />

                                    {!collapsed && (
                                        <span className="font-medium">
                                            Logout
                                        </span>
                                    )}
                                </button>
                            )
                        }

                        // NORMAL ITEMS
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    px-4 py-3.5 rounded-2xl
                                    transition-all

                                    ${
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }
                                    `
                                }
                            >

                                <Icon size={20} />

                                {!collapsed && (
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                )}
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {children}
        </main>
    </div>
    );
}