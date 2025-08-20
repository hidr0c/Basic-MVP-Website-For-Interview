import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LessonStatus } from '../schemas/lesson.schema';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  slot: Date;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  slot?: Date;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class LessonResponseDto {
  id: string;
  studentId: any;
  teacherId: any;
  slot: Date;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
