import { UserDocument } from 'auth/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/user/schema/user.schema';
import { Business, BusinessDocument } from 'business/schema/business.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto } from 'business/dto/create-business.dto';
import { BusinessResponseDto } from 'business/dto/business-response.dto';
import { BusinessCategory } from 'business/enums/businessCategory.enum';

/**
 * Service responsible for managing business operations
 */
@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new business and associates it with a user
   * @param createBusinessDto - The DTO containing business creation data
   * @returns A BusinessResponseDto containing the created business information
   * @throws NotFoundException if the owner user is not found
   */
  async createBusiness(
    createBusinessDto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const { ownerId } = createBusinessDto;

    // Find the user to attach the business
    const owner = await this.userModel.findOne({ userId: ownerId });
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    // Create the business
    const business = new this.businessModel({
      ...createBusinessDto,
      owner: owner._id,
    });
    await business.save();

    // Attach the business to the user
    owner.businesses.push(business._id);
    await owner.save();
    // Transform into DTO
    return new BusinessResponseDto(
      business.businessId, // Convert ObjectId to string
      business.name,
      business.category as BusinessCategory,
      owner.userId,
      [],
      [],
    );
  }

  /**
   * Retrieves all businesses associated with a specific user
   * @param userId - The ID of the user
   * @returns An array of BusinessResponseDto objects
   * @throws NotFoundException if the user is not found
   */
  async getBusinessesForUser(userId: string): Promise<BusinessResponseDto[]> {
    const user = await this.userModel.findOne({ userId: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const businesses = await this.businessModel
      .find({ owner: user._id })
      .populate(
        'products',
        'productId name category measurementType price stock -_id',
      )
      .populate('sales', 'saleId amount date -_id')
      .exec();

    if (!businesses) {
      return [];
    }

    return businesses.map(
      (business) =>
        new BusinessResponseDto(
          business.businessId,
          business.name,
          business.category as BusinessCategory,
          user.userId,
          business.products,
          business.sales,
        ),
    );
  }

  /**
   * Retrieves a business by its ID including products and sales
   * @param id - The business ID
   * @returns The business document with populated products and sales
   */
  async getBusinessById(businessId: string): Promise<BusinessResponseDto> {
    const business = await this.businessModel
      .findOne({ businessId: businessId })
      .populate(
        'products',
        'productId name category measurementType price stock -_id',
      )
      .populate('sales', 'saleId amount date -_id')
      .exec();

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const owner = await this.userModel.findById(business.owner);

    if (!owner) {
      throw new NotFoundException('User not found');
    }

    return new BusinessResponseDto(
      business.businessId,
      business.name,
      business.category as BusinessCategory,
      owner.userId,
      business.products,
      business.sales,
    );
  }

  /**
   * Retrieves a business by its ID including only products
   * @param id - The business ID
   * @returns The business document with populated products
   */
  async getBusinessProducts(businessId: string): Promise<BusinessResponseDto> {
    const business = await this.businessModel
      .findOne({ businessId: businessId })
      .populate(
        'products',
        'productId name category measurementType price stock -_id',
      )
      .exec();

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const owner = await this.userModel.findById(business.owner);

    if (!owner) {
      throw new NotFoundException('User not found');
    }

    return new BusinessResponseDto(
      business.businessId,
      business.name,
      business.category as BusinessCategory,
      owner.userId,
      business.products,
      business.sales,
    );
  }

  /**
   * Retrieves a business by its ID including only sales
   * @param id - The business ID
   * @returns The business document with populated sales
   */
  async getBusinessSales(id: string): Promise<BusinessResponseDto> {
    const business = await this.businessModel
      .findOne({ businessId: id })
      .populate('sales')
      .exec();

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const owner = await this.userModel.findById(business.owner);
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    return new BusinessResponseDto(
      business.businessId,
      business.name,
      business.category as BusinessCategory,
      owner.userId,
      business.products,
      business.sales,
    );
  }

  /**
   * Updates a business by its ID
   * @param id - The business ID
   * @param data - Partial business data to update
   * @returns The updated business document
   */
  async updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
    return this.businessModel
      .findOneAndUpdate({ businessId: id }, data, { new: true })
      .exec();
  }

  /**
   * Deletes a business and removes its reference from the owner's businesses array
   * @param id - The business ID
   */
  async deleteBusiness(id: string): Promise<void> {
    const business = await this.businessModel.findOne({ businessId: id });
    if (business) {
      await this.userModel.findOneAndUpdate(
        { userId: business.owner },
        {
          $pull: { businesses: business._id },
        },
      );
      await this.businessModel.findOneAndDelete({ businessId: id });
    }
  }
}
