// Página que coordina navegación, secciones públicas y acceso administrativo.
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from '@/modulos/Home/Navbar';
import { Hero } from '@/modulos/Home/Hero';
import { Differentiators } from '@/modulos/Home/Differentiators';
import { AboutSection } from '@/modulos/nosotros/componentes/AboutSection';
import { CatalogSection } from '@/modulos/alojamientos/componentes/CatalogSection';
import { GallerySection } from '@/modulos/galeria/componentes/GallerySection';
import { ReviewsSection } from '@/modulos/resenas/componentes/ReviewsSection';
import { LocationSection } from '@/modulos/ubicacion/componentes/LocationSection';
import { Footer } from '@/modulos/Home/Footer';
import { WhatsAppBookingModal } from '@/modulos/reservas/componentes/WhatsAppBookingModal';
import { AdminAccessPage } from '@/modulos/autenticacion/paginas/AdminAccessPage';
import { useAuth } from '@/modulos/autenticacion/contexto/AuthContext';
import { useAdmin } from '@/modulos/administracion/contexto/contextoAdmin';
import { CentroLegal } from '@/modulos/legal/componentes/CentroLegal';
import { ensureValidCheckoutDate, getDefaultStayDates } from '@/compartido/utilidades/formatters';

const CabinDetailView = lazy(() => import('@/modulos/alojamientos/componentes/CabinDetailView').then(({ CabinDetailView: view }) => ({ default: view })));
const AdminDashboard = lazy(() => import('@/modulos/administracion/paginas/AdminDashboard').then(({ AdminDashboard: view }) => ({ default: view })));

