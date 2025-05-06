import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user.role';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column({ select: false, nullable: false })
  password: string;
  @Column({ select: false, nullable: true })
  refreshToken: string;
  @Column({ select: false, nullable: true, default: new Date() })
  createdAt: Date;

  @Column({ enum: ['USER', 'ADMIN'] })
  role: UserRole;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = 12;
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
