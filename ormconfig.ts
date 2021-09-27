import { Chat, Birthday } from './models'

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'hbd_bot',
  entities: [Chat, Birthday]
}
