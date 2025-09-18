import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustmentUserTable1758170159212 implements MigrationInterface {
    name = 'AdjustmentUserTable1758170159212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deleted_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
