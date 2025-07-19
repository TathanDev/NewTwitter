import Follow from "../entities/Follow.js";
import sequelize from "../utils/sequelize.js";

async function initFollowSystem() {
  try {
    console.log("Initialisation du système de follow...");
    
    // Synchroniser avec la base de données
    await sequelize.sync({ force: false });
    
    // Créer la table si elle n'existe pas
    await Follow.sync({ force: false });
    
    console.log("✅ Table Follow créée avec succès !");
    
    // Vérifier la structure de la table
    const tableInfo = await sequelize.getQueryInterface().describeTable("Follows");
    console.log("📋 Structure de la table Follow:", Object.keys(tableInfo));
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  } finally {
    await sequelize.close();
  }
}

initFollowSystem();
