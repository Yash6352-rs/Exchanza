/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

type Props = {
  trade: any;
};

export default function TradeHistoryItem({
  trade,
}: Props) {

  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-4 px-1 py-1">

      {/* Avatar */}
      {trade?.otherUser?.profileImage ? (

        <img
          src={trade?.otherUser?.profileImage}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (

        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" 
            style={{ backgroundColor: theme.primary + "20", color: theme.primary }}
        >
          {trade?.otherUser?.name?.charAt(0) || "U"}
        </div>

      )}

      {/* Info */}
      <div className="flex-1">

        <h3 className="text-lg font-medium" style={{ color: theme.text }}>
          {trade?.otherUser?.name || "User"}
        </h3>

        <p className="text-sm mt-1" style={{ color: theme.subText }}>
          Trade completed
        </p>

      </div>

      {/* Rating */}
      {trade.rating && (
        <div className="flex items-center gap-1">

          <Star size={16} fill={theme.secondary} color={theme.secondary} />

          <span style={{ color: theme.subText }}>
            {trade.rating}
          </span>

        </div>
      )}
    </div>
  );
}