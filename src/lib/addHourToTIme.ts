export function addHoursToTime(time: string, hoursToAdd: number): string {
  // Split the input time into hours and minutes
  const [hoursStr, minutesStr] = time.split(':')
  const startHours = parseInt(hoursStr, 10)
  const startMinutes = parseInt(minutesStr, 10)

  // Convert start time to total minutes
  const totalStartMinutes = startHours * 60 + startMinutes

  // Convert hoursToAdd to minutes
  const addedMinutes = hoursToAdd * 60

  // Total minutes after adding
  const totalEndMinutes = totalStartMinutes + addedMinutes

  // Wrap around 24 hours
  const wrappedMinutes = totalEndMinutes % (24 * 60)

  // Get final hours and minutes
  const endHours = Math.floor(wrappedMinutes / 60)
  const endMinutes = wrappedMinutes % 60

  // Format with leading zero if needed
  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(endHours)}:${pad(endMinutes)}`
}
