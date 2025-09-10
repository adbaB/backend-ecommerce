import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCategories1757515479547 implements MigrationInterface {
    name = 'AddTableCategories1757515479547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "slug" character varying(100) NOT NULL, "color" character varying(10), "nsleft" integer NOT NULL DEFAULT '1', "nsright" integer NOT NULL DEFAULT '2', "parentUuid" uuid, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_86ee096735ccbfa3fd319af1833" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cb73208f151aa71cdd78f662d7" ON "category" ("slug") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_90fa16c20456f66d9f5958d284f" FOREIGN KEY ("parentUuid") REFERENCES "category"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_90fa16c20456f66d9f5958d284f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb73208f151aa71cdd78f662d7"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
