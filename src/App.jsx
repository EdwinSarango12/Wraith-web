// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

// Layout y rutas
import Dashboard from './layout/Dashboard'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import PrivateRouteWithRole from './routes/PrivateRouteWithRole'

// Páginas públicas
import Home from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Forgot } from './pages/Forgot'
import { Confirm } from './pages/Confirm'
import { NotFound } from './pages/NotFound'
import Reset from './pages/Reset'
import Ambiente from './pages/Ambiente'
import Noticias from './pages/Noticias'
import Juego from './pages/Juego'
import Donaciones from './pages/Donaciones'
import Asistencia from './pages/Asistencia'
import ResetPassword from './pages/Reset'



// Páginas protegidas
import Profile from './pages/Profile'
import List from './pages/List'
import Details from './pages/Details'
import Create from './pages/Create'
import Update from './pages/Update'
import Chat from './pages/Chat'

// Contextos
import storeProfile from './context/storeProfile'
import storeAuth from './context/storeAuth'
import AuthCallback from './context/AuthCallBack'

function App() {
  const { profile } = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if (token) {
      profile()
    }
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para callback de login */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Rutas de contenido (visibles con o sin sesión) */}
        <Route index element={<Home />} />
        <Route path="ambiente" element={<Ambiente />} />
        <Route path="juego" element={<Juego />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="donaciones" element={<Donaciones />} />
        <Route path="asistencia" element={<Asistencia />} />
        <Route path="notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/* Rutas solo-invitado (si hay sesión, redirige a /dashboard) */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot/:id" element={<Forgot />} />
          <Route path="confirmar/:token" element={<Confirm />} />
          <Route path="api/confirmar/:token" element={<Confirm />} />
          <Route path="api/recuperarpassword/:token" element={<Reset />} />
          <Route path="reset/:token" element={<ResetPassword />} />
        </Route>

        {/* Rutas protegidas con layout Dashboard */}
        <Route path='dashboard/*' element={
            <ProtectedRoute>
              <Routes>
                <Route path='home' element={< Home/>} />
                <Route path='ambiente' element={< Ambiente />} />
                <Route path='juego' element={< Juego />} />
                <Route path='noticias' element={< Noticias />} />
                <Route path='donaciones' element={< Donaciones />} />
                <Route path='asistencia' element={< Asistencia />} />
                <Route path="notfound" element={<NotFound />} />
                
                <Route element={<Dashboard />}>
                  <Route index element={<Profile />} />
                  <Route path='listar' element={<List />} />
                  <Route path='visualizar/:id' element={<Details />} />

                  <Route path='crear' element={
                    <PrivateRouteWithRole>
                      <Create />
                    </PrivateRouteWithRole>
                  } />
                  <Route path='actualizar/:id' element={
                    <PrivateRouteWithRole>
                      <Update />
                    </PrivateRouteWithRole>
                  } />
                  <Route path='chat' element={<Chat />} />
                  
                </Route>
              </Routes>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
