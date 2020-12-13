import { Request, Response, NextFunction, Router } from 'express';
import { User } from '../entities/UserEntity';
import _ from 'lodash';
import { UserService } from '../services/UserService';
import { S3Controller } from '../utils/AWSS3';
import multer from 'multer';
import { userBodyValidate, userFilesValidate } from '../validators/UserValidator';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage });

const userAPIRouter: Router = Router();

export interface UserReqBody {
  name: string;
  descriptionKo: string;
  descriptionEn: string;
}

export interface UserResBody {
  id: number;
  name: string;
  profileImgURL: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create New User
 */
userAPIRouter.post(
  '/',
  upload.fields([{ name: 'file', maxCount: 1 }]),
  userBodyValidate,
  userFilesValidate,
  async (req: Request, res: Response, next: NextFunction) => {
    const userReqBody: UserReqBody = _.assign({}, req.body);
    const userService: UserService = UserService.getInstance();
    const s3Controller: S3Controller = S3Controller.getInstance();

    const files: any = req.files;
    const profileImg: Express.Multer.File = files.profileImg[0];
    const profileImgURL: string = `profiles/${userReqBody.name}.${s3Controller.getExtension(
      profileImg.originalname,
    )}`;
    await s3Controller.uploadFile(profileImg, profileImgURL); // upload profile image to s3
    const user: User = await userService.createUser(userReqBody, profileImgURL); // insert database
    res.status(201).json({
      message: 'created',
      user: userService.transform(user),
    });
    next();
  },
);

/**
 * Get All Users
 */
userAPIRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const userService: UserService = UserService.getInstance();

  // response selected data
  const users: User[] = await userService.selectUsers();
  const results: UserResBody[] = [];
  for (const user of users) {
    results.push(userService.transform(user));
  }
  res.status(200).json({
    message: 'selected',
    users: results,
  });
  next();
});

/**
 * Get specific user
 */
userAPIRouter.get('/:name', async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.params.name;
  const userService: UserService = UserService.getInstance();

  // response selected data
  const user: User = await userService.selectUser(name);
  if (user) {
    res.status(200).json({
      message: 'selected',
      user: userService.transform(user),
    });
  } else {
    res.status(400).json({
      message: `User does not exists (${name})`,
    });
  }
  next();
});

/**
 * Update user data
 */
userAPIRouter.put(
  '/:name',
  upload.fields([{ name: 'profileImg', maxCount: 1 }]),
  userBodyValidate,
  async (req: Request, res: Response, next: NextFunction) => {
    const name: string = req.params.name;
    const userReqBody: UserReqBody = _.assign({}, req.body);
    const files: any = req.files;
    const s3Controller: S3Controller = S3Controller.getInstance();
    let profileImgURL: string = undefined;
    const userService: UserService = UserService.getInstance();

    // select target data
    const userOrigin: User = await userService.selectUser(name);
    if (!userOrigin) {
      const errmsg: string = `User does not exists (${name})`;
      res.status(400).json({
        message: errmsg,
      });
      return next(errmsg);
    }

    // upload profile image
    try {
      if (files.profileImg) {
        const profileImg: Express.Multer.File = files.profileImg[0];
        profileImgURL = `profiles/${userReqBody.name}.${s3Controller.getExtension(
          profileImg.originalname,
        )}`;
        await s3Controller.uploadFile(profileImg, profileImgURL);
        if (userOrigin.profileImgURL !== profileImgURL) {
          // delete origin if not overwrite
          await s3Controller.deleteFile(s3Controller.getFileName(userOrigin.profileImgURL));
        }
      }
    } catch (err) {
      // keep logic without edit profile image
    }

    // response after update and select
    try {
      await userService.updateUser(name, userReqBody, profileImgURL);
      const user: User = await userService.selectUser(userReqBody.name);
      res.status(200).json({
        message: 'updated',
        user: userService.transform(user),
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
    next();
  },
);

/**
 * Delete user
 */
userAPIRouter.delete('/:name', async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.params.name;
  const userService: UserService = UserService.getInstance();
  const user: User = await userService.selectUser(name);

  // error if not exists
  if (!user) {
    const errmsg: string = `User does not exists (${name})`;
    res.status(400).json({
      message: errmsg,
    });
    return next(errmsg);
  }

  // response after delete user
  try {
    await userService.deleteUser(name);
    res.status(200).json({
      message: 'deleted',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
  next();
});

export default userAPIRouter;
