"use client";

import { forwardRef, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type HybridDateInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const HybridDateInput = forwardRef<HTMLInputElement, HybridDateInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
        const dateInputRef = useRef<HTMLInputElement>(null);

        const handleIconClick = () => {
            if (dateInputRef.current) {
                // To open the native date picker programmatically
                try {
                    dateInputRef.current.showPicker();
                } catch {
                    dateInputRef.current.focus();
                }
            }
        };

        const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // When user picks from calendar, it comes as YYYY-MM
            const rawValue = e.target.value;
            if (rawValue) {
                // Format YYYY-MM to Month Year (e.g., "2024-05" -> "May 2024")
                const [year, month] = rawValue.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
                const formatted = formatter.format(date);

                // Construct a fake event to pass to the parent react-hook-form onChange
                const fakeEvent = {
                    target: { value: formatted }
                } as unknown as React.ChangeEvent<HTMLInputElement>;

                if (onChange) {
                    onChange(fakeEvent);
                }
            }
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type="text"
                    onChange={onChange}
                    value={value || ""}
                    className={`pr-10 ${className || ""}`}
                    {...props}
                />

                {/* Hidden native date/month picker used solely for the UI overlay */}
                <input
                    ref={dateInputRef}
                    type="month"
                    className="absolute inset-0 opacity-0 cursor-pointer w-[0px] h-[0px] pointer-events-none"
                    onChange={handleDateChange}
                    tabIndex={-1}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={handleIconClick}
                >
                    <CalendarIcon className="h-4 w-4" />
                </Button>
            </div>
        );
    }
);
HybridDateInput.displayName = "HybridDateInput";
