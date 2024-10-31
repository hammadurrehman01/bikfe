export function convertDDMMYYYYToDate(date: string): Date {
  const splitDate = date.split('T');
  const stringDate = splitDate[0].toString();

  const [day, month, year] = stringDate.split('-');
  const dateObject = new Date(Number(year), Number(month) - 1, Number(day));
  return dateObject;
}
