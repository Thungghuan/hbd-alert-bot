import { Context, Scenes } from 'telegraf'
import {
  getAllChats,
  toggleChatEnabledByChatID,
  getChatStatus
} from '../models'

export const showAllChat = async (ctx: Context) => {
  const allChats = await getAllChats()

  let replyMSG = '| ID |  ChatID  | Enabled |\n'

  allChats.forEach((chat) => {
    replyMSG += `| ${chat.id} | ${chat.chatID} | ${
      chat.enabled ? '√' : 'x'
    } |\n`
  })

  ctx.reply(replyMSG)
}

export const toggleChatEnabled = async (ctx: Context) => {
  const chatID = '' + ctx.chat!.id
  await toggleChatEnabledByChatID(chatID)

  ctx.reply(
    `OK, now alert in this chat room is ${
      (await getChatStatus(chatID)) ? 'enabled' : 'disabled'
    }`
  )
}

export const controlAllChats = (ctx: Scenes.WizardContext) => {
  ctx.scene.enter('toggle_chat_enable_wizard')
}

// export const showEnabledChat = (ctx: Context) => {
//   const db = new DB()

//   db.getAllEnabledChatID((rows) => {
//     if (rows.length === 0) {
//       ctx.reply(
//         'No chat is enabled\nUse command /toggle_chat_enable to enable one.'
//       )
//     } else {
//       let replyMSG = 'ID ChatID  Enabled\n'

//       rows.forEach((row) => {
//         replyMSG += `${row.id} ${row.chatID} ${
//           row.enabled === 1 ? '✅' : '❌'
//         }\n`
//       })

//       ctx.reply(replyMSG)
//     }
//   })
// }
