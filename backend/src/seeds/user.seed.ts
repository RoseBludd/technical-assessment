import { AppDataSource } from "../../ormconfig";
import { User } from "../models/user.entity";

const userRepo = AppDataSource.getRepository(User);

async function UserSeed() {
  //note: data reset
  await userRepo.delete({});

  const users: Partial<User>[] = [
    { email: "admin@test.com", name: "Admin", password: "admin" },
    { email: "user1n@test.com", name: "User", password: "user1" },
  ];

  await userRepo.save(userRepo.create(users));
}

export default UserSeed;
