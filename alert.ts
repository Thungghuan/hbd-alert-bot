import dayjs from 'dayjs'

const serverTimezoneOffset = 8
const timezoneOffset =
  serverTimezoneOffset + new Date().getTimezoneOffset() / 60

console.log(dayjs().add(timezoneOffset, 'h').format())
