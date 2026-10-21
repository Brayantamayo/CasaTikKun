// Presenta las políticas del sitio y los canales para ejercer derechos de privacidad.
import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { TIKKUN_CONTACT } from '@/compartido/datos/tikkunData';

type SeccionLegal = 'privacidad' | 'seguridad' | 'cookies' | 'condiciones';

interface CentroLegalProps {
  onClose: () => void;
}

const secciones: { id: SeccionLegal; nombre: string }[] = [
  { id: 'privacidad', nombre: 'Privacidad y datos' },
  { id: 'seguridad', nombre: 'Seguridad' },
  { id: 'cookies', nombre: 'Cookies' },
  { id: 'condiciones', nombre: 'Uso y reservas' },
];

export const CentroLegal: React.FC<CentroLegalProps> = ({ onClose }) => {
  const [seccionActiva, setSeccionActiva] = useState<SeccionLegal>('privacidad');

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#101812]/75 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="titulo-centro-legal" className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#D5DFCA] bg-[#FBF9F5] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#D5DFCA] bg-white px-5 py-5 sm:px-7">
          <div className="flex gap-3">
            <span className="mt-0.5 rounded-xl bg-[#EAF0E2] p-2 text-[#294326]"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#617A52]">Casa Tikkun · Información legal</p>
              <h2 id="titulo-centro-legal" className="mt-1 text-xl font-serif font-bold text-[#1C2E20] sm:text-2xl">Privacidad, seguridad y condiciones</h2>
              <p className="mt-1 text-xs text-stone-500">Actualizado el 19 de octubre de 2026</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Cerrar información legal"><X className="h-5 w-5" /></button>
        </header>

        <nav aria-label="Secciones legales" className="flex gap-2 overflow-x-auto border-b border-[#E2E8DA] bg-white px-5 py-3 sm:px-7">
          {secciones.map(({ id, nombre }) => (
            <button key={id} type="button" onClick={() => setSeccionActiva(id)} aria-current={seccionActiva === id ? 'page' : undefined} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors ${seccionActiva === id ? 'bg-[#1C321D] text-white' : 'bg-[#F3F5EF] text-[#465E3C] hover:bg-[#E6ECDc]'}`}>
              {nombre}
            </button>
          ))}
        </nav>

        <div className="overflow-y-auto px-5 py-6 text-sm leading-7 text-[#344235] sm:px-8">
          {seccionActiva === 'privacidad' && <article className="space-y-5">
            <p>Esta política informa cómo Casa Tikkun trata los datos personales que recibimos por este sitio. Se aplica conforme a la Ley 1581 de 2012 y sus normas reglamentarias, incluido el Decreto 1074 de 2015. El responsable se identifica comercialmente como Casa Tikkun y atiende solicitudes en <a className="font-semibold text-[#365530] underline" href={`mailto:${TIKKUN_CONTACT.correo}`}>{TIKKUN_CONTACT.correo}</a>, teléfono {TIKKUN_CONTACT.celular}, en {TIKKUN_CONTACT.direccion}.</p>
            <div><h3 className="font-bold text-[#1C2E20]">Datos y finalidades</h3><p>En consultas de reserva, puedes compartir nombre, fechas, número de huéspedes y, opcionalmente, correo, teléfono y notas. Se usan para responder disponibilidad, atender la consulta y gestionar la relación de alojamiento. El formulario abre WhatsApp y tú decides si envías el mensaje; WhatsApp aplica sus propios términos y política. Este sitio no guarda esa consulta de reserva en su base de datos.</p><p>Para reseñas solicitamos nombre, correo, calificación, comentario y datos opcionales como ciudad y tipo de viaje. El correo se usa para evitar reseñas repetidas; el nombre, la calificación, el comentario y los datos que elijas publicar pueden mostrarse públicamente en el sitio. No incluyas datos sensibles ni información de otras personas.</p></div>
            <div><h3 className="font-bold text-[#1C2E20]">Proveedores y conservación</h3><p>La operación técnica usa proveedores de alojamiento de base de datos e imágenes. Solo se deben tratar los datos necesarios para prestar el servicio y mantener la plataforma. Los mensajes que decidas enviar se procesan también mediante WhatsApp. Algunos proveedores pueden operar infraestructura fuera de Colombia; el responsable debe revisar y documentar las condiciones legales aplicables a esas transmisiones o transferencias.</p><p>Los datos se conservan durante el tiempo necesario para las finalidades informadas y para atender obligaciones legales o reclamaciones; después se suprimen o anonimizan cuando sea procedente. El responsable debe concretar los plazos según cada registro y obligación aplicable.</p></div>
            <div><h3 className="font-bold text-[#1C2E20]">Tus derechos y solicitudes</h3><p>Puedes conocer, actualizar y rectificar tus datos; solicitar prueba de autorización, información sobre su uso, revocar la autorización o pedir supresión cuando sea legalmente procedente. Escribe a <a className="font-semibold text-[#365530] underline" href={`mailto:${TIKKUN_CONTACT.correo}?subject=${encodeURIComponent('Solicitud de protección de datos personales')}`}>{TIKKUN_CONTACT.correo}</a> con el asunto “Protección de datos personales”, indica el derecho que quieres ejercer y aporta información suficiente para validar tu identidad. Las consultas y reclamos se tramitan conforme a los plazos y procedimientos de la Ley 1581 de 2012 y el Decreto 1074 de 2015. Si no recibes respuesta o consideras vulnerados tus derechos, puedes acudir a la Superintendencia de Industria y Comercio después de agotar el trámite ante el responsable, cuando corresponda.</p></div>
            <p className="rounded-xl border border-[#D5DFCA] bg-white p-4 text-xs leading-5">El envío de una reseña requiere aceptar expresamente el tratamiento descrito en esta política y la publicación de su contenido y nombre visible. La autorización no se extiende a publicidad. El sitio no solicita datos sensibles ni está destinado a menores de edad.</p>
          </article>}

          {seccionActiva === 'seguridad' && <article className="space-y-4">
            <p>Casa Tikkun aplica controles técnicos para reducir el acceso no autorizado: el acceso administrativo usa sesión protegida en cookie HttpOnly, validación de solicitudes en el servidor, controles de autorización para operaciones administrativas, limitación de intentos de inicio de sesión y credenciales de servicios mantenidas en el backend.</p>
            <p>El administrador debe mantener secretos fuera del navegador, limitar el acceso al panel, usar contraseñas únicas y activar HTTPS en producción. Ninguna medida elimina todos los riesgos de Internet. Si sospechas un uso indebido de tus datos, avísanos en <a className="font-semibold text-[#365530] underline" href={`mailto:${TIKKUN_CONTACT.correo}`}>{TIKKUN_CONTACT.correo}</a> para evaluar y atender el caso.</p>
            <p>Las fotos publicadas se alojan en un servicio de imágenes. Evita cargar fotografías que revelen información privada o identifiquen a personas sin su autorización.</p>
          </article>}

          {seccionActiva === 'cookies' && <article className="space-y-4">
            <p>Este sitio no integra actualmente herramientas de publicidad ni analítica que requieran cookies opcionales. El panel administrativo utiliza una cookie de sesión necesaria para autenticar al administrador; es HttpOnly y no se usa para publicidad.</p>
            <p>WhatsApp y otros servicios externos pueden aplicar sus propias cookies y tecnologías cuando abres sus sitios. Puedes administrar cookies desde el navegador. Si se incorporan analítica, publicidad u otras tecnologías no esenciales, esta información y el mecanismo de elección deberán actualizarse antes de activarlas.</p>
          </article>}

          {seccionActiva === 'condiciones' && <article className="space-y-4">
            <p>El sitio ofrece información sobre alojamientos, tarifas y experiencias de Casa Tikkun. Los precios y disponibilidad deben confirmarse con el anfitrión. El formulario web inicia una consulta por WhatsApp; no confirma ni registra una reserva y no procesa pagos. La reserva existe únicamente cuando el anfitrión confirma sus condiciones por un canal directo.</p>
            <p>Las condiciones de anticipo, cambios, cancelaciones, horarios, capacidad y servicios deben informarse de forma clara antes de confirmar y pagar una reserva. La información aplicable será la comunicada para la reserva concreta y no limita los derechos irrenunciables del consumidor previstos en la ley colombiana.</p>
            <p>Las reseñas deben describir experiencias reales y no incluir datos privados, contenido ilícito ni información de terceros. Casa Tikkun puede retirar reseñas que infrinjan estas reglas o la ley, sin impedir que el huésped formule una queja por los canales legales.</p>
            <p>El uso del sitio está sujeto a las leyes colombianas aplicables, incluyendo las normas de protección de datos personales y protección al consumidor. Estas condiciones no reemplazan la información contractual que debe entregarse antes de confirmar una operación turística.</p>
          </article>}

          <div className="mt-7 border-t border-[#DCE4D5] pt-4 text-xs leading-5 text-stone-500">
            <p>Marco de referencia: <a className="underline" href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" target="_blank" rel="noreferrer">Ley 1581 de 2012</a>, <a className="underline" href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44306" target="_blank" rel="noreferrer">Ley 1480 de 2011 (consumidor)</a>, <a className="underline" href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=8634" target="_blank" rel="noreferrer">Ley 300 de 1996 (turismo)</a> y orientación de la <a className="underline" href="https://www.sic.gov.co/" target="_blank" rel="noreferrer">SIC</a>. La aplicación concreta depende de la operación y de sus registros vigentes.</p>
            <p className="mt-2">Antes de publicar la versión definitiva, el operador debe completar aquí su nombre o razón social, NIT y número vigente de Registro Nacional de Turismo cuando corresponda. No se publica un número porque no fue proporcionado para esta implementación.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
