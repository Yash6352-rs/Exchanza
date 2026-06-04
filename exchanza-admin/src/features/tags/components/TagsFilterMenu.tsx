/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter } from "lucide-react";
import type React from "react";

interface Props {
    filterOpen: boolean;
    setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sortType: string;
    setSortType: React.Dispatch<React.SetStateAction<string>>;
    theme: any;
}

export default function TagsFilterMenu({
    filterOpen,
    setFilterOpen,
    sortType,
    setSortType,
    theme,
}: Props) {

    const FILTERS = [
        {
            label: "Highest Used",
            value: "highest",
        },
        {
            label: "Lowest Used",
            value: "lowest",
        },
        {
            label: "Recently Created",
            value: "recent",
        },
        {
            label: "Alphabetical",
            value: "alphabetical",
        },
    ];

    return (

        <div className="relative">

            <button
                onClick={() =>
                    setFilterOpen(prev => !prev)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                    backgroundColor: theme.card,
                    border: `1px solid ${theme.border}`,
                    color: theme.subText,
                }}
            >
                <Filter size={16} />
                Filter
            </button>

            {filterOpen && (

                <div
                    className="absolute right-0 top-14 w-60 rounded-2xl p-2 z-50"
                    style={{
                        backgroundColor:
                            theme.card,

                        border:
                            `1px solid ${theme.border}`,

                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.12)",
                    }}
                >

                    {FILTERS.map((item) => (

                        <button
                            key={item.value}
                            onClick={() => {
                                setSortType(item.value);
                                setFilterOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-xl transition-all"
                            style={{
                                backgroundColor:
                                    sortType === item.value
                                        ? theme.highlight
                                        : "transparent",

                                color:
                                    sortType === item.value
                                        ? theme.primary
                                        : theme.text,
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}