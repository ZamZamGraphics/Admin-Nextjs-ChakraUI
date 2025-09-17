import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateStr) {
  if (!dateStr) return;
  const [day, month, year] = dateStr.split("-").map(Number);
  const dateNow = new Date(year, month - 1, day);
  return dayjs(dateNow).format();
}

export function totalPayment(paymentHistory) {
  const totalAmount = paymentHistory.reduce((accumulator, payment) => {
    return accumulator + payment.amount;
  }, 0);
  return totalAmount;
}
