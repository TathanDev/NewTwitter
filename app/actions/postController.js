import { postService } from "@/entities/Post";

export const postController = {
  async likePost(postId, userId) {
    const post = await postService.addLike(postId, userId);
    return {
      success: true,
      likesCount: post.likes.length,
      hasLiked: true,
    };
  },

  async unlikePost(postId, userId) {
    const post = await postService.removeLike(postId, userId);
    return {
      success: true,
      likesCount: post.likes.length,
      hasLiked: false,
    };
  },

  async getPosts() {
    return await postService.getPostsWithLikesCount();
  },
};
