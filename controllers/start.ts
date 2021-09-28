import { Context } from 'telegraf'
import { createChat, getChatStatus } from '../models'

export const start = async (ctx: Context) => {
  const chat = ctx.chat!
  const chatID = '' + chat.id

  let replyMSG =
    "Hello, I'm HBD-alert-bot \n" +
    "I'll show you whose birthday will come.\n" +
    `Chat ID here is ${chat.id} \n` +
    `Chat type: ${chat.type} \n\n`

  if (chat.type === 'private') {
    const name = ctx.message!.from.first_name + ctx.message!.from?.last_name
    replyMSG += `Hello, ${name}!\n\n`
  } else {
    replyMSG += 'Hello everyone.\n\n'
  }

  await createChat(chatID)

  if (!(await getChatStatus(chatID))) {
    replyMSG +=
      'Alert in this chat room is not enabled.\n' +
      'You can send me /toggle_chat_enable to enable.'
  }

  ctx.reply(replyMSG)
}
