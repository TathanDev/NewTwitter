"use client";
import { useState, useEffect } from "react";
import PostComponent from "../../components/post";
import BackButton from "../../components/BackButton";
import CommentSection from "../../components/commentSection";
import { notFound } from "next/navigation";

async function getPost(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    return null;
  }
}

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localCommentsCount, setLocalCommentsCount] = useState(0);
  
  useEffect(() => {
    async function fetchPost() {
      const { id } = await params;
      const postData = await getPost(id);
      
      if (!postData) {
        notFound();
      }
      
      setPost(postData);
      setLocalCommentsCount(postData.comments_count || 0);
      setLoading(false);
    }
    
    fetchPost();
  }, [params]);
  
  const handleCommentsCountChange = (newCount) => {
    setLocalCommentsCount(newCount);
    // Mettre à jour le post local aussi
    if (post) {
      setPost(prev => ({ ...prev, comments_count: newCount }));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Bouton retour */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Post principal */}
        <div className="mb-8">
          <PostComponent 
            post={post} 
            isDetailView={true} 
            externalCommentsCount={localCommentsCount}
          />
        </div>

        {/* Section commentaires */}
        <div id="comments">
          <CommentSection 
            postId={post.post_id} 
            onCommentsCountChange={handleCommentsCountChange}
          />
        </div>
      </div>
    </div>
  );
}
