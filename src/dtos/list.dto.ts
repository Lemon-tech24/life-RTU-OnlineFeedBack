import { vendors } from '@jmrl23/express-helper';

export class ListDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsInt()
  readonly skip?: number;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsInt()
  readonly take?: number;
}
