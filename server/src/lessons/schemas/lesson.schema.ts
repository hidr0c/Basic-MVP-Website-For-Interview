import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Teacher } from '../../teachers/schemas/teacher.schema';

export enum LessonStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Lesson extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  studentId: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  })
  teacherId: Teacher;

  @Prop({ required: true })
  slot: Date;

  @Prop({
    type: String,
    enum: LessonStatus,
    default: LessonStatus.PENDING,
    required: true,
  })
  status: LessonStatus;

  @Prop({ default: '' })
  notes: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
