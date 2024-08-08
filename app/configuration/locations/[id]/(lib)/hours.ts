import { capitalize } from "@/app/(lib)/utils/utils";

export const daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function getWeekday(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');

  return capitalize(daysInWeek[date.getDay()]);
}
