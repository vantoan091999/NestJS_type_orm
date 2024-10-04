import { IsEmail } from 'class-validator';
import { AppBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('enterprises')
export class EnterprisesEntity extends AppBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column()
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => UserEntity, (user) => user.enterprises)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor() {
    super();
  }

  // Phương thức toJSON (nếu cần)
  // toJSON() {
  //     const school = { ...this };
  //     school.user = this.user.toJSON();
  //     return school;
  // }
}
