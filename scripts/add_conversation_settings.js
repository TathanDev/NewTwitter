import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin vers la base de données SQLite
const dbPath = join(__dirname, '..', 'db.sqlite');

console.log('🔄 Migration: Ajout de la colonne allow_new_conversations...');
console.log(`📁 Base de données: ${dbPath}`);

// Ouvrir la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur lors de l\'ouverture de la base:', err);
    process.exit(1);
  }
  console.log('✅ Connexion à la base de données établie');
});

// Fonction pour exécuter une requête
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

// Fonction pour vérifier si une colonne existe
function checkColumnExists(tableName, columnName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const columnExists = rows.some(row => row.name === columnName);
        resolve(columnExists);
      }
    });
  });
}

async function migrate() {
  try {
    // Vérifier si la colonne existe déjà
    const columnExists = await checkColumnExists('Users', 'allow_new_conversations');
    
    if (columnExists) {
      console.log('✅ La colonne allow_new_conversations existe déjà');
    } else {
      console.log('🔧 Ajout de la colonne allow_new_conversations...');
      
      // Ajouter la colonne avec la valeur par défaut
      await runQuery(`
        ALTER TABLE Users 
        ADD COLUMN allow_new_conversations TEXT DEFAULT 'everyone' 
        CHECK (allow_new_conversations IN ('everyone', 'followers', 'none'))
      `);
      
      console.log('✅ Colonne allow_new_conversations ajoutée avec succès');
    }

    // Vérifier que la colonne a été ajoutée
    const finalCheck = await checkColumnExists('Users', 'allow_new_conversations');
    if (finalCheck) {
      console.log('🎉 Migration terminée avec succès !');
    } else {
      throw new Error('La colonne n\'a pas été ajoutée correctement');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion
    db.close((err) => {
      if (err) {
        console.error('❌ Erreur lors de la fermeture:', err);
      } else {
        console.log('🔒 Connexion fermée');
      }
    });
  }
}

migrate();
