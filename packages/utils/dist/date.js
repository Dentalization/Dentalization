// Date and time utilities for Indonesian timezone
export const formatDate = (date, locale = 'id') => {
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};
export const formatTime = (date, locale = 'id') => {
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(date);
};
export const formatDateTime = (date, locale = 'id') => {
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(date);
};
export const getRelativeTime = (date, locale = 'id') => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        numeric: 'auto',
    });
    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    }
    else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    }
    else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    }
    else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }
};
export const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};
export const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
};
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
export const addMinutes = (date, minutes) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
};
export const getJakartaTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
};
//# sourceMappingURL=date.js.map