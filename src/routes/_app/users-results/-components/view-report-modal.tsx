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

// Helper for color mapping based on level/category
const getLevelColor = (level?: string) => {
    const l = level?.toLowerCase() || "";
    if (l.includes("high") || l === "completed") return "from-green-500 to-green-100";
    if (l.includes("moderate") || l === "average" || l === "pending") return "from-orange-400 to-orange-100";
    if (l.includes("low")) return "from-red-400 to-red-100";
    return "from-gray-400 to-gray-100";
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

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-foreground bg-gray-100/50 rounded-full px-4">
                Edit <IconUpdate className="h-3 w-3" />
            </Button>
        </div>
    );
}

function MetricSection({ title, data }: { title: string; data: any }) {
    if (!data) return null;
    const hasMetrics = data.metrics && Object.keys(data.metrics).length > 0;
    const hasIndicators = data.indicators && Object.keys(data.indicators).length > 0;

    if (!hasMetrics && !hasIndicators && !data.strength && !data.coach_recommendation) return null;

    return (
        <div className="space-y-4">
            <SectionHeader title={title} />

            {/* Snapshot Insight */}
            {data.snapshot_insight && (
                <p className="text-sm text-muted-foreground italic mb-4">
                    "{data.snapshot_insight}"
                </p>
            )}

            {/* Metrics */}
            {hasMetrics && (
                <div className="space-y-6">
                    {Object.entries(data.metrics).map(([key, item]: [string, any]) => (
                        <ProgressBar
                            key={key}
                            value={item.score}
                            label={item.level ? `${key.replace(/_/g, ' ')} (${item.level})` : key.replace(/_/g, ' ')}
                            gradientColor={getLevelColor(item.level)}
                        />
                    ))}
                </div>
            )}

            {/* Indicators */}
            {hasIndicators && (
                <div className="space-y-4">
                    {Object.entries(data.indicators).map(([key, item]: [string, any]) => (
                        <div key={key} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase tracking-tight text-foreground">{key.replace(/_/g, ' ')}</span>
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                    item.level === 'High' ? 'bg-green-50 text-green-700 border-green-100' :
                                        item.level === 'Moderate' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-red-50 text-red-700 border-red-100')}>
                                    {item.level} ({item.score}%)
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {item.signals?.map((signal: string, idx: number) => (
                                    <span key={idx} className="text-[10px] bg-white border border-gray-100 px-1.5 py-0.5 rounded text-muted-foreground">
                                        {signal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Strength */}
            {data.strength && (
                <div className="mt-4 p-4 rounded-xl bg-green-50/50 border border-green-100">
                    <h4 className="text-sm font-bold text-green-800 mb-1">Strength: {data.strength.title}</h4>
                    <p className="text-xs text-green-700 leading-relaxed">{data.strength.description}</p>
                </div>
            )}

            {/* Tradeoff */}
            {data.tradeoff && (
                <div className="mt-2 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                    <h4 className="text-sm font-bold text-orange-800 mb-1">Tradeoff: {data.tradeoff.title}</h4>
                    <p className="text-xs text-orange-700 leading-relaxed">{data.tradeoff.description}</p>
                </div>
            )}

            {/* Behavioral Patterns */}
            {data.behavioral_patterns && data.behavioral_patterns.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Behavioral Patterns</h4>
                    <div className="space-y-2">
                        {data.behavioral_patterns.map((bp: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                <p className="text-xs font-bold text-foreground mb-1">{bp.title}</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{bp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Coach Recommendation */}
            {data.coach_recommendation && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💡</span>
                        <h4 className="text-sm font-bold text-blue-800">Coach Recommendation</h4>
                    </div>
                    <p className="text-[11px] text-blue-700 leading-relaxed">{data.coach_recommendation}</p>
                </div>
            )}

            {/* Actionable Steps per section */}
            {data.actionable_steps && data.actionable_steps.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Actionable Steps</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.actionable_steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                                <span>{step.emoji}</span>
                                <span className="font-medium text-foreground">{step.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suitable For */}
            {data.suitable_for && data.suitable_for.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Suitable For</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {data.suitable_for.map((item: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-foreground shadow-xs">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function SummarySection({ summary }: { summary: any }) {
    if (!summary) return null;

    return (
        <div className="space-y-4">
            <SectionHeader title="Report Summary" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Mean Score</p>
                    <p className="text-xl font-bold text-foreground">{summary.mean_t_score}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Traits</p>
                    <p className="text-xl font-bold text-foreground">{summary.total_traits}</p>
                </div>
                {summary.dominant_traits && summary.dominant_traits.length > 0 && (
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center col-span-2">
                        <p className="text-[10px] font-bold uppercase text-green-700 mb-1">Dominant Traits</p>
                        <p className="text-sm font-bold text-green-800">{summary.dominant_traits.join(", ")}</p>
                    </div>
                )}
            </div>

            {summary.category_distribution && (
                <div className="mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Trait Distribution</h4>
                    <div className="flex gap-2">
                        {Object.entries(summary.category_distribution).map(([cat, count]: [string, any]) => (
                            <div key={cat} className="flex-1 p-2 rounded-xl bg-white border border-gray-100 text-center">
                                <p className="text-[10px] text-muted-foreground truncate">{cat}</p>
                                <p className="text-sm font-bold">{count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function BigFiveSection({ interpretations }: { interpretations: any }) {
    if (!interpretations) return null;

    return (
        <div className="space-y-4">
            <SectionHeader title="Big Five Personality Traits" />
            <div className="space-y-6">
                {Object.entries(interpretations).map(([key, item]: [string, any]) => (
                    <div key={key} className="space-y-2">
                        <ProgressBar
                            value={item.percentile || Math.round(item.raw_score * 100)}
                            label={`${item.label} (${item.category})`}
                            gradientColor={getLevelColor(item.category)}
                        />
                        <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                            {item.interpretation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ViewReportModal({
    open,
    onOpenChange,
    user,
    report,
}: ViewReportModalProps) {
    const fullResult = report?.full_result;
    const insights = fullResult?.insights || report?.free_result?.insights;

    const personalityTitle =
        insights?.title || "Personality Analysis";

    const personalityDescription = insights?.description ||
        insights?.story ||
        "No description available for this report.";

    return (
        <AppSheet
            open={open}
            onOpenChange={onOpenChange}
            title={report?.name ? `${report.name} - Report` : "View Report"}
        >
            <div className="space-y-8 pb-10">
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

                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6 whitespace-pre-line">
                        {personalityDescription}
                    </p>

                    {insights?.tags && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {insights.tags.map((tag, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                    <span>{tag.emoji}</span>
                                    <span>{tag.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="outline" className="rounded-full gap-2 px-6">
                        Edit <IconUpdate className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <div className="border-t border-dashed w-full" />

                {/* Summary Section */}
                {fullResult?.summary && (
                    <>
                        <SummarySection summary={fullResult.summary} />
                        <div className="border-t border-dashed w-full" />
                    </>
                )}

                {/* Big Five Traits */}
                {fullResult?.interpretations && (
                    <>
                        <BigFiveSection interpretations={fullResult.interpretations} />
                        <div className="border-t border-dashed w-full" />
                    </>
                )}

                {/* Insights Story/Quote */}
                {insights?.quote && (
                    <div className="relative p-6 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 overflow-hidden">
                        <span className="absolute top-0 right-4 text-6xl text-primary/10 font-serif">"</span>
                        <p className="relative z-10 text-base font-medium text-primary italic leading-relaxed">
                            {insights.quote}
                        </p>
                    </div>
                )}

                {insights?.story && (
                    <div className="space-y-4">
                        <SectionHeader title="Your Story" />
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {insights.story}
                        </p>
                        {insights.story_traits && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {insights.story_traits.map((trait: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg text-xs font-bold text-primary">
                                        <span>{trait.emoji}</span>
                                        <span>{trait.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {(insights?.quote || insights?.story) && (
                    <div className="border-t border-dashed w-full" />
                )}

                {/* dynamic Sections Based on Full Result */}
                {fullResult ? (
                    <div className="space-y-8">
                        <MetricSection title="Work Metrics" data={fullResult.work_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Audio Metrics" data={fullResult.audio_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Stress Metrics" data={fullResult.stress_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Learning Metrics" data={fullResult.learning_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Openness Metrics" data={fullResult.openness_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Creativity Metrics" data={fullResult.creativity_metrics} />
                        <div className="border-t border-dashed w-full" />
                        <MetricSection title="Relationship Metrics" data={fullResult.relationship_metrics} />
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        Detailed metrics are only available for full reports.
                    </div>
                )}
            </div>
        </AppSheet>
    );
}
