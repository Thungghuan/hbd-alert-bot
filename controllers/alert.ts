import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { DB, BirthdayData } from '../database'

dayjs.extend(isBetween)

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

export const alert = () => {
  const db = new DB()

  const allBirthdayData: BirthdayData[] = []
  db.getAllEnabledChatID((chats) =>
    chats.forEach(async (chat) => {
      await db.getAllBirthdayData(`Chat_${chat.chatID}`, (allData) => {
        allData.forEach((data) => {
          allBirthdayData.push(data)
        })
      })

      let alertMSG = ''

      const birthdayToday = allBirthdayData.filter(birthdayFilter())
      const birthdayIn3days = allBirthdayData.filter(birthdayFilter(3))
      const birthdayIn7days = allBirthdayData.filter(birthdayFilter(7, 3))

      if (birthdayToday.length > 0) {
        alertMSG +=
          '🎉 今天生日的有：\n' +
          `${birthdayToday.map((people) => people.name).join(', ')}\n` +
          `快去给ta${birthdayToday.length > 1 ? '们' : ''}发祝福吧\n`
      }

      console.log(alertMSG)
      console.log(birthdayIn3days)
      console.log(birthdayIn7days)
    })
  )

  db.close()
}

alert()
