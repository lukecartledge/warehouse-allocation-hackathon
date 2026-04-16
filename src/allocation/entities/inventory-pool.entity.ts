import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inventory_pools')
export class InventoryPoolEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  skuId!: string;

  @Column()
  warehouseId!: string;

  @Column()
  availableToSell!: number;

  @Column({ nullable: true })
  source?: string;
}
