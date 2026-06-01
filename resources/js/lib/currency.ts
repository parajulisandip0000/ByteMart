const nprFormatter = new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
});

export function formatNpr(value: string | number): string {
    return nprFormatter.format(Number(value)).replace('NPR', 'Rs.');
}
