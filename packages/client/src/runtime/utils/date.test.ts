import { formatDateToDateTime, isValidDate } from './date'

describe('isValidDate', () => {
  test('valid', () => {
    expect(isValidDate(new Date('2020-01-01'))).toBe(true)
  })

  test('invalid', () => {
    expect(isValidDate(new Date('Not a date'))).toBe(false)
  })
})

describe('formatDateToDateTime', () => {
  test('should format a Date object into a "YYYY-MM-DD HH:mm:ss.SSS" string', () => {
    const dateTime = '2023-09-12 16:12:09.000'
    const date = new Date(dateTime)

    expect(formatDateToDateTime(date)).toBe(dateTime)
  })
})
