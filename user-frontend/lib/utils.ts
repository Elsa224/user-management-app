import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(
    dateInput: string | Date,
    locale: string = "default"
): string {
    let date: Date;
    if (typeof dateInput === "string") {
        // Try to parse as ISO, fallback to Date constructor
        date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            // Try parsing as MM/DD/YYYY
            const parts = dateInput.split(/[\/\-\.]/);
            if (parts.length === 3) {
                // Assume MM/DD/YYYY
                const [month, day, year] = parts.map(Number);
                date = new Date(year, month - 1, day);
            }
        }
    } else {
        date = dateInput;
    }

    if (isNaN(date.getTime())) return "";

    // Use Intl.DateTimeFormat for locale-aware formatting
    // Example: "Lun. 15 aout 2025" in fr-FR
    const formatter = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    let formatted = formatter.format(date);

    // For French, abbreviate weekday with a dot (e.g., "lun." instead of "lun")
    if (locale.startsWith("fr")) {
        formatted = formatted.replace(/^(\w+)\s/, (match, p1) => {
            // Add dot if not already present
            if (!p1.endsWith("."))
                return (
                    p1.charAt(0).toUpperCase() +
                    p1.slice(1, 3) +
                    ". " +
                    p1.slice(3)
                );
            return match;
        });
        // Lowercase month (e.g., "Août" -> "aout" or "août")
        formatted = formatted.replace(
            / ([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ][a-zàâäçéèêëîïôöùûüÿ]+)/,
            m => " " + m.slice(1).toLowerCase()
        );
    }

    return formatted;
}
