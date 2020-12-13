import { getManager, Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/UserEntity';
import { ErrorWrapper } from '../utils/ErrorWrapper';
import { UserReqBody, UserResBody } from '../controllers/UserController';
import { S3Controller } from '../utils/AWSS3';

export class UserService {
  private static _default: UserService;
  private userRepository: Repository<User>;

  constructor() {
    try {
      this.userRepository = getManager().getRepository(User);
    } catch (err) {
      throw new ErrorWrapper('Failed to load database', err);
    }
  }

  public static getInstance(): UserService {
    if (!UserService._default) {
      UserService._default = new UserService();
      console.log('UserService Instance for singleton is created');
    }
    return UserService._default;
  }

  public async createUser(userReqBody: UserReqBody, profileImgURL: string): Promise<User> {
    try {
      const newUser: User = new User();
      newUser.name = userReqBody.name;
      newUser.profileImgURL = profileImgURL;
      return await this.userRepository.save(newUser);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ErrorWrapper('User already exists', err);
      }
      throw new ErrorWrapper('Unexpected Error', err);
    }
  }

  public async selectUser(name: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  public async selectUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async updateUser(
    name: string,
    userReqBody: UserReqBody,
    profileImgURL: string,
  ): Promise<void> {
    try {
      await this.userRepository.update(
        {
          name: name,
        },
        {
          name: userReqBody.name,
          profileImgURL: profileImgURL,
        },
      );
    } catch (err) {
      console.log(err);
      if (err.name === 'EntityNotFound') {
        throw new ErrorWrapper('User does not exists', err);
      }
      throw new ErrorWrapper('Unexpected Error', err);
    }
  }

  public async deleteUser(name: string): Promise<DeleteResult> {
    try {
      return await this.userRepository.delete({
        name: name,
      });
    } catch (err) {
      if (err.name === 'EntityNotFound') {
        throw new ErrorWrapper('User does not exists', err);
      }
      throw new ErrorWrapper('Unexpected Error', err);
    }
  }

  /**
   * transform raw entity data for client usable
   */
  public transform(user: User): UserResBody {
    return {
      id: user.id,
      name: user.name,
      profileImgURL: S3Controller.getInstance().getFileURL(user.profileImgURL),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
