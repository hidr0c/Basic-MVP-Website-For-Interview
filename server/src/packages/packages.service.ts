import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './schemas/package.schema';
import {
  CreatePackageDto,
  PackageResponseDto,
  UpdatePackageDto,
} from './dto/package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
  ) {}

  async findAll(): Promise<PackageResponseDto[]> {
    const packages = await this.packageModel.find().exec();
    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async findAllActive(): Promise<PackageResponseDto[]> {
    const packages = await this.packageModel.find({ isActive: true }).exec();
    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async findById(id: string): Promise<PackageResponseDto> {
    const pkg = await this.packageModel.findById(id).exec();
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return this.mapPackageToResponseDto(pkg);
  }

  async create(
    createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    const createdPackage = new this.packageModel(createPackageDto);
    const savedPackage = await createdPackage.save();
    return this.mapPackageToResponseDto(savedPackage);
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageResponseDto> {
    const updatedPackage = await this.packageModel
      .findByIdAndUpdate(id, updatePackageDto, { new: true })
      .exec();

    if (!updatedPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return this.mapPackageToResponseDto(updatedPackage);
  }

  async remove(id: string): Promise<void> {
    const result = await this.packageModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
  }

  private mapPackageToResponseDto(pkg: Package): PackageResponseDto {
    return {
      id: (pkg as any)._id.toString(),
      name: pkg.name,
      price: pkg.price,
      lessonsCount: pkg.lessonsCount,
      description: pkg.description,
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }
}
