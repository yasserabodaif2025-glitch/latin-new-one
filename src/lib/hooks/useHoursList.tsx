/**
 * Returns an array of formatted hour strings within a given range and interval.
 *
 * If endHour is less than or equal to startHour, the range is treated as crossing midnight (e.g., 22 to 2 means 10:00 PM to 2:00 AM next day).
 *
 * @param params - The configuration object for the hours list.
 * @param params.startHour - The starting hour (in 24-hour format, e.g., 8 for 8:00 AM).
 * @param params.endHour - The ending hour (in 24-hour format, e.g., 18 for 6:00 PM).
 * @param params.intervalMinutes - The interval between times in minutes (e.g., 30 for half-hour steps).
 * @returns An array of strings in the format 'hh:mm AM/PM'.
 *
 * @example
 * useHoursList({ startHour: 22, endHour: 2, intervalMinutes: 60 })
 * // [ '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM' ]
 */
export interface UseHoursListParams {
  startHour: number
  endHour: number
  intervalMinutes?: number
}

const DEFAULT_INTERVAL_MINUTES = 30
const MINUTES_IN_HOUR = 60
const HOURS_IN_HALF_DAY = 12
const HOURS_IN_DAY = 24

export const useHoursList = ({
  startHour,
  endHour,
  intervalMinutes = DEFAULT_INTERVAL_MINUTES,
}: UseHoursListParams): string[] => {
  if (intervalMinutes <= 0) {
    throw new Error('Interval must be a positive number of minutes.')
  }

  // Support ranges that cross midnight
  const adjustedEndHour = endHour <= startHour ? endHour + HOURS_IN_DAY : endHour
  const totalSteps = Math.ceil(((adjustedEndHour - startHour) * MINUTES_IN_HOUR) / intervalMinutes)

  return Array.from({ length: totalSteps + 1 }, (_, i) => {
    const totalMinutes = startHour * MINUTES_IN_HOUR + i * intervalMinutes
    const hours24 = Math.floor(totalMinutes / MINUTES_IN_HOUR) % HOURS_IN_DAY
    const minutes = totalMinutes % MINUTES_IN_HOUR
    const period = hours24 >= HOURS_IN_HALF_DAY ? 'PM' : 'AM'
    const hours12 =
      hours24 % HOURS_IN_HALF_DAY === 0 ? HOURS_IN_HALF_DAY : hours24 % HOURS_IN_HALF_DAY
    const paddedHours = hours12.toString().padStart(2, '0')
    const paddedMinutes = minutes.toString().padStart(2, '0')
    return `${paddedHours}:${paddedMinutes} ${period}`
  })
}
