import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn()
  orderId!: string;

  @Column()
  demandType!: string;

  @Column()
  channel!: string;

  @Column()
  customerTier!: string;

  @Column()
  shippingMethod!: string;

  @Column({ type: 'real' })
  totalOrderValue!: number;

  @Column()
  createdAt!: string;

  @Column()
  requestedDeliveryDate!: string;

  @Column()
  skuId!: string;

  @Column()
  warehouseId!: string;

  @Column()
  quantityRequested!: number;

  @Column()
  productName!: string;

  @Column()
  customer!: string;
}
