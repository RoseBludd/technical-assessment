import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsNotEmpty()
  assignedById?: number;
}
