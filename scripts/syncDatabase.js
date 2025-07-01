import sequelize from "../utils/sequelize.js";
// Import des entités pour déclencher leur définition
import("../entities/User.js");
import("../entities/Post.js");
import("../entities/Comment.js");
import("../entities/Message.js");

async function syncDatabase() {
  try {
    console.log("🔄 Synchronisation de la base de données...");

    // Synchroniser toutes les tables
    await sequelize.sync({ force: false, alter: true });
    
    console.log("✅ Base de données synchronisée avec succès !");
    console.log("📋 Tables créées/mises à jour :");
    console.log("   - Users");
    console.log("   - Posts");
    console.log("   - Comments");
    console.log("   - Messages (nouvelle table)");

    // Vérifier la connexion
    await sequelize.authenticate();
    console.log("🔗 Connexion à la base de données établie.");
    
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation :", error);
  } finally {
    await sequelize.close();
    console.log("🔒 Connexion fermée.");
  }
}

syncDatabase();
