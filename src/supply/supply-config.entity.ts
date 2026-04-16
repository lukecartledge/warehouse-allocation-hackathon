import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('supply_config')
export class SupplyConfigEntity {
  @PrimaryColumn()
  id!: number;

  @Column({ default: 'balanced' })
  activePreset!: string;
}
