import express from 'express';
import { User } from '../../entities/UserEntity';
import { UserService } from './UserService';
import { S3Controller } from '../../utils/AWSS3';
import {
  Controller,
  Params,
  Body,
  UploadedFiles,
  Res,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Req,
  BodyParam,
} from 'routing-controllers';
import {
  CreateUserBody,
  DeleteUserParams,
  GetUserParams,
  UpdateUserBody,
  UpdateUserParams,
} from './UserValidator';
import { OpenAPI } from 'routing-controllers-openapi';

export interface UserResBody {
  id: number;
  name: string;
  profileImgURL: string;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('/users')
class UserController {
  private readonly userService: UserService;
  private readonly s3Controller: S3Controller;

  constructor() {
    this.userService = UserService.getInstance();
    this.s3Controller = S3Controller.getInstance();
  }

  @HttpCode(201)
  @Post()
  @OpenAPI({ description: 'create user' })
  public async post(
    @Req() req: express.Request,
    @BodyParam('name') name: string,
    @Body() body: CreateUserBody,
    // @Res() res: express.Response,
    // @UploadedFiles('profileImg') files?: Express.Multer.File[],
  ): Promise<Partial<User>> {
    const files: Express.Multer.File[] = [];
    const user: User = await this.userService.createUser(body, files); // insert database
    return UserService.transform(user);
  }

  @Get()
  @OpenAPI({ deprecated: true })
  async getAll(@Res() res: express.Response): Promise<express.Response> {
    const users: User[] = await this.userService.findUsers();
    return res.status(200).send({
      message: 'selected',
      users: users.map((user: User) => UserService.transform(user)),
    });
  }

  @Get('/:name')
  async getOne(
    @Params({ validate: true }) params: GetUserParams,
    @Res() res: express.Response,
  ): Promise<express.Response> {
    const { name } = params;
    const user: User = await this.userService.getByNameOrNotFound(name);
    return res.status(200).send({
      message: 'selected',
      user: UserService.transform(user),
    });
  }

  @Put('/:name')
  async put(
    @Params({ validate: true }) params: UpdateUserParams,
    @Body({ validate: true }) body: UpdateUserBody,
    @UploadedFiles('profileImg') files: Express.Multer.File[],
    @Res() res: express.Response,
  ): Promise<express.Response> {
    const { name } = params;
    const user: User = await this.userService.updateUser(name, body, files);
    return res.status(200).send({
      message: 'updated',
      user: UserService.transform(user),
    });
  }

  @Delete('/:name')
  async delete(
    @Params({ validate: true }) params: DeleteUserParams,
    @Res() res: express.Response,
  ): Promise<express.Response> {
    const { name } = params;
    await this.userService.deleteUser(name);
    return res.status(200).send({ message: 'deleted' });
  }
}

export default UserController;
