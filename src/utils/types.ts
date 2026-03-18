import { RowDataPacket } from "mysql2";

export interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  created_at: Date;
}

export interface User extends RowDataPacket {
  id: number;
  nickname: string;
  age: number;
  city: string;
}

export interface Interaction extends RowDataPacket {
  id: number,
  user_id: number;
  post_id: number;
  type: InteractionType;
  content?: string;
  created_at: Date;
}

export type ID = number | null;

export enum InteractionType {
  LIKE = "like",
  COMMENT = "comment",
}

export interface UpdatePostBody {
  title: string;
  content: string;
  user_id: number;
}

export interface PatchPostBody {
  title?: string;
  content?: string;
  user_id: number;
}
