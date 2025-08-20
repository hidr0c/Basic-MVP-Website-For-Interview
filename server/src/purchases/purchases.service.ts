import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from './schemas/purchase.schema';
import {
  CreatePurchaseDto,
  PurchaseResponseDto,
  UpdatePurchaseDto,
} from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
  ) {}

  async findAll(): Promise<PurchaseResponseDto[]> {
    const purchases = await this.purchaseModel
      .find()
      .populate('studentId')
      .populate('packageId')
      .exec();
    return purchases.map((purchase) => this.mapPurchaseToResponseDto(purchase));
  }

  async findById(id: string): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseModel
      .findById(id)
      .populate('studentId')
      .populate('packageId')
      .exec();
    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return this.mapPurchaseToResponseDto(purchase);
  }

  async findByStudentId(studentId: string): Promise<PurchaseResponseDto[]> {
    const purchases = await this.purchaseModel
      .find({ studentId })
      .populate('studentId')
      .populate('packageId')
      .exec();
    return purchases.map((purchase) => this.mapPurchaseToResponseDto(purchase));
  }

  async findActiveByStudentId(
    studentId: string,
  ): Promise<PurchaseResponseDto[]> {
    const purchases = await this.purchaseModel
      .find({
        studentId,
        status: 'active',
        remainingLessons: { $gt: 0 },
      })
      .populate('studentId')
      .populate('packageId')
      .exec();
    return purchases.map((purchase) => this.mapPurchaseToResponseDto(purchase));
  }

  async create(
    createPurchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    const createdPurchase = new this.purchaseModel(createPurchaseDto);
    const savedPurchase = await createdPurchase.save();
    return this.mapPurchaseToResponseDto(
      await savedPurchase.populate(['studentId', 'packageId']),
    );
  }

  async update(
    id: string,
    updatePurchaseDto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    const updatedPurchase = await this.purchaseModel
      .findByIdAndUpdate(id, updatePurchaseDto, { new: true })
      .populate('studentId')
      .populate('packageId')
      .exec();

    if (!updatedPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }

    return this.mapPurchaseToResponseDto(updatedPurchase);
  }

  async decrementRemainingLessons(id: string): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseModel.findById(id).exec();
    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }

    if (purchase.remainingLessons <= 0) {
      throw new Error('No remaining lessons in this package');
    }

    purchase.remainingLessons -= 1;

    // If no lessons remaining, mark as completed
    if (purchase.remainingLessons === 0) {
      purchase.status = 'completed' as any;
    }

    const updatedPurchase = await purchase.save();
    return this.mapPurchaseToResponseDto(
      await updatedPurchase.populate(['studentId', 'packageId']),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.purchaseModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
  }

  private mapPurchaseToResponseDto(purchase: Purchase): PurchaseResponseDto {
    return {
      id: (purchase as any)._id.toString(),
      studentId: purchase.studentId,
      packageId: purchase.packageId,
      remainingLessons: purchase.remainingLessons,
      status: purchase.status,
      purchaseDate: purchase.purchaseDate,
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
    };
  }
}
