import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const testData = [
  {
    name: 'Z',
    date: '08.21'
  },
  {
    name: 'A',
    date: '08.22'
  },
  {
    name: 'B',
    date: '08.23'
  },
  {
    name: 'C',
    date: '08.24'
  },
  {
    name: 'D',
    date: '08.25'
  },
  {
    name: 'E',
    date: '08.26'
  },
  {
    name: 'F',
    date: '08.27'
  },
  {
    name: 'G',
    date: '08.28'
  },
  {
    name: 'H',
    date: '08.29'
  },
  {
    name: 'I',
    date: '08.30'
  },
  {
    name: 'J',
    date: '08.31'
  }
]

// timezone offset in China
const currentTimezoneOffset = +8
const timezoneOffset =
  currentTimezoneOffset + new Date().getTimezoneOffset() / 60

const birthdayFilter = (end: number = 0, start: number = 0) => {
  const today = dayjs().add(timezoneOffset, 'h')

  const filter = (el: { name: string; date: string }) => {
    if (end === 0) {
      return today.format('MM.DD') === el.date
    } else {
      const isBirthdayNotPast = today.isBefore(
        dayjs(el.date).year(today.year()),
        'day'
      )
      const birthdayYear = today.year() + (isBirthdayNotPast ? 0 : 1)
      const date = dayjs(el.date, 'MM.DD').year(birthdayYear)
      return date.isBetween(
        today.add(start, 'd'),
        today.add(end, 'd'),
        null,
        '(]'
      )
    }
  }

  return filter
}

const birthdayToday = testData.filter(birthdayFilter())
const birthdayIn3days = testData.filter(birthdayFilter(3))
const birthdayIn7days = testData.filter(birthdayFilter(7, 3))

console.log(birthdayToday)
console.log(birthdayIn3days)
console.log(birthdayIn7days)
