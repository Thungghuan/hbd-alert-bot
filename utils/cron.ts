import cron from 'node-cron'
import config from '../config'

const { schedule } = config

export const alertSchedule = (handler: (...args: any) => any) => {
  cron.schedule(schedule, handler)
}
