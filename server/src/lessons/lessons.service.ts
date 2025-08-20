import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './schemas/lesson.schema';
import {
  CreateLessonDto,
  LessonResponseDto,
  UpdateLessonDto,
} from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async findAll(): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonModel
      .find()
      .populate('studentId')
      .populate('teacherId')
      .exec();
    return lessons.map((lesson) => this.mapLessonToResponseDto(lesson));
  }

  async findById(id: string): Promise<LessonResponseDto> {
    const lesson = await this.lessonModel
      .findById(id)
      .populate('studentId')
      .populate('teacherId')
      .exec();
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return this.mapLessonToResponseDto(lesson);
  }

  async findByStudentId(studentId: string): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonModel
      .find({ studentId })
      .populate('studentId')
      .populate('teacherId')
      .exec();
    return lessons.map((lesson) => this.mapLessonToResponseDto(lesson));
  }

  async findByTeacherId(teacherId: string): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonModel
      .find({ teacherId })
      .populate('studentId')
      .populate('teacherId')
      .exec();
    return lessons.map((lesson) => this.mapLessonToResponseDto(lesson));
  }

  async create(createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    const createdLesson = new this.lessonModel(createLessonDto);
    const savedLesson = await createdLesson.save();
    return this.mapLessonToResponseDto(
      await savedLesson.populate(['studentId', 'teacherId']),
    );
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    const updatedLesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .populate('studentId')
      .populate('teacherId')
      .exec();

    if (!updatedLesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return this.mapLessonToResponseDto(updatedLesson);
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
  }

  private mapLessonToResponseDto(lesson: Lesson): LessonResponseDto {
    return {
      id: (lesson as any)._id.toString(),
      studentId: lesson.studentId,
      teacherId: lesson.teacherId,
      slot: lesson.slot,
      status: lesson.status,
      notes: lesson.notes,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
