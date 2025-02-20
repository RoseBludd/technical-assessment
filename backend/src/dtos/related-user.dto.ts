import { Expose } from "class-transformer";

export class RelatedUserDto {
  @Expose()
  id: number;

  @Expose()
  name: number;
}
