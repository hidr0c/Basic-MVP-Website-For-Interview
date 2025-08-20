import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import {
  CreatePurchaseDto,
  PurchaseResponseDto,
  UpdatePurchaseDto,
} from './dto/purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async findAll(): Promise<PurchaseResponseDto[]> {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PurchaseResponseDto> {
    return this.purchasesService.findById(id);
  }

  @Get('student/:studentId')
  async findByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<PurchaseResponseDto[]> {
    return this.purchasesService.findByStudentId(studentId);
  }

  @Get('student/:studentId/active')
  async findActiveByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<PurchaseResponseDto[]> {
    return this.purchasesService.findActiveByStudentId(studentId);
  }

  @Post()
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    return this.purchasesService.create(createPurchaseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    return this.purchasesService.update(id, updatePurchaseDto);
  }

  @Put(':id/use-lesson')
  async useLesson(@Param('id') id: string): Promise<PurchaseResponseDto> {
    return this.purchasesService.decrementRemainingLessons(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.purchasesService.remove(id);
  }
}
