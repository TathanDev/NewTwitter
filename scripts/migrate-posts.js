#!/usr/bin/env node

import { addPostCustomizationColumns } from '../migrations/add_post_customization_columns.js';

console.log('🚀 Démarrage de la migration des posts...');

addPostCustomizationColumns()
  .then(() => {
    console.log('🎉 Migration terminée avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur lors de la migration:', error);
    process.exit(1);
  });
