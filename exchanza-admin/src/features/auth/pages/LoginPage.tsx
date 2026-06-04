import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../../services/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { lightColors } from "../../../components/constants/colors";
import exchanza_logo from "../../../assets/images/exchanza_logo.png";
import { AtSign, Lock, ShieldCheck } from "lucide-react";
import AppInput from "../../../components/common/AppInput";

export default function LoginPage() {

    const navigate = useNavigate();
    const { theme } = useTheme();
    const { showToast } = useToast();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            showToast("Please enter email and password", "error")
            return;
        }

        try {
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await signOut(auth);
                showToast("User not found", "error");
                return;
            }

            const userData = userSnap.data();

            if (userData.role !== "admin") {
                await signOut(auth);
                showToast("Unauthorized access", "error");
                return;
            }

            showToast("Welcome Admin", "success");
            navigate("/dashboard");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-5 py-8"
            style={{
                backgroundColor: theme?.background || lightColors.background,
            }}
        >

            <div
                className="w-full max-w-[1250px] grid grid-cols-1 lg:grid-cols-[0.95fr_1.2fr] overflow-hidden rounded-[38px]"
                style={{
                    backgroundColor: theme.card || lightColors.card,

                    border: `1px solid ${theme.border}`,

                    boxShadow:
                        theme.background === "#0B0F10"
                            ? "0 25px 60px rgba(0,0,0,0.45)"
                            : "0 25px 60px rgba(0,0,0,0.08)",
                }}
            >

                {/* LEFT PANEL */}
                <div
                    className="hidden lg:flex relative overflow-hidden flex-col justify-between px-14 py-14"
                    style={{
                        background:
                            "linear-gradient(145deg, #084C47 0%, #053A36 55%, #021B1A 100%)",
                    }}
                >

                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden">

                        <div
                            className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-10"
                            style={{
                                backgroundColor: "white",
                            }}
                        />

                        <div
                            className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-10"
                            style={{
                                backgroundColor: theme.secondary,
                            }}
                        />

                        <div
                            className="absolute inset-0 opacity-[0.08]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                                backgroundSize: "42px 42px",
                            }}
                        />
                    </div>

                    {/* Top Content */}
                    <div className="-mt-16">

                        {/* Logo */}
                        <div className="flex items-center -ml-8">
                            <img
                                src={exchanza_logo}
                                alt="logo"
                                className="w-44 h-52 object-contain"
                            />

                            <h2 className="text-[40px] font-black text-white tracking-tight">
                                Exchanza
                            </h2>
                        </div>

                        {/* Hero */}
                        <div className="max-w-md">

                            <h1 className="text-[56px] leading-[1.05] font-black text-white">
                                Admin Panel
                            </h1>

                            <p className="mt-7 text-lg leading-8 text-teal-50/80">
                                Manage users, monitor trades,
                                moderate content, analyze growth,
                                and control the Exchanza ecosystem.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Security Card */}
                    <div
                        className="relative z-10 rounded-[28px] p-6 backdrop-blur-xl"
                        style={{
                            backgroundColor:
                                "rgba(255,255,255,0.08)",

                            border:
                                "1px solid rgba(255,255,255,0.08)",
                        }}
                    >

                        <div className="flex items-center gap-3 mb-3">

                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)",
                                }}
                            >
                                <ShieldCheck
                                    size={20}
                                    color="white"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-white uppercase tracking-wide">
                                    Admin Integrity System
                                </p>

                                <p className="text-xs text-white/60 mt-1">
                                    Protected admin environment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="px-7 sm:px-12 lg:px-20 py-14 flex flex-col justify-center">

                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">

                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{
                                backgroundColor: theme.primary,
                            }}
                        >
                            <img
                                src={exchanza_logo}
                                alt="logo"
                                className="w-7 h-7 object-contain"
                            />
                        </div>

                        <h2
                            className="text-2xl font-black tracking-tight"
                            style={{ color: theme.primary }}
                        >
                            Exchanza
                        </h2>
                    </div>

                    {/* Header */}
                    <div className="mb-12">

                        <h2
                            className="text-5xl mt-2 font-black tracking-tight"
                            style={{ color: theme.text }}
                        >
                            Welcome Back
                        </h2>

                        <p
                            className="mt-3 text-base"
                            style={{ color: theme.subText }}
                        >
                            Sign in to continue to the admin dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6 max-w-xl">

                        {/* Email */}
                        <div>

                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3"
                                style={{ color: theme.subText }}
                            >
                                Email Address
                            </p>

                            <AppInput 
                                type="email"
                                placeholder="admin@exchanza.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<AtSign size={18} color={theme.subText} />}
                                className="h-[62px]"
                                style={{ backgroundColor: theme.background }}
                            />
                            
                        </div>

                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between mb-3">

                                <p
                                    className="text-[11px] font-bold uppercase tracking-[0.18em]"
                                    style={{ color: theme.subText }}
                                >
                                    Password
                                </p>

                                {/* <button
                                    className="text-xs font-semibold"
                                    style={{
                                        color: theme.primary,
                                    }}
                                >
                                    Forgot password?
                                </button> */}
                            </div>

                            <AppInput 
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock size={18} color={theme.text} />}
                                className="h-[62px]"
                                style={{ backgroundColor: theme.background }}
                            />

                        </div>

                        {/* Button */}
                        <div className="pt-4">

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full h-[62px] rounded-2xl font-bold text-white text-base transition-all hover:scale-[1.01] active:scale-[0.99]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #084C47 0%, #0D9488 100%)",

                                    boxShadow:
                                        "0 14px 30px rgba(13,148,136,0.25)",
                                }}
                            >

                                {loading ? "Signing In..."  : "Login to Dashboard"}
                            </button>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div
                        className="mt-14 pt-8 flex items-center gap-6 flex-wrap"
                        style={{
                            borderTop:
                                `1px solid ${theme.border}`,
                        }}
                    >

                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{
                                backgroundColor:
                                    theme.background,
                            }}
                        >

                            <ShieldCheck
                                size={15}
                                color={theme.primary}
                            />

                            <p
                                className="text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                    color: theme.subText,
                                }}
                            >
                                Security First
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <span
                                className="w-2.5 h-2.5 rounded-full animate-pulse"
                                style={{
                                    backgroundColor:
                                        theme.success,
                                }}
                            />

                            <p
                                className="text-xs font-medium"
                                style={{
                                    color: theme.subText,
                                }}
                            >
                                All systems operational
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}