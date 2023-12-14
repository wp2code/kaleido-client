import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int8', { default: 0, nullable: true })
  parentId?: number

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string

  @Column({ type: 'varchar', length: 50 })
  label: string

  @Column('int2', { default: 0 })
  type: number

  @Column('varchar', { nullable: true })
  url?: string

  subList?: Bookmark[]
}
