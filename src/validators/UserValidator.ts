import { ValidationError, validate, IsString, Length } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { transform } from '../utils/validator';
import { UserReqBody } from '../controllers/UserController';

export class PostUserValidator {
  @IsString()
  @Length(1)
  public name: string;

  @IsString()
  public descriptionKo: string;

  @IsString()
  public descriptionEn: string;
}

export async function userBodyValidate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validator: UserReqBody = new PostUserValidator();
  _.assign(validator, req.body);
  const errors: ValidationError[] = await validate(validator);
  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation Failed (details in validationDetails)',
      validationDetails: transform(errors),
    });
    return next(errors);
  }
  return next();
}

/**
 * check specific files are sended
 * @param req
 * @param res
 * @param next
 */
export async function userFilesValidate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const files: any = req.files;
    files.profileImg[0];
    files.logoImg[0];
  } catch (err) {
    return next('Files (profileImg & logoImg) are required');
  }
  return next();
}
