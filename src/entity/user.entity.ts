import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { EnterprisesEntity } from './enterprises.entity';
export enum UserStatus {
  ACTIVE = 'active',
  UNACTIVE = 'unactive',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}
@Entity('user')
export class UserEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.UNACTIVE })
  is_actived: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => SchoolEntity, (school) => school.user)
  schools: SchoolEntity[];

  @OneToMany(() => EnterprisesEntity, (enterprises) => enterprises.user)
  enterprises: SchoolEntity[];
}
