import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
    // Get locale from cookies, default to French for Côte d'Ivoire
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || 'fr';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
