// Coordina las vistas principales, la navegación, la reserva y el acceso administrativo.
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/home/Hero';
import { Differentiators } from './components/home/Differentiators';
import { AboutSection } from './components/about/AboutSection';
import { CatalogSection } from './components/catalog/CatalogSection';
import { GallerySection } from './components/gallery/GallerySection';
import { ReviewsSection } from './components/reviews/ReviewsSection';
import { LocationSection } from './components/location/LocationSection';
import { FaqView } from './components/faq/FaqView';
import { CabinDetailView } from './components/catalog/CabinDetailView';
import { Footer } from './components/common/Footer';
import { WhatsAppBookingModal } from './components/booking/WhatsAppBookingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { MessageCircle } from 'lucide-react';
import { TIKKUN_CONTACT, ACCOMMODATIONS } from './data/tikkunData';
import { ReviewsProvider } from './context/ReviewsContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

function MainApp() {
  const { isAuthenticated, isLoginModalOpen, openLoginModal, closeLoginModal } = useAdmin();
  const [currentView, setCurrentView] = useState<'landing' | 'cabin-detail' | 'faq' | 'admin'>('landing');
  const [activeCabinId, setActiveCabinId] = useState<string>(ACCOMMODATIONS[0].id);
  const [activeSection, setActiveSection] = useState('inicio');
  
  // Estado del formulario de reserva directa por WhatsApp.
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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

      if (hasParam || hasHash) {
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
  }, [isAuthenticated, openLoginModal]);

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
    // Abrir la vista de preguntas frecuentes cuando se selecciona esa sección.
    if (sectionId === 'faq') {
      setCurrentView('faq');
      setActiveSection('faq');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveSection(sectionId);

    // Volver a la página principal antes de desplazarse desde otra vista.
    if (currentView !== 'landing') {
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
    setBookingAccId(accId);
    if (checkIn) setSearchCheckIn(checkIn);
    if (checkOut) setSearchCheckOut(checkOut);
    if (guests) setSearchGuests(guests);
    setIsBookingOpen(true);
  };

  const handleHeroSearchAvailability = (
    cabinId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    setBookingAccId(cabinId);
    setSearchCheckIn(checkIn);
    setSearchCheckOut(checkOut);
    setSearchGuests(guests);
    setIsBookingOpen(true);
  };

  // Abrir la vista de detalle de una cabaña.
  const handleViewCabin = (cabinId: string) => {
    setActiveCabinId(cabinId);
    setCurrentView('cabin-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
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
          activeSection={
            currentView === 'faq' 
              ? 'faq' 
              : currentView === 'cabin-detail' 
                ? 'catalogo' 
                : activeSection
          }
          onNavigate={handleNavigate}
        />
      )}

      {/* Enrutador de las vistas principales. */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          /* Panel administrativo de página completa. */
          <AdminDashboard
            onBackToSite={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'faq' ? (
          /* Vista de preguntas frecuentes de página completa. */
          <FaqView
            onBackToHome={() => handleNavigate('inicio')}
            onOpenBookingModal={() => handleOpenBooking()}
          />
        ) : currentView === 'cabin-detail' ? (
          /* Vista de detalle de una cabaña. */
          <CabinDetailView
            cabinId={activeCabinId}
            onBackToCatalog={handleBackToLanding}
            onSelectAnotherCabin={(newCabinId) => handleViewCabin(newCabinId)}
            onBookNow={(accId, checkInDate, checkOutDate, numGuests) => 
              handleOpenBooking(accId, checkInDate, checkOutDate, numGuests)
            }
          />
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
            <ReviewsSection />

            {/* 7. Ubicación, contacto y ruta desde Medellín. */}
            <LocationSection />
          </>
        )}
      </main>

      {/* El pie de página permanece en todas las vistas públicas. */}
      {currentView !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenBookingModal={() => handleOpenBooking()}
          onOpenAdmin={handleOpenAdminTrigger}
          onViewCabin={handleViewCabin}
        />
      )}

      {/* Ventana de reserva directa por WhatsApp. */}
      <WhatsAppBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedAccommodationId={bookingAccId}
        initialCheckIn={searchCheckIn}
        initialCheckOut={searchCheckOut}
        initialGuests={searchGuests}
      />

      {/* Ventana de inicio de sesión administrativo. */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Acceso flotante a la asistencia por WhatsApp. */}
      {currentView !== 'admin' && (
        <aside aria-label="Contacto flotante" className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
          <a
            href={`https://wa.me/${TIKKUN_CONTACT.whatsappNumber}?text=${encodeURIComponent('Hola Casa Tikkun, quisiera consultar información para reservar en sus cabañas.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="sr-only">Contactar por WhatsApp</span>
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-tikkun-brand-deep text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none hidden sm:inline-block border border-tikkun-brand-sage/40">
              ¿Dudas? Chatea en vivo
            </span>
          </a>
        </aside>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ReviewsProvider>
      <AdminProvider>
        <MainApp />
      </AdminProvider>
    </ReviewsProvider>
  );
}

