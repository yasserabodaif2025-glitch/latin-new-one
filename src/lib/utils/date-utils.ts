export const formatDateToArabic = (dateString: string | Date, includeTime: boolean = true) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return 'تاريخ غير صالح';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh',
    calendar: 'islamic-umalqura', // Use Hijri calendar
    numberingSystem: 'arab', // Use Arabic numerals
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('ar-SA', options).format(date);
};

export const formatTimeToArabic = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Riyadh'
  }).format(date);
};

export const formatGroupDateTime = (startTime: string | Date) => {
  const date = typeof startTime === 'string' ? new Date(startTime) : startTime;
  
  if (isNaN(date.getTime())) {
    return { date: '--/--/----', time: '--:--' };
  }

  // Format date in Arabic (Hijri calendar)
  const dateFormatter = new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'islamic-umalqura',
    numberingSystem: 'arab',
    timeZone: 'Asia/Riyadh'
  });

  // Format time in Arabic (12-hour format)
  const timeFormatter = new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    numberingSystem: 'arab',
    timeZone: 'Asia/Riyadh'
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date)
  };
};
