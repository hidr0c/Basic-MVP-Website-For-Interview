import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from './schemas/teacher.schema';
import {
  CreateTeacherDto,
  TeacherResponseDto,
  UpdateTeacherDto,
} from './dto/teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async findAll(): Promise<TeacherResponseDto[]> {
    const teachers = await this.teacherModel.find().populate('userId').exec();
    return teachers.map((teacher) => this.mapTeacherToResponseDto(teacher));
  }

  async findById(id: string): Promise<TeacherResponseDto> {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return this.mapTeacherToResponseDto(teacher);
  }

  async findByUserId(userId: string): Promise<TeacherResponseDto> {
    const teacher = await this.teacherModel
      .findOne({ userId })
      .populate('userId')
      .exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with user ID ${userId} not found`);
    }
    return this.mapTeacherToResponseDto(teacher);
  }

  async create(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    const createdTeacher = new this.teacherModel(createTeacherDto);
    const savedTeacher = await createdTeacher.save();
    return this.mapTeacherToResponseDto(await savedTeacher.populate('userId'));
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    const updatedTeacher = await this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .populate('userId')
      .exec();

    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return this.mapTeacherToResponseDto(updatedTeacher);
  }

  async addAvailableSlot(id: string, slot: Date): Promise<TeacherResponseDto> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    teacher.availableSlots.push(slot);
    const updatedTeacher = await teacher.save();
    return this.mapTeacherToResponseDto(
      await updatedTeacher.populate('userId'),
    );
  }

  async removeAvailableSlot(
    id: string,
    slot: Date,
  ): Promise<TeacherResponseDto> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    teacher.availableSlots = teacher.availableSlots.filter(
      (s) => s.getTime() !== slot.getTime(),
    );

    const updatedTeacher = await teacher.save();
    return this.mapTeacherToResponseDto(
      await updatedTeacher.populate('userId'),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.teacherModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }

  private mapTeacherToResponseDto(teacher: Teacher): TeacherResponseDto {
    return {
      id: (teacher as any)._id.toString(),
      userId: teacher.userId,
      bio: teacher.bio,
      experience: teacher.experience,
      languages: teacher.languages,
      price: teacher.price,
      rating: teacher.rating,
      totalStudents: teacher.totalStudents,
      targets: teacher.targets,
      isActive: teacher.isActive,
      availableSlots: teacher.availableSlots,
      createdAt: teacher.createdAt,
    };
  }
}
