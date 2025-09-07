export function formatToAmPm(timeString: string): string {
  const timeStringWithoutSeconds = timeString.slice(0, 5)
  // Validate and parse the input string using regex
  const timeRegex = /^(\d{2}):(\d{2})$/
  const match = timeStringWithoutSeconds.match(timeRegex)

  if (!match) {
    throw new Error("Invalid time format. Expected format: 'HH:mm:ss'")
  }

  const [_, hoursStr, minutesStr] = match
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  if (hours === 0) {
    hours = 12 // Midnight case (00:00 becomes 12:00 AM)
  } else if (hours > 12) {
    hours -= 12 // Convert PM hours to 12-hour format
  }

  // Format the time as hh:mm tt
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  return `${formattedHours}:${formattedMinutes} ${period}`
}
