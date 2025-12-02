export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }

  const numAmount = Number(amount);

  // Handle negative numbers
  const isNegative = numAmount < 0;
  const absAmount = Math.abs(numAmount);

  let formattedAmount = '';
  let suffix = '';

  if (absAmount >= 10000000) { // 1 crore
    const crores = absAmount / 10000000;
    formattedAmount = crores >= 100 ? crores.toLocaleString('en-IN') : crores.toFixed(1);
    suffix = 'Cr';
  } else if (absAmount >= 100000) { // 1 lakh
    const lakhs = absAmount / 100000;
    formattedAmount = lakhs >= 100 ? lakhs.toLocaleString('en-IN') : lakhs.toFixed(1);
    suffix = 'L';
  } else if (absAmount >= 1000) {
    formattedAmount = absAmount.toLocaleString('en-IN');
  } else {
    formattedAmount = absAmount.toString();
  }

  // Remove unnecessary decimal places
  if (formattedAmount.endsWith('.0')) {
    formattedAmount = formattedAmount.slice(0, -2);
  }

  return `${isNegative ? '-' : ''}${formattedAmount}${suffix ? ' ' + suffix : ''}`;
}
