// Currency formatting for Indonesian Rupiah
export const formatCurrency = (
  amount: number,
  locale: 'id' | 'en' = 'id',
  showSymbol: boolean = true
): string => {
  const formatter = new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove all non-digit characters except dots and commas
  const cleaned = value.replace(/[^\d.,]/g, '');

  // Handle Indonesian number format (1.000.000,50) vs US format (1,000,000.50)
  const hasCommaAsDecimal =
    cleaned.includes(',') &&
    cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.');

  if (hasCommaAsDecimal) {
    // Indonesian format: replace dots (thousands) and comma (decimal)
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  } else {
    // US format: remove commas (thousands)
    return parseFloat(cleaned.replace(/,/g, ''));
  }
};

export const formatNumber = (
  number: number,
  locale: 'id' | 'en' = 'id',
  decimals: number = 0
): string => {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatPercentage = (
  value: number,
  locale: 'id' | 'en' = 'id',
  decimals: number = 1
): string => {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Convert amount to words (useful for invoices)
export const numberToWords = (
  amount: number,
  locale: 'id' | 'en' = 'id'
): string => {
  // This is a simplified version - in production, you'd want a more complete implementation
  const ones =
    locale === 'id'
      ? [
          '',
          'satu',
          'dua',
          'tiga',
          'empat',
          'lima',
          'enam',
          'tujuh',
          'delapan',
          'sembilan',
        ]
      : [
          '',
          'one',
          'two',
          'three',
          'four',
          'five',
          'six',
          'seven',
          'eight',
          'nine',
        ];

  const teens =
    locale === 'id'
      ? [
          'sepuluh',
          'sebelas',
          'dua belas',
          'tiga belas',
          'empat belas',
          'lima belas',
          'enam belas',
          'tujuh belas',
          'delapan belas',
          'sembilan belas',
        ]
      : [
          'ten',
          'eleven',
          'twelve',
          'thirteen',
          'fourteen',
          'fifteen',
          'sixteen',
          'seventeen',
          'eighteen',
          'nineteen',
        ];

  const tens =
    locale === 'id'
      ? [
          '',
          '',
          'dua puluh',
          'tiga puluh',
          'empat puluh',
          'lima puluh',
          'enam puluh',
          'tujuh puluh',
          'delapan puluh',
          'sembilan puluh',
        ]
      : [
          '',
          '',
          'twenty',
          'thirty',
          'forty',
          'fifty',
          'sixty',
          'seventy',
          'eighty',
          'ninety',
        ];

  // For now, return a placeholder - implement full conversion as needed
  return locale === 'id' ? 'Belum diimplementasi' : 'Not implemented';
};
