import { ConnectionOptions } from 'typeorm'
import { Chat, Birthday } from './models'
import config from './config'

export default {
  type: 'mysql',
  ...config.mysql,
  database: 'hbd_bot',
  entities: [Chat, Birthday],
  synchronize: true
} as ConnectionOptions
