import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1607864385910 implements MigrationInterface {
  name = 'user1607864385910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `profile_img_url` varchar(500) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c` (`name`), UNIQUE INDEX `IDX_b50b99f30d0de62fec1638a26d` (`profile_img_url`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_b50b99f30d0de62fec1638a26d` ON `user`');
    await queryRunner.query('DROP INDEX `IDX_065d4d8f3b5adb4a08841eae3c` ON `user`');
    await queryRunner.query('DROP TABLE `user`');
  }
}
