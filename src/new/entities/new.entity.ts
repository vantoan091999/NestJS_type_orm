import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news')
export class NewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
}
