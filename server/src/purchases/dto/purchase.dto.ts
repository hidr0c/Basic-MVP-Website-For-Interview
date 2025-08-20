import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from '../schemas/purchase.schema';

export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @IsNotEmpty()
  @IsMongoId()
  packageId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  remainingLessons: number;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}

export class UpdatePurchaseDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingLessons?: number;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;
}

export class PurchaseResponseDto {
  id: string;
  studentId: any;
  packageId: any;
  remainingLessons: number;
  status: string;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
