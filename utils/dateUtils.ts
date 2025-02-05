import { format, toZonedTime } from "date-fns-tz";

export const formatToBangkokTime = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const timeZone = "Asia/Bangkok";
  const zonedDate = toZonedTime(date, timeZone);

  return format(zonedDate, "dd MMM HH:mm:ss", { timeZone });
};