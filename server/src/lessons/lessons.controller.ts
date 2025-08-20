import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import {
  CreateLessonDto,
  LessonResponseDto,
  UpdateLessonDto,
} from './dto/lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  async findAll(): Promise<LessonResponseDto[]> {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.lessonsService.findById(id);
  }

  @Get('student/:studentId')
  async findByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<LessonResponseDto[]> {
    return this.lessonsService.findByStudentId(studentId);
  }

  @Get('teacher/:teacherId')
  async findByTeacherId(
    @Param('teacherId') teacherId: string,
  ): Promise<LessonResponseDto[]> {
    return this.lessonsService.findByTeacherId(teacherId);
  }

  @Post()
  async create(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
