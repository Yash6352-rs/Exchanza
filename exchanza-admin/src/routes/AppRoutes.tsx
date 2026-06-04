import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import UsersPage from "../features/users/pages/UsersPage";
import UserDetailsPage from "../features/users/pages/UserDetailsPage";
import TagsPage from "../features/tags/pages/TagsPage";
import ModerationPage from "../features/moderation/screens/ModerationPage";
import PostDetailsPage from "../features/posts/PostDetailsPage";
import ReportsPage from "../features/report/pages/ReportsPage";
import TradeDetailsPage from "../features/trades/TradeDetailsPage";
import AdminNotificationsPage from "../features/notification/pages/AdminNotificationsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import AdminProfilePage from "../features/profile/pages/AdminProfilePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import AboutAccountPage from "../features/settings/pages/AboutAccountPage";
import EditProfilePage from "../features/profile/pages/EditProfilePage";
import ChangePasswordPage from "../features/settings/pages/ChangePasswordPage";
import AboutExchanzaPage from "../features/settings/pages/AboutExchanzaPage";
import PrivacyPolicyPage from "../features/settings/pages/PrivacyPolicyPage";
import AdminFAQPage from "../features/settings/pages/AdminFAQPage";
import ContactPage from "../features/settings/pages/ContactPage";
import AdminHelpSupportPage from "../features/settings/pages/AdminHelpSupportPage";
import AdminReportProblemPage from "../features/settings/pages/AdminReportProblemPage";
import AdminPrivilegesPage from "../features/settings/pages/AdminPrivilegesPage";
import ThemePreferencePage from "../features/settings/pages/ThemePreferencePage";
import LanguageSettingsPage from "../features/settings/pages/LanguageSettingsPage";
import NotificationSettingsPage from "../features/notification/pages/NotificationSettingsPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Auth */}
                <Route path="/" element={<LoginPage />}/>

                {/* Dashboard */}
                <Route 
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <DashboardPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* User Management */}
                <Route 
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <UsersPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* User Detail */}
                <Route 
                    path="/users/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <UserDetailsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Tag Management */}
                <Route 
                    path="/tags"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <TagsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Content Moderation */}
                <Route 
                    path="/moderation"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ModerationPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Post Detail */}
                <Route 
                    path="/posts/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <PostDetailsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Trade Detail */}
                <Route 
                    path="/trades/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <TradeDetailsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Analytics */}
                <Route 
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AnalyticsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Reported Content */}
                <Route 
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ReportsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                    
                {/* Notifications */}
                <Route 
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminNotificationsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                
                {/* Admin Profile */}
                <Route 
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminProfilePage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Settings */}
                <Route 
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <SettingsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* About Account */}
                <Route 
                    path="/settings/about-account"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AboutAccountPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Edit */}
                <Route 
                    path="/profile/edit"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <EditProfilePage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Change Password */}
                <Route 
                    path="/settings/change-password"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ChangePasswordPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Theme Preference */}
                <Route 
                    path="/settings/theme-preference"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ThemePreferencePage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Notifications Settings */}
                <Route 
                    path="/notifications/notifications-settings"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <NotificationSettingsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Language Settings */}
                <Route 
                    path="/settings/language-settings"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <LanguageSettingsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* About Exchanza */}
                <Route 
                    path="/settings/about-exchanza"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AboutExchanzaPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Privacy Policy */}
                <Route 
                    path="/settings/privacy-policy"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <PrivacyPolicyPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Privileges */}
                <Route 
                    path="/settings/admin-privileges"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminPrivilegesPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* FAQs*/}
                <Route 
                    path="/settings/faqs"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminFAQPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Help Support */}
                <Route 
                    path="/settings/help-support"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminHelpSupportPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Report Problem */}
                <Route 
                    path="/settings/report-problem"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminReportProblemPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Contact */}
                <Route 
                    path="/settings/contact"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ContactPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace/>}/>

            </Routes>
        </BrowserRouter>
    );
}