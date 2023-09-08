import { vendors } from '@jmrl23/express-helper';
import { IdDto } from '../id.dto';

export class UserInformationUpdateDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  readonly display_name?: string;
}

export class UserUpdateDto extends IdDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.ValidateNested()
  readonly user_information?: UserInformationUpdateDto;
}
