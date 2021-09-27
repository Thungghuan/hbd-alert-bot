import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  getRepository
} from 'typeorm'
import { Chat } from './chat'
import { BirthdayData } from '../types'

@Entity()
export class Birthday {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  date!: string

  @ManyToOne(() => Chat, (chat) => chat.birthdays)
  chat!: Chat
}

export const addBirthday = async (
  chatID: string,
  birthdayData: BirthdayData[]
) => {
  const chatRepository = getRepository(Chat)
  const birthdayRepository = getRepository(Birthday)

  const chat = await chatRepository.findOne({ chatID })
  birthdayData.forEach(async (birthday) => {
    const birthdayObject = birthdayRepository.create({
      name: birthday.name,
      date: birthday.date,
      chat
    })

    if (await birthdayRepository.findOne({ name: birthday.name })) {
      await birthdayRepository.update({ name: birthday.name }, birthdayObject)
    } else {
      await birthdayRepository.save(birthdayObject)
    }
  })
}

export const getChatBirthday = async (chatID: string) => {
  const chatRepository = getRepository(Chat)
  const birthdayRepository = getRepository(Birthday)

  const chat = await chatRepository.findOne({ chatID })
  return birthdayRepository.find({ chat })
}
