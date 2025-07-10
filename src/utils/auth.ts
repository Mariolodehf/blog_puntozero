// Sistema simple de autenticación para el administrador
// En un entorno real, esto debería ser más robusto con JWT, sesiones, etc.

export function isAdmin(): boolean {
  // Por ahora, verificamos si existe una cookie de admin
  // En el futuro, esto podría ser una verificación más robusta
  if (typeof window !== 'undefined') {
    return document.cookie.includes('admin=true');
  }
  return false;
}

export function setAdminStatus(isAdmin: boolean): void {
  if (typeof window !== 'undefined') {
    if (isAdmin) {
      document.cookie = 'admin=true; path=/; max-age=86400'; // 24 horas
    } else {
      document.cookie = 'admin=false; path=/; max-age=0';
    }
  }
}

export function checkAdminStatus(): boolean {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(cookie => cookie.trim().startsWith('admin='));
    return adminCookie ? adminCookie.split('=')[1] === 'true' : false;
  }
  return false;
} 