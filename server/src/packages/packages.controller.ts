import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import {
  CreatePackageDto,
  PackageResponseDto,
  UpdatePackageDto,
} from './dto/package.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async findAll(): Promise<PackageResponseDto[]> {
    return this.packagesService.findAll();
  }

  @Get('active')
  async findAllActive(): Promise<PackageResponseDto[]> {
    return this.packagesService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PackageResponseDto> {
    return this.packagesService.findById(id);
  }

  @Post()
  async create(
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.create(createPackageDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.packagesService.remove(id);
  }
}
