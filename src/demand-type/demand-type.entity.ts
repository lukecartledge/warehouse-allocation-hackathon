import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('demand_types')
export class DemandTypeEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  displayName!: string;

  @Column()
  channel!: string;

  @Column()
  orderType!: string;

  @Column()
  allocationTemplate!: string;
}
