import { DataSource } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { SchoolEntity } from './entity/school.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'kakashi99',
  database: 'testNestJs',
  entities: [UserEntity, SchoolEntity],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
