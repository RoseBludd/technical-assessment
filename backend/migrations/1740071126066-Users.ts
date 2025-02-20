import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1740071126066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."user" (
	        id serial4 NOT NULL,
	        "name" varchar NOT NULL,
	        email varchar NOT NULL,
	        "createdAt" timestamp DEFAULT now() NOT NULL,
	        "updatedAt" timestamp DEFAULT now() NOT NULL,
	        "password" varchar NOT NULL,
	        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
