# Système de Notifications - NewTwitter

## Vue d'ensemble

Le système de notifications complet a été ajouté à NewTwitter, permettant aux utilisateurs de recevoir des notifications pour :

- 🏷️ **Mentions** : Quand un utilisateur est mentionné dans un post ou commentaire avec @username
- 💬 **Commentaires** : Quand quelqu'un commente sur leurs posts
- ❤️ **Likes** : Quand quelqu'un like leurs posts ou commentaires
- 👥 **Abonnements** : Quand quelqu'un les suit
- 💌 **Messages** : Quand quelqu'un leur envoie un message privé

## Architecture

### Composants Frontend

1. **NotificationBell.jsx** - Icône de notification dans la navbar avec badge de compteur
2. **NotificationMenu.jsx** - Menu déroulant avec aperçu des notifications récentes
3. **notifications/page.jsx** - Page complète listant toutes les notifications avec filtres

### Backend

1. **entities/Notification.js** - Modèle et service pour gérer les notifications en base
2. **api/notifications/route.js** - API pour récupérer et marquer les notifications comme lues
3. **api/notifications/[notification_id]/route.js** - API pour actions sur notifications individuelles

### Base de Données

La table `Notifications` stocke toutes les notifications avec :
- ID unique de la notification
- ID du destinataire et de l'expéditeur
- Type de notification (mention, comment, like, follow, message)
- Contenu et titre de la notification
- ID et type de l'entité liée (post, commentaire, etc.)
- État de lecture
- Date de création

## Installation

1. **Exécuter la migration** pour créer la table :
```bash
# Si vous utilisez sequelize-cli
npx sequelize-cli db:migrate

# Ou exécutez manuellement le script de migration
node migrations/create_notifications_table.js
```

2. **Redémarrer le serveur** pour que les nouveaux modèles et APIs soient disponibles.

## Utilisation

### Notifications Temps Réel

Les notifications sont envoyées en temps réel via Socket.IO :
- L'utilisateur rejoint automatiquement sa room personnelle : `user-{userId}`
- Les notifications sont émises sur cette room
- Le compteur de notifications se met à jour automatiquement

### API Endpoints

#### GET `/api/notifications`
Récupère toutes les notifications de l'utilisateur connecté avec les informations des expéditeurs.

#### PATCH `/api/notifications`
Marque toutes les notifications de l'utilisateur comme lues.

#### PATCH `/api/notifications/[id]`
Marque une notification spécifique comme lue.

#### DELETE `/api/notifications/[id]`
Supprime une notification spécifique.

### Événements Socket.IO

- `notification-update` - Met à jour le compteur de notifications
- `new-notification` - Indique qu'une nouvelle notification est arrivée

## Intégration dans les Actions Existantes

Les notifications sont automatiquement créées quand :

1. **Like sur un post** - L'auteur du post reçoit une notification
2. **Commentaire sur un post** - L'auteur du post reçoit une notification
3. **Mention dans un commentaire** - L'utilisateur mentionné reçoit une notification
4. **Suivi d'un utilisateur** - L'utilisateur suivi reçoit une notification
5. **Message privé** - Le destinataire reçoit une notification

## Personnalisation

### Ajouter de nouveaux types de notifications

1. Mettre à jour l'ENUM dans `entities/Notification.js`
2. Créer une nouvelle méthode helper dans `notificationService`
3. Ajouter l'icône correspondante dans `NotificationMenu.jsx` et `notifications/page.jsx`

### Exemple : Notification de suivi (follow)

```javascript
// Dans l'API de suivi
await notificationService.createFollowNotification(
  followedUserId,
  currentUserId
);

// Émettre en temps réel
const io = getSocketIO();
if (io) {
  await emitNotification(io, followedUserId, 'follow', currentUserId);
}
```

## Interface Utilisateur

### Menu Notifications (Dropdown)
- Clic sur l'icône 🔔 dans la navbar
- Affiche les 20 dernières notifications
- Actions : marquer comme lu, supprimer
- Navigation vers la page complète

### Page Notifications Complète
- Accessible via `/notifications`
- Filtres par type de notification
- Marquer toutes comme lues
- Affichage paginé avec détails complets

## Optimisations

- **Index en base** sur `recipient_id`, `is_read`, et `created_at`
- **Limite de 20 notifications** dans le dropdown
- **Socket.IO rooms personnelles** pour éviter la diffusion inutile
- **Gestion d'erreur** pour ne pas faire échouer les actions principales

## État et Prochaines Étapes

✅ **Terminé :**
- Système de notifications complet
- Interface utilisateur responsive
- Notifications temps réel
- Types : mention, comment, like, follow, message

🔄 **À implémenter :**
- Notifications push avec service worker
- Paramètres de notification (types à recevoir)
- Nettoyage automatique des anciennes notifications

## Debug

Pour tester les notifications :
1. Connectez-vous avec deux utilisateurs différents
2. Un utilisateur like/commente un post de l'autre
3. Vérifiez la réception en temps réel de la notification
4. Testez les mentions avec @username dans les commentaires

Les logs Socket.IO et API sont disponibles dans la console serveur pour le débogage.
