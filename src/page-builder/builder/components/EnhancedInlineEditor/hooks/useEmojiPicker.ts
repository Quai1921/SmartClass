import { useState, useCallback, useMemo } from 'react';

export const useEmojiPicker = () => {
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [emojiSearchTerm, setEmojiSearchTerm] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');

  // Emoji data
  const emojiCategories: Record<string, string[]> = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    gestures: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆'],
    people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👮‍♀️', '👮', '👮‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '💂‍♀️', '💂', '💂‍♂️', '👷‍♀️', '👷', '👷‍♂️', '👸', '🤴', '👳‍♀️', '👳', '👳‍♂️'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🛵', '🏍️', '🛺', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🎮', '🎰', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎯', '🎳'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '✅', '❌', '✔️', '❎', '☑️', '🔘', '🔴', '🟢', '🟡', '🟠', '🟣', '⚫', '⚪', '🔵', '🟤', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬', '🗨️', '🗯️', '💭', '💤', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '⏰', '⏱️', '⏲️', '⏳', '⌛', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
  };

  const openEmojiModal = useCallback(() => {
    setShowEmojiModal(true);
    // Force a refresh of the emoji data
    setSelectedEmojiCategory('smileys');
    setEmojiSearchTerm('');
  }, []);

  const closeEmojiModal = useCallback(() => {
    setShowEmojiModal(false);
    setEmojiSearchTerm('');
  }, []);

  const handleEmojiSelect = useCallback((emoji: string, onInsert: (emoji: string) => void) => {
    onInsert(emoji);
    closeEmojiModal();
  }, [closeEmojiModal]);

  const filteredEmojis = useMemo(() => {
    if (!emojiSearchTerm) {
      return emojiCategories[selectedEmojiCategory] || [];
    }
    
    const allEmojis = Object.values(emojiCategories).flat();
    const searchTerm = emojiSearchTerm.toLowerCase().trim();
    
    return allEmojis.filter(emoji => {
      // Direct emoji match
      if (emoji.includes(searchTerm)) {
        return true;
      }
      
      // Search by category and common terms
      const category = Object.keys(emojiCategories).find(cat => 
        emojiCategories[cat].includes(emoji)
      );
      
      if (category) {
        // Search terms for each category
        const searchTerms: Record<string, string[]> = {
          smileys: ['sonrisa', 'feliz', 'triste', 'risa', 'llorar', 'cara', 'emoji', 'emoción', 'sentimiento', 'alegre', 'contento', 'enojado', 'sorprendido', 'asustado'],
          gestures: ['mano', 'dedo', 'señalar', 'saludar', 'ok', 'pulgar', 'gesto', 'seña', 'apuntar', 'ondear', 'aplaudir'],
          people: ['persona', 'hombre', 'mujer', 'niño', 'bebé', 'chico', 'chica', 'familia', 'humano', 'niña', 'adulto', 'anciano', 'joven'],
          nature: ['animal', 'perro', 'gato', 'pájaro', 'pez', 'mascota', 'salvaje', 'naturaleza', 'criatura', 'insecto', 'mariposa', 'abeja'],
          food: ['comida', 'fruta', 'verdura', 'manzana', 'plátano', 'comer', 'beber', 'comida', 'hambriento', 'pizza', 'hamburguesa', 'café', 'agua'],
          activities: ['deporte', 'juego', 'jugar', 'pelota', 'correr', 'saltar', 'ejercicio', 'diversión', 'actividad', 'fútbol', 'basketball', 'tenis', 'nadar'],
          travel: ['carro', 'autobús', 'tren', 'avión', 'viajar', 'transporte', 'vehículo', 'conducir', 'montar', 'coche', 'moto', 'bicicleta', 'barco'],
          objects: ['teléfono', 'computadora', 'dispositivo', 'herramienta', 'objeto', 'cosa', 'artículo', 'gadget', 'reloj', 'laptop', 'tablet', 'cámara'],
          symbols: ['corazón', 'amor', 'marca', 'cruz', 'símbolo', 'seña', 'reloj', 'tiempo', 'estrella', 'color', 'círculo', 'cuadrado', 'verificar', 'correcto', 'incorrecto'],
          flags: ['bandera', 'estrella', 'símbolo', 'especial', 'decorativo', 'ornamento', 'diseño']
        };
        
        const categoryTerms = searchTerms[category] || [];
        
        // Check if any search term starts with the search term (partial match)
        return categoryTerms.some(term => 
          term.startsWith(searchTerm) || 
          searchTerm.startsWith(term) ||
          term.includes(searchTerm) ||
          searchTerm.includes(term)
        );
      }
      
      return false;
    });
  }, [emojiSearchTerm, selectedEmojiCategory, emojiCategories]);

  return {
    showEmojiModal,
    emojiSearchTerm,
    selectedEmojiCategory,
    emojiCategories,
    filteredEmojis,
    openEmojiModal,
    closeEmojiModal,
    handleEmojiSelect,
    setEmojiSearchTerm,
    setSelectedEmojiCategory
  };
}; 