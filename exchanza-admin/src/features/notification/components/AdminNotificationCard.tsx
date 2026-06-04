import { ChevronDown, ChevronUp, ShieldAlert, Trash2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { deleteAdminNotification, markNotificationAsRead } from "../services/adminNotificationService";
import { getTimeAgo } from "../../../components/constants/time";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
    notification: any;
    onClick: () => void;
}

export default function AdminNotificationCard({ notification, onClick }: Props) {

    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(false);

    const getColor = () => {
        if (notification.type === "system") {
            return theme.red;
        }
        if (notification.type === "user") {
            return theme.darkGray;
        }
        if (notification.type === "post") {
            return theme.brown;
        }
        return theme.purple;
    };

    const getLabel = () => {
        if (notification.type === "system") {
            return "System Report";
        }
        if (notification.type === "user") {
            return "User Report";
        }
        if (notification.type === "post") {
            return "Post Report";
        }
        return "Trade Report";
    };

    const getTitle = () => {
        if (notification.type === "system") {
            return "New System Report";
        }
        if (notification.type === "user") {
            return "New User Report";
        }
        if (notification.type === "post") {
            return "New Post Report";
        }
        return "New Trade Report";
    }

    // SWIPE DELETE
    const handlers = useSwipeable({

        onSwipedLeft: async () => {
            await deleteAdminNotification(notification.id);
        },
        onSwipedRight: async () => {
            await deleteAdminNotification(notification.id);
        },
        trackMouse: true,
    })

    return (
        <div {...handlers}>
            <div className="w-full rounded-[28px] border p-6 transition-all"
                style={{
                    backgroundColor: notification.isRead ? theme.card : theme.highlight,
                    borderColor: theme.border,
                }}
            >
                {/* TOP */}
                <div className="flex items-start justify-between">

                    {/* LEFT */}
                    <button
                        onClick={onClick}
                        className="flex flex-1 gap-4 text-left"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: getColor() + "20" }}
                        >
                            <ShieldAlert size={24} color={getColor()}/>
                        </div>

                        <div className="flex-1">

                            <div className="flex items-center gap-4 flex-wrap">
                                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                                    {getTitle()}
                                </h3>

                                <div className="rounded-full px-3 py-1 text-xs font-semibold"
                                    style={{ backgroundColor: getColor() + "20", color: getColor() }}
                                >
                                    {getLabel()}
                                </div>
                          
                                {!notification.isRead && (
                                    <div className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: theme.primary }}
                                    />
                                )}
                            </div>

                            <p className="text-[13px] mt-1" style={{ color: theme.subText }}>
                                {getTimeAgo(notification.createdAt)}
                            </p>

                        </div>
                    </button>

                    {/* RIGHT */}
                    <div className="flex items-center justify-center gap-3 ml-4">

                        {/* MARK READ
                        {!notification.isRead && (

                            <button
                                onClick={async () => {
                                    await markNotificationAsRead( notification.id);
                                }}
                                className="p-2 rounded-xl"
                            >
                                <CheckCheck size={18} color={theme.primary} />
                            </button>
                        )} */}

                        {/* DELETE */}
                        <button
                            onClick={async () => {
                                await deleteAdminNotification( notification.id);
                            }}
                            className="p-2 rounded-xl"
                        >
                            <Trash2 size={18} color={theme.error} />
                        </button>

                        {/* EXPAND */}
                        <button onClick={() =>  setExpanded(!expanded)}>
                            {expanded ? (
                                <ChevronUp size={20} color={theme.primary}/>
                            ) : (
                                <ChevronDown size={20} color={theme.primary}/>
                            )}
                        </button>

                    </div>
                </div>

                {/* EXPANDED */}
                {expanded && (
                    <div className="mt-3 ml-[70px] order-t" style={{ borderColor: theme.border }} >
                        <p className="leading-7"
                            style={{ color: theme.subText }}
                        >
                            {notification.message}
                        </p>

                        {!notification.isRead && (
                            <button 
                                onClick={async () => {
                                    await markNotificationAsRead(notification.id);
                                }}
                                className="text-[15px] mt-2.5"
                                style={{ color: theme.primary }}
                            >
                                Mark as read
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}