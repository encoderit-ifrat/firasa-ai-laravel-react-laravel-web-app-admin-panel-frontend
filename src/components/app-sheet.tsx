import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface AppSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
    className?: string; // For content styling
}

export default function AppSheet({
    open,
    onOpenChange,
    title,
    children,
    actions,
    className,
}: AppSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-[90vw] p-0 flex flex-col gap-0 sm:max-w-xl overflow-hidden rounded-lg data-[state=open]:rounded-lg"
            >
                <SheetHeader className="p-4 border-b space-y-0 bg-white z-10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full h-8 w-8 bg-gray-100 hover:bg-gray-200"
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </Button>
                            <SheetTitle>{title}</SheetTitle>
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </SheetHeader>

                <div className={cn("flex-1 overflow-y-auto p-6 space-y-8 bg-white", className)}>
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}
