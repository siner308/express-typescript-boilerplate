import { User } from '../../entities/UserEntity';
import _ from 'lodash';

interface CreateUserData {
  name: string;
  profileImgURL: string;
}

class UpdateUserData {
  name: string;
  profileImgURL: string;
}

export class UserRepository {
  private static _default: UserRepository;

  public static getInstance(): UserRepository {
    if (!UserRepository._default) {
      UserRepository._default = new UserRepository();
      console.log('UserRepository Instance for singleton is created');
    }
    return UserRepository._default;
  }

  public async create(data: CreateUserData): Promise<User> {
    const user: User = new User();
    _.assign(user, data);
    return user.save();
  }

  public async getByName(name: string): Promise<User> {
    return await User.findOne({
      where: { name: name },
    });
  }

  public async findAll(): Promise<User[]> {
    return User.find();
  }

  public async update(user: User, data: UpdateUserData): Promise<User> {
    _.assign(user, data);
    return user.save();
  }

  public async delete(user: User): Promise<User> {
    return user.remove();
  }
}
