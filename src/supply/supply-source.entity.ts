import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('supply_sources')
export class SupplySourceEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  priority!: number;
}
