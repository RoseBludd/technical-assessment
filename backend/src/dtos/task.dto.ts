import { Expose, Type } from "class-transformer";
import { RelatedUserDto } from "./related-user.dto";

export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => RelatedUserDto)
  ownedBy: RelatedUserDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  completedAt: string;
}
