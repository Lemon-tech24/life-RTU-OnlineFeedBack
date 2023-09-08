import { vendors } from '@jmrl23/express-helper';
import { ListDto } from '../list.dto';

export class UserInformationListDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  readonly display_name?: string;
}

export class UserListDto extends ListDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsEmail()
  readonly email?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.ValidateNested()
  readonly user_information?: UserInformationListDto;
}
