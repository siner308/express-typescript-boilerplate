import { User } from '../../entities/UserEntity';
import { UserResBody } from './UserController';
import { S3Controller } from '../../utils/AWSS3';
import { CreateUserBody } from './UserValidator';
import { UserRepository } from './UserRepository';
import { NotFoundError } from 'routing-controllers';

export class UserService {
  private static _default: UserService;
  private readonly s3Controller: S3Controller;
  private readonly userRepository: UserRepository;

  constructor() {
    this.s3Controller = S3Controller.getInstance();
    this.userRepository = UserRepository.getInstance();
  }

  /**
   * transform raw entity data for client usable
   */
  public static transform(user: User): UserResBody {
    return {
      id: user.id,
      name: user.name,
      profileImgURL:
        user.profileImgURL && S3Controller.getInstance().getFileURL(user.profileImgURL),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static getInstance(): UserService {
    if (!UserService._default) {
      UserService._default = new UserService();
      console.log('UserService Instance for singleton is created');
    }
    return UserService._default;
  }

  public async createUser(body: CreateUserBody, files: Express.Multer.File[]): Promise<User> {
    const { name } = body;
    const profileImg: Express.Multer.File = files.length ? files[0] : undefined;
    let profileImgURL: string;
    if (profileImg) {
      profileImgURL = this.getProfileImgUrl(name, profileImg.originalname);
      await this.s3Controller.uploadFile(profileImg, profileImgURL); // upload profile image to s3
    }

    const user: User = await this.userRepository.getByName(name);
    if (user) throw new Error('user already exists');
    return this.userRepository.create({
      name: body.name,
      profileImgURL,
    });
  }

  public async getByNameOrNotFound(name: string): Promise<User> {
    const user: User = await this.userRepository.getByName(name);
    if (!user) throw new NotFoundError('User is not exists');
    return user;
  }

  public async findUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async updateUser(
    name: string,
    body: CreateUserBody,
    files: Express.Multer.File[],
  ): Promise<User> {
    let profileImgURL: string = undefined;

    const user: User = await this.getByNameOrNotFound(name);

    // upload profile image
    if (files.length) {
      const profileImg: Express.Multer.File = files[0];
      profileImgURL = this.getProfileImgUrl(name, profileImg.originalname);
      await this.s3Controller.uploadFile(profileImg, profileImgURL);
      if (user.profileImgURL !== profileImgURL) {
        // delete origin if not overwrite
        await this.s3Controller.deleteFile(this.s3Controller.getFileName(user.profileImgURL));
      }
    }

    return this.userRepository.update(user, {
      ...body,
      profileImgURL,
    });
  }

  public async deleteUser(name: string): Promise<User> {
    const user: User = await this.getByNameOrNotFound(name);
    return this.userRepository.delete(user);
  }

  private getProfileImgUrl(name: string, fileName: string): string {
    return `profiles/${name}.${this.s3Controller.getExtension(fileName)}`;
  }
}
