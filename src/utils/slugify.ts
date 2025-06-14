export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')   // Elimina diacríticos
    .toLowerCase()                      // Convierte a minúsculas
    .trim()                             // Elimina espacios al inicio y final
    .replace(/\s+/g, '-')              // Reemplaza espacios con guiones
    .replace(/[^\w\-]+/g, '')          // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, '-')            // Reemplaza múltiples guiones con uno solo
    .replace(/^-+/, '')                 // Elimina guiones al inicio
    .replace(/-+$/, '');               // Elimina guiones al final
} 