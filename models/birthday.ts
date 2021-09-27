import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Chat } from './chat'

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
