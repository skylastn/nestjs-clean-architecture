import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/model/default_entity';
import { UserRole } from '../enum/user_role';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
}
