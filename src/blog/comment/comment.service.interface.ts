import { Comment } from "./schemas/comment.schema";
import { CommentCreateDto } from "./dtos/comment-create.dto";

export interface ICommentService {
  createComment(blogPostId: string, comment: CommentCreateDto): Promise<Comment>;
}
