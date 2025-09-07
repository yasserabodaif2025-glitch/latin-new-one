export function parseTime(timeString: string): string {
  // Validate and parse the input string using regex
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i
  const match = timeString.match(timeRegex)

  if (!match) {
    throw new Error("Invalid time format. Expected format: 'hh:mm am/pm'")
  }

  const [, hoursStr, minutesStr, period] = match
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  // Convert to 24-hour format
  if (period.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12 // Convert PM time to 24-hour format
  }
  if (period.toLowerCase() === 'am' && hours === 12) {
    hours = 0 // Midnight case (12 AM becomes 00:00)
  }

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  return `${formattedHours}:${formattedMinutes}:00`
}
