import { IsString, Length } from 'class-validator';

export class CreateUserBody {
  @IsString()
  @Length(1)
  public name: string;

  @IsString()
  public descriptionKo: string;

  @IsString()
  public descriptionEn: string;
}

export class GetUserParams {
  @IsString()
  @Length(1)
  public name: string;
}

export class UpdateUserParams {
  @IsString()
  @Length(1)
  public name: string;
}

export class UpdateUserBody {
  @IsString()
  @Length(1)
  public name: string;

  @IsString()
  public descriptionKo: string;

  @IsString()
  public descriptionEn: string;
}

export class DeleteUserParams {
  @IsString()
  @Length(1)
  public name: string;
}
