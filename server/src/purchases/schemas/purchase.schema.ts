import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Package } from '../../packages/schemas/package.schema';

export enum PurchaseStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Purchase extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  studentId: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Package',
    required: true,
  })
  packageId: Package;

  @Prop({ required: true, min: 0 })
  remainingLessons: number;

  @Prop({
    type: String,
    enum: PurchaseStatus,
    default: PurchaseStatus.ACTIVE,
    required: true,
  })
  status: PurchaseStatus;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
