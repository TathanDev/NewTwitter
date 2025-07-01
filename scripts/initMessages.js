// Simple script pour initialiser la table Messages
console.log("Pour créer la table Messages, lancez le serveur Next.js une fois :");
console.log("npm run dev");
console.log("");
console.log("La table sera créée automatiquement lors du premier appel à l'API messages.");
console.log("");
console.log("Vous pouvez aussi créer manuellement la table SQL suivante :");
console.log("");
console.log(`
CREATE TABLE IF NOT EXISTS Messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  conversation_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(255) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  media_url VARCHAR(500),
  is_read BOOLEAN DEFAULT 0,
  read_at DATETIME,
  edited_at DATETIME,
  is_deleted BOOLEAN DEFAULT 0,
  reply_to INTEGER,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON Messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON Messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON Messages (receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON Messages (is_read);
`);
