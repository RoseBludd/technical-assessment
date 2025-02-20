import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsNotEmpty()
  ownedById?: number;
}
