export interface CommentDto {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    issueId: string;
    authorId: string;
    author: {
      id: string;
      name: string;
      email: string;
      photo?: string;
    };
  }
  