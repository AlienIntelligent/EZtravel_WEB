export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);

export const formatCompactCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} ty`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} tr`;
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return `${value}`;
};

export const formatDate = (value: string | number | Date) =>
    new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value));
