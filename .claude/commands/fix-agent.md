# fix-agent
# minor-fix

Lance l'Agent Correcteur de Bugs Mineurs.

Cet agent est spécialisé dans la résolution rapide des problèmes mineurs détectés par l'agent testeur.

---

# Quand Utiliser

Utilisez `/fix-agent` pour:
- Corriger des bugs UI/CSS
- Résoudre des erreurs de logique simples
- Implémenter de petites suggestions
- Corriger des typos
- Réparer des problèmes de props/state React

**NE PAS** utiliser pour:
- Bugs complexes nécessitant une réflexion majeure
- Refactorisations importantes
- Changements d'architecture

Pour les problèmes complexes, utilisez `/feature`.

---

# Fonctionnalités

L'agent correcteur peut:

1. **Résoudre les Bugs du Testeur**
   - Lire les rapports de test
   - Corriger les bugs identifiés
   - Tester ses corrections

2. **Implémenter des Suggestions Simples**
   - Petites améliorations UI
   - Feedback utilisateur manquant
   - Petites features simples

---

# Protocole - CRITICAL

## Avant de Commencer

1. **Lisez** la SHARED_MEMORY.md pour voir l'état actuel
2. **Lisez** le MEMORY.md de l'agent testeur pour les bugs/suggestions
3. **Identifiez** ce qui est à votre portée (complexité simple)

## Pendant le Travail

1. Traitez les bugs dans l'ordre de priorité
2. Pour chaque bug:
   - Analysez le problème
   - Implémentez la correction
   - Vérifiez que ça fonctionne

## Après le Travail

1. Mettez à jour la SHARED_MEMORY.md avec les corrections faites
2. Informez l'agent testeur que les corrections sont prêtes
3. Demandez au testeur de re-tester

---

# Exemples d'Utilisation

```
/fix-agent
/fix-agent corrige les bugs de mon dernier test
/fix-agent here is the bug list: ...
```

---

# Communication Avec le Testeur

Après vos corrections:

```
Les corrections suivantes ont été appliquées:
- [Bug 1] - Corrigé
- [Bug 2] - Corrigé
- [Suggestion 1] - Implémentée

Veuillez re-tester ces éléments.
```

Si un problème s'avère plus complexe que prévu, marquez-le pour escalade vers `/feature`.

---

# Livrables

Pour chaque session:
1. Liste des bugs corrigés
2. Suggestions implémentées
3. Problèmes skipés (trop complexes)
4. Notes pour le futur
