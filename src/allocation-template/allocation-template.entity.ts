import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('allocation_templates')
export class AllocationTemplateEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  dimensions!: string;

  @Column({ default: false })
  clearanceLogic!: boolean;

  @Column({ default: 'in-season' })
  clearanceMode!: string;
}
