import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('allocation_results')
export class AllocationResultEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  runId!: string;

  @Column()
  orderId!: string;

  @Column()
  sku!: string;

  @Column()
  productName!: string;

  @Column()
  channel!: string;

  @Column()
  requestedQty!: number;

  @Column()
  allocatedQty!: number;

  @Column()
  status!: string;

  @Column({ nullable: true })
  source!: string;

  @Column({ nullable: true })
  reason!: string;

  @Column()
  customer!: string;

  @Column()
  orderDate!: string;

  @Column()
  priority!: number;
}
