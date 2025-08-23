"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import * as React from "react";
import { useLocale } from "next-intl";

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function LanguageSwitch() {
    const currentLocale = useLocale();
    const currentLanguage = languages.find(lang => lang.code === currentLocale);

    const handleLanguageChange = (newLocale: string) => {
        // Store preference in localStorage
        localStorage.setItem("preferred-language", newLocale);
        
        // Set cookie for server-side locale detection
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
        
        // Reload page to apply new locale
        window.location.reload();
    };

    React.useEffect(() => {
        // Set the current locale as cookie and localStorage if not already set
        const savedLocale = localStorage.getItem("preferred-language");
        if (!savedLocale) {
            localStorage.setItem("preferred-language", currentLocale);
            document.cookie = `locale=${currentLocale}; path=/; max-age=31536000`;
        } else if (savedLocale !== currentLocale) {
            // Update cookie to match localStorage preference
            document.cookie = `locale=${savedLocale}; path=/; max-age=31536000`;
            window.location.reload();
        }
    }, [currentLocale]);

    return (
        <Select.Root value={currentLocale} onValueChange={handleLanguageChange}>
            <Select.Trigger
                className={cn(
                    "border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                )}
                aria-label="Select language"
            >
                <GlobeIcon className="h-4 w-4" />
                <span className="hidden items-center gap-1 sm:inline-flex">
                    <span className="text-lg">{currentLanguage?.flag}</span>
                    <span>{currentLanguage?.name}</span>
                </span>
                <span className="text-lg sm:hidden">
                    {currentLanguage?.flag}
                </span>
                <Select.Icon asChild>
                    <ChevronDownIcon className="h-4 w-4" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className={cn(
                        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md"
                    )}
                    position="popper"
                    sideOffset={5}
                >
                    <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                        <ChevronDownIcon className="h-4 w-4 rotate-180" />
                    </Select.ScrollUpButton>

                    <Select.Viewport className="p-1">
                        {languages.map(language => (
                            <Select.Item
                                key={language.code}
                                value={language.code}
                                className={cn(
                                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                )}
                            >
                                <span className="text-lg">{language.flag}</span>
                                <Select.ItemText>
                                    {language.name}
                                </Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                        <ChevronDownIcon className="h-4 w-4" />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
