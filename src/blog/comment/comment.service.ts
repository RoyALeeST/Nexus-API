import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Comment } from "./schemas/comment.schema";
import { ICommentService } from "./comment.service.interface";
import { CommentCreateDto } from "./dtos/comment-create.dto";
import { BlogPost } from "../schemas/BlogPost.schema";


@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
  ) {}

  async createComment(blogPostId: string, comment: CommentCreateDto): Promise<Comment> {
    const blogPost = await this.blogPostModel
    .findOneAndUpdate(
      { publicId: blogPostId },
      { $push: { comments: comment } },
      { new: true }
    )
    .populate('comments.author', 'publicId name username');
    
    if (!blogPost) {
      throw new NotFoundException("Blog post not found");
    }

    return blogPost.comments[blogPost.comments.length - 1] as unknown as Comment;
  }
}
