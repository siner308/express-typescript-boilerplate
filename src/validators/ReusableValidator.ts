import { IsInt, Min, IsUUID, ValidationError, validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { transform } from '../utils/validator';

export class UUIDValidator {
  @IsUUID('4')
  public userId: string;
}

export class IdValidatorAsNumber {
  @IsInt()
  @Min(1)
  public id: number;
}

export class IdValidatorAsUUID {
  @IsUUID('4')
  public id: string;
}

export async function idValidateAsNumber(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validator: IdValidatorAsNumber = new IdValidatorAsNumber();
  validator.id = Number(req.params.id);
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

export async function idValidateAsUUID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validator: IdValidatorAsUUID = new IdValidatorAsUUID();
  validator.id = req.params.id;
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

export async function userIdValidate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validator: UUIDValidator = new UUIDValidator();
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
