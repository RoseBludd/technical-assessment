import { ClassConstructor, plainToInstance } from "class-transformer";

export function transformToDto(cls: ClassConstructor<unknown>, object: any) {
  return plainToInstance(cls, object, { excludeExtraneousValues: true });
}
