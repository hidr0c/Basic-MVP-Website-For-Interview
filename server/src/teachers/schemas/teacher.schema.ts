import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @Prop({ required: true })
  bio: string;

  @Prop({ required: true })
  experience: string;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  totalStudents: number;

  @Prop({ type: [String], required: true })
  targets: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Date], default: [] })
  availableSlots: Date[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
