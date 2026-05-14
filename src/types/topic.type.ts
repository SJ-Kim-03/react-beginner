export enum TOPIC_STATUS {
  TEMP = "draft",
  PUBLISHED = "published",
}

export interface Topic {
  id: number;
  created_at: Date | string;
  author: any; // 추후 변경
  title: string;
  content: string;
  category: string;
  thumbnail: string;
  status: TOPIC_STATUS;
}
