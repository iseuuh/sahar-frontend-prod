export function getOptimizedImageUrl(path, width = 800) {
  // Si l'image est déjà une URL complète, la retourner telle quelle
  if (path.startsWith('http')) {
    return path;
  }
  
  // Sinon, construire l'URL avec le chemin relatif
  return `${process.env.PUBLIC_URL}${path}`;
}

export function getImageSizes() {
  return {
    small: 400,  // Pour les petits écrans
    medium: 800, // Pour les écrans moyens
    large: 1200  // Pour les grands écrans
  };
} 