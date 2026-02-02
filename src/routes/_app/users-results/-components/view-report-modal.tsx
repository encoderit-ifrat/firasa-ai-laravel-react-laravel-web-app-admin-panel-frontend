import AppSheet from "../../../../components/app-sheet";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { cn } from "../../../../lib/utils";
import IconUpdate from "../../../../components/svg-icon/icon-update";
import type { TUserReportSchema } from "../-type/users-results";

interface ViewReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        name: string;
        avatar?: string;
    };
    report?: TUserReportSchema | null;
}

// Dummy data for the report
const REPORT_DATA = {
    personalityTitle: "Visionary Pathfinder",
    personalityDescription:
        "Your facial cues suggest a natural openness and curiosity, often seen in individuals who enjoy exploring new ideas and connecting with others. This is just the surface – your premium report reveals the full depth and nuances.",
    strengths: [
        { label: "Openness to Experience (High)", value: 91, color: "from-green-500 to-green-100" },
        { label: "Intellectual Curiosity (High)", value: 87, color: "from-green-500 to-green-100" },
    ],
    growthAreas: [
        { label: "Risk Tolerance (Moderate)", value: 47, color: "from-orange-400 to-orange-100" },
        { label: "Structured Learning Preference (Low)", value: 25, color: "from-red-400 to-red-100" },
    ],
};

function ProgressBar({
    value,
    label,
    gradientColor,
}: {
    value: number;
    label: string;
    gradientColor: string;
}) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between pb-1">
                <div className="relative w-full h-8 bg-white border rounded-lg overflow-hidden flex items-center">
                    <div
                        className={cn("h-full absolute left-0 top-0 bg-linear-to-r", gradientColor)}
                        style={{ width: `${value}%` }}
                    />
                    <span className="relative z-10 pl-3 text-xs font-bold text-white drop-shadow-md">
                        {value}%
                    </span>
                </div>
            </div>
            <p className="text-xs text-muted-foreground pl-1">{label}</p>
        </div>
    );
}

function SectionHeader({ title }: { title: string; onEdit?: () => void }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-foreground bg-gray-100/50 rounded-full px-4">
                Edit <IconUpdate className="h-3 w-3" />
            </Button>
        </div>
    );
}

export default function ViewReportModal({
    open,
    onOpenChange,
    user,
    report,
}: ViewReportModalProps) {
    const personalityTitle = report?.full_result?.insights?.title ||
        report?.free_result?.insights?.title ||
        report?.personality_type ||
        REPORT_DATA.personalityTitle;

    const personalityDescription = report?.full_result?.insights?.description ||
        report?.free_result?.insights?.description ||
        REPORT_DATA.personalityDescription;

    return (
        <AppSheet
            open={open}
            onOpenChange={onOpenChange}
            title="View Report"
        >
            {/* Personality Profile */}
            <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                </div>

                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Personality</p>
                <h2 className="text-2xl font-bold mb-3">{personalityTitle}</h2>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                    {personalityDescription}
                </p>

                <Button variant="outline" className="rounded-full gap-2 px-6">
                    Edit <IconUpdate className="h-3.5 w-3.5" />
                </Button>
            </div>

            <div className="border-t border-dashed w-full" />

            {/* Strengths */}
            <div>
                <SectionHeader title="Strengths" />
                <div className="space-y-6">
                    {REPORT_DATA.strengths.map((item, index) => (
                        <ProgressBar
                            key={index}
                            value={item.value}
                            label={item.label}
                            gradientColor={item.color}
                        />
                    ))}
                </div>
            </div>

            {/* Growth Areas */}
            <div>
                <SectionHeader title="Growth Areas" />
                <div className="space-y-6">
                    {REPORT_DATA.growthAreas.map((item, index) => (
                        <ProgressBar
                            key={index}
                            value={item.value}
                            label={item.label}
                            gradientColor={item.color}
                        />
                    ))}
                </div>
            </div>

            {/* Worth Sharing */}
            <div>
                <SectionHeader title="Worth sharing" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-xl bg-linear-to-br from-green-500/20 to-green-600/20 border border-green-100 flex items-end p-3 relative overflow-hidden">
                        <span className="font-bold text-green-700">91%</span>
                    </div>
                    <div className="h-24 rounded-xl bg-linear-to-br from-green-500/20 to-green-600/20 border border-green-100 flex items-end p-3 relative overflow-hidden">
                        <span className="font-bold text-green-700">91%</span>
                    </div>
                </div>
            </div>
        </AppSheet>
    );
}
