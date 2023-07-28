// import {Entity, PrimaryGeneratedColumn, Column,Tree,TreeChildren, TreeParent, BaseEntity} from "typeorm";
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity()
// @Tree("closure-table")
export  class BookmarkInfo{
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({type: "nvarchar"})
    icon: string | undefined;
    @Column({type: "nvarchar"})
    label: string | undefined;

    // @TreeChildren()
    // children: Bookmark[]| undefined;

    // @TreeParent()
    // parent: Bookmark;
}