export function isDate(value: unknown): value is Date {
  return (
    value instanceof Date ||
    // date created in other JS context (for example, worker)
    Object.prototype.toString.call(value) === '[object Date]'
  )
}

export function isValidDate(date: Date) {
  return date.toString() !== 'Invalid Date'
}

export function formatDateToDateTime(date: Date) {
  const year = date.getFullYear()
  const month = setDigits(date.getMonth() + 1)
  const day = setDigits(date.getDate())
  const hours = setDigits(date.getHours())
  const minutes = setDigits(date.getMinutes())
  const seconds = setDigits(date.getSeconds())
  const milliseconds = setDigits(date.getMilliseconds(), 3)

  const dateFormat = `${year}-${month}-${day}`
  const timeFormat = `${hours}:${minutes}:${seconds}.${milliseconds}`

  return `${dateFormat} ${timeFormat}`
}

function setDigits(num: number, len = 2) {
  return num.toString().padStart(len, '0')
}
