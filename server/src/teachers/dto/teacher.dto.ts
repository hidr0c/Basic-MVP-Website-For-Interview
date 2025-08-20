import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  targets: string[];

  @IsOptional()
  @IsArray()
  availableSlots?: Date[];
}

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targets?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  availableSlots?: Date[];
}

export class TeacherResponseDto {
  id: string;
  userId: any;
  bio: string;
  experience: string;
  languages: string[];
  price: number;
  rating: number;
  totalStudents: number;
  targets: string[];
  isActive: boolean;
  availableSlots: Date[];
  createdAt: Date;
}
