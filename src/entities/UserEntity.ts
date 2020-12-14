import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity /*OneToMany*/,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  // @OneToMany(
  //   () => Social,
  //   (social: Social) => social.user,
  // )
  // public socials: Social[];

  /**
   * Name
   */
  @Column({
    name: 'name',
    length: 100,
    unique: true,
  })
  public name: string;

  /**
   * Profile Image URL
   */
  @Column({
    name: 'profile_img_url',
    length: 500,
    unique: true,
    nullable: true,
  })
  public profileImgURL?: string;

  /**
   * set now when data created
   */
  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  /**
   * set now when data updated
   */
  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;
}
