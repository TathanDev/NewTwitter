import { DataTypes, Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';

// Configuration de la base de données
const sequelize = new Sequelize('bdd', process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: './db.sqlite',
  logging: console.log,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

async function addPostCustomizationColumns() {
  try {
    console.log('🔄 Ajout des nouvelles colonnes au modèle Post...');

    // Vérifier si les colonnes existent déjà
    const [results] = await sequelize.query("PRAGMA table_info(Posts);");
    const existingColumns = results.map(col => col.name);
    
    console.log('Colonnes existantes:', existingColumns);

    // Ajouter content_structure si elle n'existe pas
    if (!existingColumns.includes('content_structure')) {
      await sequelize.query(`
        ALTER TABLE Posts 
        ADD COLUMN content_structure TEXT DEFAULT NULL;
      `);
      console.log('✅ Colonne content_structure ajoutée');
    } else {
      console.log('⚠️ Colonne content_structure existe déjà');
    }

    // Ajouter style_config si elle n'existe pas
    if (!existingColumns.includes('style_config')) {
      await sequelize.query(`
        ALTER TABLE Posts 
        ADD COLUMN style_config TEXT DEFAULT '{}';
      `);
      console.log('✅ Colonne style_config ajoutée');
    } else {
      console.log('⚠️ Colonne style_config existe déjà');
    }

    // Ajouter content_version si elle n'existe pas
    if (!existingColumns.includes('content_version')) {
      await sequelize.query(`
        ALTER TABLE Posts 
        ADD COLUMN content_version INTEGER DEFAULT 1;
      `);
      console.log('✅ Colonne content_version ajoutée');
    } else {
      console.log('⚠️ Colonne content_version existe déjà');
    }

    // Note: Nous gardons la colonne text comme VARCHAR(255) pour éviter les problèmes de contraintes
    console.log('ℹ️ Colonne text conservée comme VARCHAR(255)');
    
    // Vérifier que toutes les nouvelles colonnes ont été ajoutées
    const [updatedResults] = await sequelize.query("PRAGMA table_info(Posts);");
    const updatedColumns = updatedResults.map(col => col.name);
    
    if (updatedColumns.includes('content_structure') && 
        updatedColumns.includes('style_config') && 
        updatedColumns.includes('content_version')) {
      console.log('✅ Toutes les nouvelles colonnes ont été ajoutées avec succès');
    }

    console.log('✅ Migration terminée avec succès !');
    
    // Vérifier la nouvelle structure
    const [newResults] = await sequelize.query("PRAGMA table_info(Posts);");
    console.log('📋 Nouvelle structure de la table Posts:');
    newResults.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} (${col.notnull ? 'NOT NULL' : 'NULL'}) ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion fermée.');
  }
}

// Exécuter la migration si ce fichier est appelé directement
if (process.argv[1] === new URL(import.meta.url).pathname) {
  addPostCustomizationColumns();
}

export { addPostCustomizationColumns };
