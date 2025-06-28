import { verifySession } from "@/utils/dal";
import PostComponent from "../../components/post";
import BackButton from "../../components/BackButton";
import { notFound } from "next/navigation";

async function getPost(postId) {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
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

export default async function PostPage({ params }) {
  const session = await verifySession();
  const { id } = await params;
  
  // Récupérer le post
  const post = await getPost(id);
  
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
          <PostComponent post={post} isDetailView={true} />
        </div>

        {/* Section commentaires (préparée pour plus tard) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Commentaires
          </h2>
          
          {/* Placeholder pour les commentaires */}
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium mb-2">Les commentaires arrivent bientôt!</p>
            <p className="text-sm">Cette fonctionnalité sera implémentée prochainement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Métadonnées de la page
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) {
    return {
      title: 'Post non trouvé - NewTwitter'
    };
  }

  return {
    title: `Post de ${post.author} - NewTwitter`,
    description: post.text?.substring(0, 160) || 'Voir ce post sur NewTwitter',
  };
}
