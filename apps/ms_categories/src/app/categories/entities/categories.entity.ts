import { Column, Entity, Index, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity({ name: 'category' })
@Tree('nested-set')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ name: 'name', type: 'varchar', length: 256, unique: true })
  name!: string;

  @Column({ name: 'slug', type: 'varchar', length: 100, unique: true })
  @Index({ unique: true })
  slug!: string;

  @Column({ name: 'color', type: 'varchar', length: 10, nullable: true })
  color?: string;

  @TreeChildren({cascade:true})
  children?: Category[]

  @TreeParent({onDelete:'CASCADE'})
  parent?:Category | null
}
