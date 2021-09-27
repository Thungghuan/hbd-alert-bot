import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Birthday } from './birthday'

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  chatID!: string

  @Column()
  enabled!: Boolean

  @OneToMany(() => Birthday, birthday => birthday.chat)
  birthdays!: Birthday[]
}
