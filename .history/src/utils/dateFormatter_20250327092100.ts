/**
 * Classe utilitaire pour le formatage des dates
 */
export class DateFormatter {
  /**
   * Convertit une date en années avant le présent (Ga, Ma, ans)
   */
  static formatGeologicalDate(dateString: string): string {
    try {
      // Si la date est au format ISO avec Z (UTC)
      if (dateString.includes('T') && dateString.endsWith('Z')) {
        const date = new Date(dateString);
        const years = Math.abs(date.getFullYear());
        
        if (years >= 1000000000) {
          // Milliards d'années (Ga)
          return `${(years / 1000000000).toFixed(2)} Ga`;
        } else if (years >= 1000000) {
          // Millions d'années (Ma)
          return `${(years / 1000000).toFixed(2)} Ma`;
        } else {
          // Années
          return `${years} ans`;
        }
      }
      
      // Si c'est une date simple (YYYY-MM-DD)
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateString);
        const years = Math.abs(date.getFullYear());
        
        if (years >= 1000000000) {
          return `${(years / 1000000000).toFixed(2)} Ga`;
        } else if (years >= 1000000) {
          return `${(years / 1000000).toFixed(2)} Ma`;
        } else {
          return `${years} ans`;
        }
      }

      // Si c'est juste une année
      if (dateString.match(/^\d{4}$/)) {
        const years = Math.abs(parseInt(dateString));
        if (years >= 1000000000) {
          return `${(years / 1000000000).toFixed(2)} Ga`;
        } else if (years >= 1000000) {
          return `${(years / 1000000).toFixed(2)} Ma`;
        } else {
          return `${years} ans`;
        }
      }

      console.warn('Format de date non reconnu:', dateString);
      return dateString;
    } catch (error) {
      console.error('Erreur de formatage de date géologique:', error);
      return dateString;
    }
  }

  /**
   * Formate une date en format français (JJ/MM/AAAA)
   */
  static formatFrenchDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date française:', error);
      return dateString;
    }
  }

  /**
   * Formate une date en format anglais (MM/DD/YYYY)
   */
  static formatEnglishDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date anglaise:', error);
      return dateString;
    }
  }

  /**
   * Formate une date selon le format demandé
   */
  static format(dateString: string, format: 'geological' | 'french' | 'english' = 'geological'): string {
    switch (format) {
      case 'geological':
        return this.formatGeologicalDate(dateString);
      case 'french':
        return this.formatFrenchDate(dateString);
      case 'english':
        return this.formatEnglishDate(dateString);
      default:
        return dateString;
    }
  }
} 