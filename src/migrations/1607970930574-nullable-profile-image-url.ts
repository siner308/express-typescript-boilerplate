import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableProfileImageUrl1607970930574 implements MigrationInterface {
    name = 'nullableProfileImageUrl1607970930574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `profile_img_url` `profile_img_url` varchar(500) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `profile_img_url` `profile_img_url` varchar(500) NOT NULL");
    }

}
