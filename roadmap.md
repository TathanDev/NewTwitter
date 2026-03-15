  🔐 Sécurité

  1. ✅ Rate limiting - Limite les requêtes par IP (middleware.js)
  2. ✅ Validation côté serveur - Zod dans Server Actions (auth.js, post.js)
  3. ✅ CSRF protection - Next.js built-in + security headers (next.config.mjs)
  4. ✅ Sanitization HTML - DOMPurify intégré (textParser.js)

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
  3. ✅ Validation mot de passe - Vérification de force avec Zod (min 8 chars, 1 uppercase, 1 number, 1 special)

  🚀 Améliorations techniques

  1. Cache des données - Mettre en cache les requêtes fréquentes (profils, stats)
  2. Upload d'images optimisé - Compresser les images avant stockage
  3. Typage TypeScript - Le projet semble être en JS, passer en TS améliorerait la maintenabilité