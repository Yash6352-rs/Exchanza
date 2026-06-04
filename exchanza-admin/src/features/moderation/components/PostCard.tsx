/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star, ArrowRight } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useNavigate } from "react-router-dom";

type Props = {
  post: any;
};

export default function PostCard({ post }: Props) {

  const { theme } = useTheme();
  const navigate = useNavigate();

  const isOffer = post.type === "offer";

  return (
    <div className="p-6 rounded-[28px] transition-all hover:scale-[1.01]" 
      style={{ backgroundColor: theme.card, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4"
        onClick={() => navigate(`/users/${post.userId}`)}
      >

        <div className="flex items-center gap-4">

          {post.userAvatar ? (
            <img
              src={post.userAvatar}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold" 
                style={{ backgroundColor: theme.primary + "20", color: theme.primary }}
            >
              {post.userName?.charAt(0)}
            </div>
          )}

          <div>

            <div className="flex items-center gap-2">

              <h3 className="text-xl font-semibold" style={{ color: theme.text }}>
                {post.userName || "User"}
              </h3>

              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.brown }} />

                <div className="flex items-center gap-1">

                  <Star size={16} color={theme.brown} fill={theme.brown} />

                  <span className="text-sm font-semibold" style={{ color: theme.brown }}>
                    {post.userRating?.toFixed(1) || "0.0"}
                  </span>

                  {(post.totalReviews ?? 0) > 0 && (
                    <span className="text-xs" style={{ color: theme.subText }}>
                      ({post.totalReviews})
                    </span>
                  )}
                </div>
              </div>

            <p className="text-sm mt-1" style={{ color: theme.subText }}>
              Exchanza User
            </p>
          </div>

        </div>
      </div>

      <div onClick={() => navigate(`/posts/${post.id}`)}>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-5 truncate" style={{ color: theme.tagText }}>
          {post.title}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">

          {post.tags?.map((tag: string, index: number) => (
              <div key={index} className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: theme.lightGray }}
              >
                  <span className="text-xs font-medium" style={{ color: theme.darkGray }}>
                      #{tag}
                  </span>
              </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">

          <div className="px-4 py-2 rounded-full" style={{ backgroundColor: theme.lightBrown }}>
            <span className="text-xs font-semibold" style={{ color: theme.brown }}>
              {isOffer ? "OFFER" : "REQUEST"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: theme.purple }}>
              View Details
            </span>
            <ArrowRight size={18} color={theme.purple} />
          </div>

        </div>
      </div>
    </div>
  );
}