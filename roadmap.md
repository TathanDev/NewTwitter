  🔐 Sécurité

  1. Rate limiting - Limiter les requêtes API pour éviter les abus (surtout login/register)
  2. Validation côté serveur - Vérifier les entrées utilisateur avec Zod dans les Server Actions
  3. CSRF protection - Les tokens CSRF sont déjà gérés par Next.js, mais vérifier que c'est bien activé
  4. Sanitization HTML - Utiliser une librairie comme dompurify pour nettoyer les posts/comments

  ✨ Features

  1. Édition de posts - Permettre de modifier ses posts après publication
  2. Suppression de compte - Option pour supprimer définitivement son compte
  3. Dark mode persisté - Sauvegarder le choix du thème en base de données
  4. Images dans les messages - Actuellement semble limité aux posts
  5. Tags/Hashtags - Parser et lier les #hashtags dans les posts
  6. Confirmation de suppression - Modal de confirmation avant de supprimer un post
  7. Pagination infinie - Charger les posts au scroll au lieu de tout charger d'un coup

  🐛 Bugs/UX

  1. Gestion hors-ligne - Que se passe-t-il si le serveur Socket.IO est down ?
  2. Déconnexion automatique - Token expire après 7 jours, mais pas de refresh token automatique
  3. Validation mot de passe - Pas de vérification de force minimale lors de l'inscription

  🚀 Améliorations techniques

  1. Cache des données - Mettre en cache les requêtes fréquentes (profils, stats)
  2. Upload d'images optimisé - Compresser les images avant stockage
  3. Typage TypeScript - Le projet semble être en JS, passer en TS améliorerait la maintenabilité