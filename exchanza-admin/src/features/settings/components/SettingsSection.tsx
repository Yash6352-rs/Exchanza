/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    title: string;
    children: React.ReactNode;
    theme: any;
};

export default function SettingsSection({
    title, children, theme,
}: Props) {

    return (
        <div className="mb-7">

            <h2 className="text-sm mb-3 px-2 font-medium"
                style={{color: theme.subText }}
            >
                {title}
            </h2>

            <div className="rounded-[28px] overflow-hidden border"
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                }}
            >
                {children}
            </div>

        </div>
    );
}
