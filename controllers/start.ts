import { Context } from 'telegraf'
import { DB } from '../database'

export const start = (ctx: Context) => {
  const chat = ctx.chat!

  let replyMSG =
    "Hello, I'm HBD-alert-bot \n" +
    "I'll show you whose birthday will come.\n" +
    `Chat ID here is ${chat.id} \n` +
    `Chat type: ${chat.type} \n\n`

  if (chat.type === 'private') {
    const name = ctx.message!.from.first_name + ctx.message!.from?.last_name
    replyMSG += `Hello, ${name}!`
  } else {
    replyMSG += 'Hello everyone.'
  }

  const db = new DB()
  const tableName = `Chat_${chat.id}`

  db.createDateTable(tableName)
  db.createChatTable(tableName, '' + chat.id)

  db.close()

  ctx.reply(replyMSG)
}
