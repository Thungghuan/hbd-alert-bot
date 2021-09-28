import { Context, Scenes } from 'telegraf'
import {
  getAllChats,
  toggleChatEnabledByChatID,
  getChatStatus,
  getAllEnabledChats
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

export const showEnabledChat = async (ctx: Context) => {
  const enabledChats = await getAllEnabledChats()
  if (enabledChats.length === 0) {
    ctx.reply(
      'No chat is enabled\n' + 'Use command /toggle_chat_enable to enable one.'
    )
  } else {
    let replyMSG = 'All enabled chats are here:\nID ChatID\n'

    enabledChats.forEach((chat) => {
      replyMSG += `${chat.id} ${chat.chatID}\n`
    })

    ctx.reply(replyMSG)
  }
}
