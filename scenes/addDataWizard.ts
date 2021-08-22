import { Scenes } from 'telegraf'
import { DB } from '../database'

interface BirthdayData {
  name: string
  date: string
}

export const addDataWizard = new Scenes.WizardScene(
  'add_data',
  (ctx: any) => {
    const replyMSG =
      '🥳 Send the birthday day list please\\.\n' +
      '📝 Format: NAME MM\\.DD\n' +
      '_Separated by colon, space, newline _\n'
    ctx.replyWithMarkdownV2(replyMSG)
    return ctx.wizard.next()
  },
  async (ctx) => {
    const textSplit: string[] = ctx.message.text.split(
      /:|：|\s+|\n|\s*周[日一二三四五六]/
    )
    const names = textSplit.filter((el) => el).filter((el, i) => i % 2 === 0)
    const dates = textSplit.filter((el) => el).filter((el, i) => i % 2 === 1)

    const birthdayData: BirthdayData[] = []
    names.forEach((name, i) => {
      const data: BirthdayData = {
        name,
        date: dates[i]
      }
      birthdayData.push(data)
    })

    const db = new DB()
    const tableName = `Chat_${ctx.chat.id}`

    db.insertItemsIfNotExist(tableName, birthdayData)

    await ctx.reply('All items were inserted.')
    db.close()
    return ctx.scene.leave()
  }
)
