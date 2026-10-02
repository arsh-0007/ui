export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
}

export interface ArticleRequest {
  title: string;
  content: string;
  category: string;
  imageUrl: string;
}