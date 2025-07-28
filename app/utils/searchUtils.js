/**
 * Utilitaires pour la recherche dans les nouvelles structures de contenu
 */

/**
 * Extrait tout le texte d'une structure de contenu modulaire
 * @param {Object|string} contentStructure - La structure de contenu à analyser
 * @returns {string} Le texte extrait, nettoyé et concaténé
 */
export function extractTextFromContentStructure(contentStructure) {
  if (!contentStructure) return '';
  
  let extractedText = '';
  
  try {
    const structure = typeof contentStructure === 'string' 
      ? JSON.parse(contentStructure) 
      : contentStructure;
    
    if (structure && structure.components && Array.isArray(structure.components)) {
      structure.components.forEach(component => {
        const componentText = extractTextFromComponent(component);
        if (componentText) {
          extractedText += componentText + ' ';
        }
      });
    }
  } catch (error) {
    console.log('Erreur lors de l\'extraction du texte:', error);
  }
  
  return extractedText.trim();
}

/**
 * Extrait le texte d'un composant spécifique
 * @param {Object} component - Le composant à analyser
 * @returns {string} Le texte extrait du composant
 */
export function extractTextFromComponent(component) {
  if (!component || !component.type || !component.data) {
    return '';
  }

  let textContent = '';

  switch (component.type) {
    case 'text':
    case 'title':
    case 'quote':
    case 'code':
      if (component.data.content) {
        textContent = component.data.content;
      }
      break;
      
    case 'list':
      if (component.data.items && Array.isArray(component.data.items)) {
        textContent = component.data.items.join(' ');
      }
      break;
      
    case 'embed':
      let embeddedText = '';
      if (component.data.title) {
        embeddedText += component.data.title + ' ';
      }
      if (component.data.description) {
        embeddedText += component.data.description + ' ';
      }
      if (component.data.url) {
        embeddedText += component.data.url + ' ';
      }
      textContent = embeddedText.trim();
      break;
      
    case 'image':
      if (component.data.alt) {
        textContent = component.data.alt;
      }
      if (component.data.caption) {
        textContent += ' ' + component.data.caption;
      }
      break;
      
    case 'video':
      if (component.data.title) {
        textContent = component.data.title;
      }
      if (component.data.description) {
        textContent += ' ' + component.data.description;
      }
      break;
      
    case 'poll':
      if (component.data.question) {
        textContent = component.data.question + ' ';
      }
      if (component.data.options && Array.isArray(component.data.options)) {
        textContent += component.data.options.map(option => option.text || option).join(' ');
      }
      break;
      
    case 'divider':
    case 'spacer':
      // Ces composants n'ont pas de contenu textuel
      textContent = '';
      break;
      
    default:
      // Pour les types de composants inconnus, essayer d'extraire le contenu générique
      if (component.data.content) {
        textContent = component.data.content;
      } else if (component.data.text) {
        textContent = component.data.text;
      }
      break;
  }

  return textContent;
}

/**
 * Extrait les hashtags d'une structure de contenu
 * @param {Object|string} contentStructure - La structure de contenu à analyser
 * @returns {Array<string>} Liste des hashtags trouvés (sans le #)
 */
export function extractHashtagsFromContentStructure(contentStructure) {
  const text = extractTextFromContentStructure(contentStructure);
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  
  return hashtags;
}

/**
 * Extrait les mentions d'une structure de contenu
 * @param {Object|string} contentStructure - La structure de contenu à analyser
 * @returns {Array<string>} Liste des mentions trouvées (sans le @)
 */
export function extractMentionsFromContentStructure(contentStructure) {
  const text = extractTextFromContentStructure(contentStructure);
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1].toLowerCase());
  }
  
  return mentions;
}

/**
 * Vérifie si un terme de recherche correspond au contenu d'un post
 * @param {Object} postData - Les données du post
 * @param {string} searchTerm - Le terme de recherche
 * @returns {boolean} True si le post correspond au terme de recherche
 */
export function matchesSearchTerm(postData, searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Recherche dans l'auteur
  if (postData.author && postData.author.toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }
  
  // Recherche dans l'ancien champ text (compatibilité)
  if (postData.text && postData.text.toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }
  
  // Recherche dans la nouvelle structure de contenu
  if (postData.content_structure) {
    const extractedText = extractTextFromContentStructure(postData.content_structure);
    if (extractedText.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Vérifie si un post contient un hashtag spécifique
 * @param {Object} postData - Les données du post
 * @param {string} hashtag - Le hashtag à chercher (avec ou sans #)
 * @returns {boolean} True si le post contient le hashtag
 */
export function containsHashtag(postData, hashtag) {
  const hashtagPattern = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
  const lowerHashtagPattern = hashtagPattern.toLowerCase();
  
  // Recherche dans l'ancien champ text
  if (postData.text && postData.text.toLowerCase().includes(lowerHashtagPattern)) {
    return true;
  }
  
  // Recherche dans la nouvelle structure de contenu
  if (postData.content_structure) {
    const extractedText = extractTextFromContentStructure(postData.content_structure);
    if (extractedText.toLowerCase().includes(lowerHashtagPattern)) {
      return true;
    }
  }
  
  return false;
}
