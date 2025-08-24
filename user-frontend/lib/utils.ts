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

/**
 * Formats a date and time in a locale-aware way.
 * Example output: "Mon, August 15, 2025, 14:30" (en-US) or "Lun. 15 août 2025, 14:30" (fr-FR)
 *
 * @param dateInput - Date object, ISO string, or date string
 * @param locale - BCP 47 locale string (e.g., "en-US", "fr-FR")
 * @returns Formatted date and time string, or empty string if invalid
 */
export function formatDateAndTime(
    dateInput: Date | string,
    locale: string = "fr-FR"
): string {
    let date: Date;

    if (typeof dateInput === "string") {
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
    // Example: "Lun. 15 août 2025, 14:30" in fr-FR
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    let formattedDate = dateFormatter.format(date);
    let formattedTime = timeFormatter.format(date);

    // For French, abbreviate weekday with a dot and lowercase month
    if (locale.startsWith("fr")) {
        formattedDate = formattedDate.replace(/^(\w+)\s/, (match, p1) => {
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
        // Lowercase month (e.g., "Août" -> "août")
        formattedDate = formattedDate.replace(
            / ([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ][a-zàâäçéèêëîïôöùûüÿ]+)/,
            m => " " + m.slice(1).toLowerCase()
        );
    }

    return `${formattedDate}, ${formattedTime}`;
}