function MainApp() {
  const { isAuthenticated, isCheckingSession, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const { getEffectiveAccommodations } = useAdmin();
  const accommodations = getEffectiveAccommodations();
  const [currentView, setCurrentView] = useState<'landing' | 'cabin-detail' | 'admin'>('landing');
  const [activeCabinId, setActiveCabinId] = useState<string>('');
  const [activeSection, setActiveSection] = useState('inicio');
  
  // Estado del formulario de reserva directa por WhatsApp.
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [bookingAccId, setBookingAccId] = useState<string | undefined>(undefined);
  const [searchCheckIn, setSearchCheckIn] = useState<string>('');
  const [searchCheckOut, setSearchCheckOut] = useState<string>('');
  const [searchGuests, setSearchGuests] = useState<number>(2);

  // Acceso administrativo mediante el parámetro ?admin=true o el fragmento #admin.
  useEffect(() => {
    const checkAdminAccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasParam = urlParams.get('admin') === 'true' || urlParams.get('admin') === '1';
      const hasHash = window.location.hash === '#admin';

      if ((hasParam || hasHash) && !isCheckingSession) {
        if (isAuthenticated) {
          setCurrentView('admin');
        } else {
          openLoginModal();
        }
      }
    };

    checkAdminAccess();
    window.addEventListener('hashchange', checkAdminAccess);
    return () => window.removeEventListener('hashchange', checkAdminAccess);
  }, [isAuthenticated, isCheckingSession, openLoginModal]);

  // Una URL compartida con ?cabana=<id> abre el alojamiento directamente.
  useEffect(() => {
    const syncCabinFromUrl = () => {
      const cabinId = new URLSearchParams(window.location.search).get('cabana');
      const cabinExists = cabinId && accommodations.some((cabin) => cabin.id === cabinId);

      if (cabinExists) {
        setActiveCabinId(cabinId);
        setActiveSection('catalogo');
        setCurrentView('cabin-detail');
      } else if (currentView === 'cabin-detail') {
        setActiveCabinId('');
        setActiveSection('catalogo');
        setCurrentView('landing');
      }
    };

    syncCabinFromUrl();
    window.addEventListener('popstate', syncCabinFromUrl);
    return () => window.removeEventListener('popstate', syncCabinFromUrl);
  }, [accommodations, currentView]);

  // Atajo de teclado para abrir o cerrar el panel administrativo.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAuthenticated) {
          setCurrentView((prev) => (prev === 'admin' ? 'landing' : 'admin'));
        } else {
          openLoginModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, openLoginModal]);

  // Si se cierra la sesión en el panel, volver a la página principal.
  useEffect(() => {
    if (!isAuthenticated && currentView === 'admin') {
      setCurrentView('landing');
    }
  }, [isAuthenticated, currentView]);

  // Actualizar la sección activa según la posición del desplazamiento.
  useEffect(() => {
    if (currentView !== 'landing') return;

    const handleScroll = () => {
      // Cerca del inicio de la página.
      if (window.scrollY < 120) {
        setActiveSection('inicio');
        return;
      }

      // Al llegar al final de la página.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('ubicacion');
        return;
      }

      // Revisar las secciones en orden inverso para activar la última que pasó el umbral.
      const sections = ['ubicacion', 'resenas', 'galeria', 'catalogo', 'conocenos', 'comodidades', 'inicio'];
      const triggerY = 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);

    // Volver a la página principal antes de desplazarse desde otra vista.
    if (currentView !== 'landing') {
      const url = new URL(window.location.href);
      url.searchParams.delete('cabana');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      setCurrentView('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenBooking = (accId?: string, checkIn?: string, checkOut?: string, guests?: number) => {
    if (accommodations.length === 0) return;
    const defaultDates = getDefaultStayDates();
    setBookingAccId(accId);
    const nextCheckIn = checkIn || defaultDates.tomorrowStr;
    setSearchCheckIn(nextCheckIn);
    setSearchCheckOut(ensureValidCheckoutDate(nextCheckIn, checkOut || defaultDates.dayAfterStr));
    setSearchGuests(guests ?? 2);
    setIsBookingOpen(true);
  };

  const handleHeroSearchAvailability = (
    cabinId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    if (accommodations.length === 0) return;
    setBookingAccId(cabinId);
    setSearchCheckIn(checkIn);
    setSearchCheckOut(checkOut);
    setSearchGuests(guests);
    setIsBookingOpen(true);
  };

  // Abrir la vista de detalle de una cabaña.
  const handleViewCabin = (cabinId: string) => {
    if (!accommodations.some((cabin) => cabin.id === cabinId)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('cabana', cabinId);
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    if (currentView === 'cabin-detail') {
      window.history.replaceState({ appView: 'cabin-detail' }, '', nextUrl);
    } else {
      window.history.pushState({ appView: 'cabin-detail' }, '', nextUrl);
    }
    setActiveCabinId(cabinId);
    setCurrentView('cabin-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('cabana');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById('catalogo');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleOpenAdminTrigger = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C2E20] flex flex-col font-sans selection:bg-[#435B48] selection:text-white">
      
      {/* La navegación permanece visible en todas las vistas públicas. */}
      {currentView !== 'admin' && (
        <Navbar
          onOpenBookingModal={() => handleOpenBooking()}
          activeSection={currentView === 'cabin-detail' ? 'catalogo' : activeSection}
          onNavigate={handleNavigate}
        />
      )}

      {/* Enrutador de las vistas principales. */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-[#465E3C]">Cargando…</div>}>
        {currentView === 'admin' ? (
          /* Panel administrativo de página completa. */
          <AdminDashboard
            onLogout={() => {
              setCurrentView('landing');
              setActiveCabinId('');
              setIsBookingOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'cabin-detail' ? (
          /* Vista de detalle de una cabaña. */
          accommodations.some((cabin) => cabin.id === activeCabinId) ? <CabinDetailView
            cabinId={activeCabinId}
            onOpenLegal={() => setIsLegalOpen(true)}
            onBackToCatalog={handleBackToLanding}
            onSelectAnotherCabin={(newCabinId) => handleViewCabin(newCabinId)}
            onBookNow={(accId, checkInDate, checkOutDate, numGuests) => 
              handleOpenBooking(accId, checkInDate, checkOutDate, numGuests)
            }
          /> : <section className="flex-1 p-12 text-center text-[#465E3C]">Este alojamiento ya no está disponible.</section>
        ) : (
          /* Página principal del sitio. */
          <>
            {/* 1. Portada con acceso rápido a la reserva. */}
            <Hero
              onSearchAvailability={handleHeroSearchAvailability}
              onExploreCatalog={() => handleNavigate('catalogo')}
            />

            {/* 2. Diferenciadores y propuesta de valor. */}
            <Differentiators />

            {/* 3. Conócenos: Historia, Filosofía de Casa Tikkun en Santa Elena */}
            <AboutSection />

            {/* 4. Catálogo de cabañas. */}
            <CatalogSection
              onOpenBookingModal={(accId) => handleOpenBooking(accId)}
              onViewCabinDetails={handleViewCabin}
            />

            {/* 5. Galería de experiencias. */}
            <GallerySection />

            {/* 6. Reseñas de huéspedes y formulario de calificación. */}
            <ReviewsSection onOpenLegal={() => setIsLegalOpen(true)} />

            {/* 7. Ubicación, contacto y ruta desde Medellín. */}
            <LocationSection />
          </>
        )}
        </Suspense>
      </main>

      {/* El pie de página permanece en todas las vistas públicas. */}
      {currentView !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenBookingModal={() => handleOpenBooking()}
          onOpenAdmin={handleOpenAdminTrigger}
          onViewCabin={handleViewCabin}
          onOpenLegal={() => setIsLegalOpen(true)}
        />
      )}

      {/* Ventana de reserva directa por WhatsApp. */}
      {isBookingOpen && accommodations.length > 0 && <WhatsAppBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedAccommodationId={bookingAccId}
        initialCheckIn={searchCheckIn}
        initialCheckOut={searchCheckOut}
        initialGuests={searchGuests}
        onOpenLegal={() => setIsLegalOpen(true)}
      />}

      {isLegalOpen && <CentroLegal onClose={() => setIsLegalOpen(false)} />}

      {/* Ventana de inicio de sesión administrativo. */}
      <AdminAccessPage
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default MainApp;

