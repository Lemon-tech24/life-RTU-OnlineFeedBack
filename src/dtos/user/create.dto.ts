import { vendors } from '@jmrl23/express-helper';

export class UserInformationCreateDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  readonly display_name?: string;
}

export class UserCreateDto {
  @vendors.classValidator.IsString()
  readonly google_id: string;

  @vendors.classValidator.IsEmail()
  readonly email: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.ValidateNested()
  readonly user_information?: UserInformationCreateDto;
}
