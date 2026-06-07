import storeProfile from '../context/storeProfile';

/**
 * Hook que devuelve un resolvedor de rutas según el estado de sesión.
 *
 * Cuando el usuario está logeado, las rutas internas se prefijan con
 * "/dashboard" para mantenerse dentro del layout protegido. Cuando no
 * lo está, se usan las rutas públicas tal cual.
 *
 * Ejemplos (logeado):
 *   appLink('/')          -> '/dashboard/home'
 *   appLink('/juego')     -> '/dashboard/juego'
 *   appLink('/ambiente')  -> '/dashboard/ambiente'
 *
 * Ejemplos (público):
 *   appLink('/juego')     -> '/juego'
 *
 * Rutas externas, anclas (#) o mailto se devuelven sin tocar.
 */
const useAppLink = () => {
  const user = storeProfile((state) => state.user);
  const isLoggedIn = !!user;

  return (path) => {
    if (typeof path !== 'string') return path;

    // No tocar enlaces externos, anclas o protocolos especiales
    if (
      path.startsWith('http') ||
      path.startsWith('#') ||
      path.startsWith('mailto:') ||
      path.startsWith('tel:')
    ) {
      return path;
    }

    if (!isLoggedIn) return path;

    // Home pública "/" equivale a "/dashboard/home" cuando hay sesión
    if (path === '/') return '/dashboard/home';

    // Ya prefijada
    if (path.startsWith('/dashboard')) return path;

    return `/dashboard${path}`;
  };
};

export default useAppLink;
