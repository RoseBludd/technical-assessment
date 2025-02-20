import { MigrationInterface, QueryRunner } from "typeorm";

export class Tasks1740071133139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

            CREATE TABLE public.task (
                id serial4 NOT NULL,
                title varchar NOT NULL,
                description varchar NOT NULL,
                "createdAt" timestamp DEFAULT now() NOT NULL,
                "updatedAt" timestamp DEFAULT now() NOT NULL,
                "ownedById" int4 NULL,
                "deletedAt" timestamp NULL,
                "completedAt" timestamp NULL,
                CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id)
            );
            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("task");
  }
}
