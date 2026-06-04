export const getTimeAgo = (timestamp: any) => {
  if (!timestamp) return "Just now";

  const now = new Date();

  // handle both Firestore + number
  const created = 
    typeof timestamp === "number" 
      ? new Date(timestamp) 
      : timestamp.toDate();
      
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return "Now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month ago`;

  const years = Math.floor(days / 365);
  return `${years} year ago`;
};