# Shared Agent Memory - NewTwitter

## Communication Protocol

### Architecture du Système d'Agents

1. **Architect Planner** (Command: `/planner` ou `/architect`)
   - Analyse le projet, propose la roadmap
   - Identifie les bugs complexes vs simples
   - Gère l'infrastructure et la sécurité

2. **Feature Implementer** (Command: `/feature` ou `/implement`)
   - Implémente les fonctionnalités complexes
   - Travaille sur les bugs difficiles
   - Nécessite une réflexion architecturale

3. **Minor Bug Fixer** (Command: `/fix-agent`)
   - Corrige les bugs simples et UI
   - Petites améliorations
   - Sans réflexion majeure

4. **Playwright E2E Tester** (Command: `/test-agent`)
   - Teste l'application end-to-end
   - Identifie les bugs et suggestions
   - Passe les bugs au fixeur ou à l'implémenteur

### Flux de Travail

```
Utilisateur → Architect Planner (analyse) → Choix utilisateur
    ↓
Feature Complexe → Feature Implementer → Testeur → Fixeur (si bugs)
    ↓
Feature Simple → Minor Bug Fixer → Testeur
    ↓
Testeur → Rapport → Fixeur (si minor) ou Implementer (si complex)
```

---

## Roadmap (Architect Planner)

### Terminé (Session Sécurite - Mars 2026)

| Priority | Category | Complexity | Description | Status |
|----------|----------|------------|-------------|--------|
| HAUTE | Sécurité | Complexe | ✅ Validation Zod côté serveur | TERMINÉ |
| HAUTE | Sécurité | Simple | ✅ Validation mot de passe | TERMINÉ |
| HAUTE | Sécurité | Complexe | ✅ CSRF Protection | TERMINÉ |
| HAUTE | Sécurité | Complexe | ✅ Sanitization HTML | TERMINÉ |
| HAUTE | Sécurité | Simple | ✅ Rate limiting | TERMINÉ |

**Fichiers modifiés:**
- `app/actions/auth.js` - Zod validation + sanitization
- `app/actions/post.js` - Zod validation + sanitization
- `app/utils/textParser.js` - HTML stripping
- `next.config.mjs` - Security headers
- `package.json` - dompurify installé (non utilisé,strip HTML utilisé)

### Terminé (Sessions précédentes)
- Rate limiting implémenté (middleware.js + utils/rateLimit.js)
- Validation mot de passe (auth.js avec Zod)

---

### À Faire

| Priority | Category | Complexity | Description | Status |
|----------|----------|------------|-------------|--------|
| HAUTE | Feature | Complexe | 1. Édition de posts | En attente |
| MOYENNE | Feature | Complexe | 2. Système de hashtags | En attente |
| MOYENNE | Feature | Simple | 3. Dark mode persisté en DB | En attente |
| MOYENNE | UX | Simple | 4. Confirmation suppression post | En attente |
| BASSE | Feature | Complexe | 5. Pagination infinie | En attente |
| BASSE | Infra | Complexe | 6. Cache des données fréquentes | En attente |
| BASSE | Infra | Simple | 7. Upload images optimisé | En attente |

---

## Bugs Connus

### Bugs Complexes (Feature Implementer)
| ID | Bug | Status |
|----|-----|--------|
| SOCKET-1 | Erreurs Socket 400 | Pending |
| AUTH-1 | Pas de refresh token automatique | Pending |

### Bugs Simples (Minor Bug Fixer)
| Priority | Issue | Type | Status |
|----------|-------|------|--------|
| LOW | Missing success toasts | Feature | Pending |

---

## Notes Importantes

- ✅ Zod maintenant utilisé dans auth.js et post.js
- ✅ Validation mot de passe active (min 8 chars, majuscule, chiffre, spéciale)
- ✅ Sanitization HTML avec strip des tags (pas DOMPurify pour compatibilité SSR)
- ✅ CSRF handled par Next.js + security headers