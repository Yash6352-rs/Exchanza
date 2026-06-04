import type React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string
  path?: string
}

type Props = {
  items: BreadcrumbItem[]
  showSearch?: boolean
  search?: string
  onSearchChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  searchPlaceholder?: string
}

export default function AppBreadcrumb({
    items, showSearch = false, search, onSearchChange, searchPlaceholder = "Search..."
}: Props) {

    const navigate = useNavigate();
    const { theme } = useTheme();

    return (

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8'>

            {/* Left */}
            <div className='flex items-center gap-3 flex-wrap'>

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className='w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105'
                    style={{
                        backgroundColor: theme.card,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <ArrowLeft size={18} color={theme.subText} />
                </button>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {items.map((item, index) => {

                        const isLast = index === items.length - 1;

                        return (
                            <div key={index} className="flex items-center gap-2">
                                <button
                                    disabled={!item.path}
                                    onClick={() => 
                                        item.path && navigate(item.path)
                                    }
                                    className="text-base font-semibold transition-all"
                                    style={{
                                        color: isLast ? theme.primary : theme.subText,
                                        cursor: item.path ? "pointer" : "default"
                                    }}  
                                >
                                    {item.label}
                                </button>

                                {!isLast && (
                                    <ChevronRight size={16} color={theme.subText} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Search */}
            {showSearch && (
                <div className="w-full max-w-md">

                    <input 
                        value={search}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        className="w-full px-5 py-3 rounded-[100px] outline-none text-sm"
                        style={{
                            backgroundColor: theme.card,
                            border: `1px solid ${theme.border}`,
                            color: theme.text
                        }}
                    />
                </div>
            )}
        </div>
    );
}