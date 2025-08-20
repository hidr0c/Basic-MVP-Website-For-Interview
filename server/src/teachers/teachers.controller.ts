import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import {
  CreateTeacherDto,
  TeacherResponseDto,
  UpdateTeacherDto,
} from './dto/teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async findAll(): Promise<TeacherResponseDto[]> {
    return this.teachersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeacherResponseDto> {
    return this.teachersService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.findByUserId(userId);
  }

  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.create(createTeacherDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Post(':id/slots')
  async addSlot(
    @Param('id') id: string,
    @Body('slot') slot: Date,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.addAvailableSlot(id, slot);
  }

  @Delete(':id/slots/:slot')
  async removeSlot(
    @Param('id') id: string,
    @Param('slot') slotString: string,
  ): Promise<TeacherResponseDto> {
    const slot = new Date(slotString);
    return this.teachersService.removeAvailableSlot(id, slot);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.teachersService.remove(id);
  }
}
