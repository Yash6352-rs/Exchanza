import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export const useBlockedCheck = () => {
  const { userData } = useContext<any>(AuthContext);

  const isBlocked = userData?.isBlocked ?? false;

  const canCreatePost = !isBlocked;
  const canProposeTrade = !isBlocked;
  const canChat = !isBlocked;
  const canAcceptTrade = !isBlocked;
  const canRejectTrade = !isBlocked;
  const canCompleteTrade = !isBlocked;
  const canRateTrade = !isBlocked;
  const canDownloadInvoice = !isBlocked;
  const canReport = !isBlocked;

  return {
    isBlocked,

    canCreatePost,
    canProposeTrade,
    canChat,
    canAcceptTrade,
    canRejectTrade,
    canCompleteTrade,
    canRateTrade,
    canDownloadInvoice,
    canReport,
  };
};