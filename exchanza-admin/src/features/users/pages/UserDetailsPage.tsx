/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Star, FileText, Handshake, Flag, ArrowRight, ChevronUp, ChevronDown, Mail } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { db } from "../../../services/firebase/firebase";
import { getUserPosts, getUserReports, getUserTrades } from "../services/userService";
import Loader from "../../../components/common/Loader";
import StatsCard from "../../../components/common/StatsCard";
import PostCard from "../../moderation/components/PostCard";
import EmptyState from "../../../components/common/EmptyState";
import TradeHistoryItem from "../components/TradeHistoryItem";
import AppBreadcrumb from "../../../components/common/AppBreadcrumb";

export default function UserDetailsPage() {

  const { theme } = useTheme();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  const [showAllTrades, setShowAllTrades] = useState(false);

  const activePosts = posts.filter((post: any) => 
    post.status !== "completed" 
  );

  const completedTrades = trades.filter((trade: any) =>
    trade.status === "completed"
  );

  const visibleTrades = showAllTrades ? completedTrades : completedTrades.slice(0, 5);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {

        setLoading(true);

        const userSnap = await getDoc(
          doc(db, "users", id)
        );

        if (userSnap.exists()) {
          setUser({
            id: userSnap.id,
            ...userSnap.data(),
          });
        }

        const userPosts = await getUserPosts(id);
        const userTrades = await getUserTrades(id);
        const userReports = await getUserReports(id);

        setPosts(userPosts);
        setTrades(userTrades);
        setReports(userReports);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <AppBreadcrumb 
        items={[
          {
            label: "User Management",
            path: "/users"
          },
          {
            label: "User Details"
          }
        ]}
      />

      {/* Header */}
      <div className="items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
            User Details
          </h1>

          <p className="mt-2" style={{ color: theme.subText }}>
            Manage user profile and activity
          </p>
        </div>

      </div>

     {/* PROFILE CARD */}
<div
  className='rounded-[32px] border overflow-hidden'
  style={{
    backgroundColor: theme.card,
    borderColor: theme.border
  }}
>
  {/* TOP */}
  <div className='p-8'>

    <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8'>

      {/* LEFT */}
      <div className='flex flex-col sm:flex-row gap-6'>

        {/* IMAGE */}
        <div className='relative'>
          <img
            src={user?.profileImage}
            alt='avatar'
            className='w-32 h-32 rounded-full object-cover'
          />

          {/* ONLINE STATUS */}
          <div
            className='absolute bottom-2 right-2 w-5 h-5 rounded-full border-4'
            style={{
              backgroundColor: user?.isBlocked
                ? theme.error
                : theme.success,

              borderColor: theme.card
            }}
          />
        </div>

        {/* USER INFO */}
        <div>

          {/* NAME + BADGES */}
          <div className='flex flex-wrap items-center gap-3'>

            <h2
              className='text-4xl font-black'
              style={{ color: theme.text }}
            >
              {user?.name}
            </h2>

            <div
              className='h-8 px-4 rounded-full flex items-center text-xs font-bold'
              style={{
                backgroundColor:
                  user?.role === 'admin'
                    ? theme.purple
                    : theme.lightGray,

                color:
                  user?.role === 'admin'
                    ? 'white'
                    : theme.darkGray
              }}
            >
              {user?.role.toUpperCase()}
            </div>

            <div
              className='h-8 px-4 rounded-full flex items-center text-xs font-bold'
              style={{
                backgroundColor:
                  user?.isBlocked
                    ? theme.error + "20"
                    : theme.success + "20",

                color: user?.isBlocked
                    ? theme.error + "20"
                    : theme.success,
              }}
            >
              {user?.isBlocked ? 'BLOCKED' : 'ACTIVE'}
            </div>
          </div>

          {/* EMAIL */}
          <div
            className='flex items-center gap-3 mt-5'
            style={{ color: theme.subText }}
          >
            <Mail size={18} />

            <span className='text-[15px] font-medium'>
              {user?.email}
            </span>
          </div>

          {/* RATING */}
          <div
            className='flex items-center gap-3 mt-3'
            style={{ color: theme.text }}
          >
            <Star size={18} color={theme.yellow}/>
            

            <span className='text-lg font-semibold'>
              {user?.rating || 0}

              <span
                className='ml-2 text-base font-medium'
                style={{ color: theme.subText }}
              >
                ({user?.totalReviews || 0} reviews)
              </span>
            </span>
          </div>

        </div>
      </div>
    
    </div>
  </div>

  {/* BIO */}
  <div className='px-8 py-7 border-t'
    style={{  borderColor: theme.border}}
  >
    {/* SKILLS */}
      <div>
        <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          Skills
        </h3>
        <div className='flex flex-wrap gap-4 items-center'>
          {user?.skills?.length > 0 ? (
            user.skills.map((skill: string, index: number) => (

              <div
                key={index}
                className='px-5 h-12 rounded-2xl text-sm font-semibold flex items-center'
                style={{
                  backgroundColor: theme.tagBg,
                  color: theme.tagText
                }}
              >
                #{skill}
              </div>
            ))
          ) : (
            <p style={{ color: theme.subText }}>
              No skills added
            </p>
          )}

        </div>
      </div>
  </div>

  {/* BIO */}
  <div
    className='px-8 py-7 border-t'
    style={{
      borderColor: theme.border
    }}
  >
    <h3
      className='text-2xl font-bold mb-4'
      style={{ color: theme.text }}
    >
      Bio
    </h3>

    <p
      className='leading-8 text-[16px] max-w-6xl'
      style={{ color: theme.subText }}
    >
      {user?.bio || 'No bio added'}
    </p>
  </div>

</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <StatsCard
          title="Posts"
          value={posts.length}
          icon={<FileText size={24} color="white" />}
          color={theme.primary}
        />

        <StatsCard
          title="Trades"
          value={trades.length}
          icon={<Handshake size={24} color="white" />}
          color={theme.secondary}
        />

        <StatsCard
          title="Reports"
          value={reports.length}
          icon={<Flag size={24} color="white" />}
          color={theme.error}
        />
      </div>

      {/* Active Posts */}
      <div className="mt-8 rounded-[28px] p-6" style={{ backgroundColor: theme.card }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">

            <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                Active Posts
            </h2>
            <ArrowRight size={20} color={theme.text} />
        </div>

        {activePosts && activePosts.length > 0 ? (

            <div className="flex gap-5 overflow-x-auto pb-2">
                {activePosts.map((post: any) => (
                    <div
                        key={post.id}
                        className="min-w-[340px] max-w-[340px] border rounded-[28px]" 
                        style={{ borderColor: theme.subText + "40" }}
                    >
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        ) : (
            <EmptyState 
                title="No active posts"      
                description="User has not created any active posts"
            />
        )}
      </div>

      {/* Completed Trades */}
      <div className="mt-8 rounded-[28px] p-6" style={{ backgroundColor: theme.card }}>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-5" style={{ color: theme.text}}>
            Completed Trades
        </h2>

        <div key={showAllTrades ? "all" : "less"}>
            {completedTrades && completedTrades.length > 0 ? (
                
                <div className="space-y-4">

                    {visibleTrades.map((trade: any) => (
                        <TradeHistoryItem 
                            key={trade.id}
                            trade={trade}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No completed trades"
                    description="User have not completed any trade"
                />
            )}

            {completedTrades.length > 5 && (
                <button 
                    onClick={() => setShowAllTrades(!showAllTrades)}
                    className="mt-5 flex items-center justify-center gap-2 w-full"
                >
                    <span className="font-semibold" style={{ color: theme.primary }}>
                        {showAllTrades ? "Show Less" : "Show More"}
                    </span>

                    {showAllTrades ? (
                        <ChevronUp size={18} color={theme.primary} />
                    ) : (
                        <ChevronDown size={18} color={theme.primary} />
                    )}
                </button>
            )}

        </div>
      </div>

      {/* Reports Section */}
      <div className="mt-8 rounded-[28px] p-6" style={{ backgroundColor: theme.card }}>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-5" style={{ color: theme.text }}>
          User Reports
        </h2>

        {reports && reports.length > 0 ? (

          <div className="space-y-4">
            {reports.map((report: any) => (

              <div
                key={report.id}
                className="border rounded-[24px] p-5" 
                style={{ borderColor: theme.border }}  
              >
                <div className="flex items-start justify-between">

                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                      {report.title}
                    </h3>

                    <p className="mt-2 leading-7" style={{ color: theme.subText }}>
                      {report.description}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: report.status === "open" 
                          ? theme.error
                          : theme.success,
                      color:"white"
                    }}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No reports found"
            description="This user has not been reported"
          />
        )}

      </div>
    </div>
  );
}