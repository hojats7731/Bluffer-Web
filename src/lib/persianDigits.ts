const WESTERN = "0123456789";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN[WESTERN.indexOf(d)] ?? d);
}
