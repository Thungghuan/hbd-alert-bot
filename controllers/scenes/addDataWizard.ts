import { Scenes } from 'telegraf'
import { Birthday, addBirthday } from '../../models'

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

    const birthdayData: Pick<Birthday, 'name' | 'date'>[] = []
    names.forEach((name, i) => {
      let month = dates[i].split(/-|\./)[0]
      let date = dates[i].split(/-|\./)[1]

      if (month.length < 2) {
        month = '0' + month
      }
      if (date.length < 2) {
        console.log(date)
        date = '0' + date
      }

      const data: Pick<Birthday, 'name' | 'date'> = {
        name,
        date: month + '-' + date
      }
      birthdayData.push(data)
    })

    await addBirthday(ctx.chat.id, birthdayData)
    ctx.reply('All items were inserted.')
    return ctx.scene.leave()
  }
)
