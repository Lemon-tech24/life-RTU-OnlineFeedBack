import { vendors } from '@jmrl23/express-helper';

export class IdDto {
  @vendors.classValidator.IsUUID('4')
  readonly id: string;
}
