import {Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent} from "typeorm";
@Entity()
@Tree("closure-table")
export class Bookmark{
	@PrimaryGeneratedColumn()
	id?: number;

	@Column("varchar")
	icon: string;

	@Column("varchar")
	label: string;
	
	@TreeChildren()
	children?:Bookmark[];

	@TreeParent()
	parent?: Bookmark
}

export const defaultRoot={
	icon:"item.png",
	label:"根目录"
}
