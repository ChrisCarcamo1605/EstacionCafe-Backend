import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserType } from "./UserType";
import { email } from "zod";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment", { name: "user_id" })
  userId: number = 0;

  @Column()
  username: string = "";

  @Column({ name: "type_id" })
  userTypeId: number = 1;

  @Column()
  password: string = "";

  @Column()
  email: string = "";

  @Column()
  active: boolean = true;

  @ManyToOne(() => UserType, (type) => type.userTypeId)
  @JoinColumn({ name: "type_id" })
  userType?: UserType;
  constructor() {}
}
