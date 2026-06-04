import { useTheme } from "../../../hooks/useTheme";
import { useNavigate } from "react-router-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  trade: any;
}

export default function AdminTradeCard({ trade, }: Props) {

    const { theme } = useTheme();
    const navigate = useNavigate();

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

    return (
        <>
            <div 
                onClick={() => navigate(`/trades/${trade.id}`)}
                className="rounded-[28px] border p-6 shadow-sm" 
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
                {/* TOP */}
                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm font-bold" style={{ color: theme.primary }}>
                            TRADE #{trade.id.slice(0, 6)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="flex -space-x-3">
                            <img
                                src={trade.fromUserAvatar}
                                className="w-10 h-10 rounded-full border-2 object-cover"
                                onClick={() => navigate(`/users/${trade.fromUserId}`)}
                            />

                            <img
                                src={trade.toUserAvatar}
                                className="w-10 h-10 rounded-full border-2 object-cover"
                                onClick={() => navigate(`/users/${trade.toUserId}`)}
                            />
                        </div>
                    </div>
                </div>

                {/* USERS */}
                <div className="flex items-center gap-3 mt-4">

                    <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
                        {trade.fromUserName} ↔ {trade.toUserName}
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
            </div>
        </>
    );
}