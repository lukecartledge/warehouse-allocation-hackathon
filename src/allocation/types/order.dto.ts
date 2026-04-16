import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsISO8601,
  IsInt,
} from 'class-validator';

export enum DemandType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  D2C = 'D2C',
}

export enum CustomerTier {
  VIP = 'VIP',
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
}

export enum ShippingMethod {
  EXPRESS = 'EXPRESS',
  STANDARD = 'STANDARD',
  GROUND = 'GROUND',
}

export class OrderDto {
  @ApiProperty({
    description: 'Unique order identifier',
    example: 'ORD-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({
    description: 'Type of demand',
    enum: DemandType,
    example: DemandType.RETAIL,
  })
  @IsEnum(DemandType)
  demandType!: DemandType;

  @ApiProperty({
    description: 'Sales channel',
    example: 'amazon',
  })
  @IsString()
  channel!: string;

  @ApiProperty({
    description: 'Customer tier classification',
    enum: CustomerTier,
    example: CustomerTier.PREMIUM,
  })
  @IsEnum(CustomerTier)
  customerTier!: CustomerTier;

  @ApiProperty({
    description: 'Shipping method',
    enum: ShippingMethod,
    example: ShippingMethod.EXPRESS,
  })
  @IsEnum(ShippingMethod)
  shippingMethod!: ShippingMethod;

  @ApiProperty({
    description: 'Total order value in cents',
    example: 9999,
  })
  @IsNumber()
  @Min(0)
  totalOrderValue!: number;

  @ApiProperty({
    description: 'Order creation timestamp (ISO 8601)',
    example: '2024-01-15T10:30:00Z',
  })
  @IsISO8601()
  createdAt!: string;

  @ApiProperty({
    description: 'Requested delivery date (ISO 8601)',
    example: '2024-01-20T23:59:59Z',
  })
  @IsISO8601()
  requestedDeliveryDate!: string;

  @ApiProperty({
    description: 'Stock keeping unit identifier',
    example: 'SKU-12345',
  })
  @IsString()
  @IsNotEmpty()
  skuId!: string;

  @ApiProperty({
    description: 'Warehouse identifier',
    example: 'WH-EAST-01',
  })
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({
    description: 'Quantity requested',
    example: 5,
  })
  @IsInt()
  @Min(1)
  quantityRequested!: number;
}
