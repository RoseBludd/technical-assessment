import "reflect-metadata";
import { AppDataSource } from "../../ormconfig";
import UserSeed from "./user.seed";
import TaskSeed from "./task.seed";

const runSeeds = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database: connected.");
    console.log("Database: seeding ....");

    await UserSeed();
    await TaskSeed();

    console.log("Database: completed!");
  } catch (error) {
    console.error("Error: Seeding failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeeds();
