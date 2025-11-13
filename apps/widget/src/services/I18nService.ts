/**
 * Internationalization Service
 * Handles translations and locale management
 */

import type { I18nString } from "../types/schema.types";

type Translations = Record<string, Record<string, string>>;

const DEFAULT_TRANSLATIONS: Translations = {
  en: {
    "booking.title": "Book a Table",
    "form.submit": "Continue",
    "form.required": "Required",
    "form.select": "Select an option",
    "form.back": "Back",
    "status.loading": "Loading...",
    "status.ready": "Form ready",
    "status.loadingAvailability": "Loading availability...",
    "status.creatingBooking": "Creating booking...",
    "status.bookingConfirmed": "Booking confirmed!",
    "error.required": "This field is required",
    "error.validationFailed": "Please check the form for errors",
    "error.missingFormId": "Missing form ID attribute",
    "error.generic": "An error occurred. Please try again.",
    "availability.title": "Select a Time",
    "availability.noSlots": "No available times for this date",
    "availability.selectDate": "Select a date",
    "confirmation.title": "Booking Confirmed",
    "confirmation.code": "Confirmation Code",
    "confirmation.email": "A confirmation email has been sent",
    "confirmation.newBooking": "Make Another Booking",
  },
  it: {
    "booking.title": "Prenota un Tavolo",
    "form.submit": "Continua",
    "form.required": "Obbligatorio",
    "form.select": "Seleziona un'opzione",
    "form.back": "Indietro",
    "status.loading": "Caricamento...",
    "status.ready": "Modulo pronto",
    "status.loadingAvailability": "Caricamento disponibilità...",
    "status.creatingBooking": "Creazione prenotazione...",
    "status.bookingConfirmed": "Prenotazione confermata!",
    "error.required": "Questo campo è obbligatorio",
    "error.validationFailed": "Controlla il modulo per errori",
    "error.missingFormId": "Attributo form ID mancante",
    "error.generic": "Si è verificato un errore. Riprova.",
    "availability.title": "Seleziona un Orario",
    "availability.noSlots": "Nessun orario disponibile per questa data",
    "availability.selectDate": "Seleziona una data",
    "confirmation.title": "Prenotazione Confermata",
    "confirmation.code": "Codice di Conferma",
    "confirmation.email": "È stata inviata un'email di conferma",
    "confirmation.newBooking": "Fai un'altra Prenotazione",
  },
  es: {
    "booking.title": "Reservar una Mesa",
    "form.submit": "Continuar",
    "form.required": "Obligatorio",
    "form.select": "Selecciona una opción",
    "form.back": "Atrás",
    "status.loading": "Cargando...",
    "status.ready": "Formulario listo",
    "status.loadingAvailability": "Cargando disponibilidad...",
    "status.creatingBooking": "Creando reserva...",
    "status.bookingConfirmed": "¡Reserva confirmada!",
    "error.required": "Este campo es obligatorio",
    "error.validationFailed": "Revisa el formulario para errores",
    "error.missingFormId": "Falta el atributo de ID del formulario",
    "error.generic": "Ocurrió un error. Inténtalo de nuevo.",
    "availability.title": "Selecciona una Hora",
    "availability.noSlots": "No hay horarios disponibles para esta fecha",
    "availability.selectDate": "Selecciona una fecha",
    "confirmation.title": "Reserva Confirmada",
    "confirmation.code": "Código de Confirmación",
    "confirmation.email": "Se ha enviado un correo de confirmación",
    "confirmation.newBooking": "Hacer Otra Reserva",
  },
  fr: {
    "booking.title": "Réserver une Table",
    "form.submit": "Continuer",
    "form.required": "Obligatoire",
    "form.select": "Sélectionner une option",
    "form.back": "Retour",
    "status.loading": "Chargement...",
    "status.ready": "Formulaire prêt",
    "status.loadingAvailability": "Chargement de la disponibilité...",
    "status.creatingBooking": "Création de la réservation...",
    "status.bookingConfirmed": "Réservation confirmée!",
    "error.required": "Ce champ est obligatoire",
    "error.validationFailed": "Veuillez vérifier le formulaire",
    "error.missingFormId": "Attribut ID de formulaire manquant",
    "error.generic": "Une erreur est survenue. Réessayez.",
    "availability.title": "Sélectionner une Heure",
    "availability.noSlots": "Aucun créneau disponible pour cette date",
    "availability.selectDate": "Sélectionner une date",
    "confirmation.title": "Réservation Confirmée",
    "confirmation.code": "Code de Confirmation",
    "confirmation.email": "Un email de confirmation a été envoyé",
    "confirmation.newBooking": "Faire une Autre Réservation",
  },
  de: {
    "booking.title": "Einen Tisch Reservieren",
    "form.submit": "Weiter",
    "form.required": "Erforderlich",
    "form.select": "Wählen Sie eine Option",
    "form.back": "Zurück",
    "status.loading": "Wird geladen...",
    "status.ready": "Formular bereit",
    "status.loadingAvailability": "Verfügbarkeit wird geladen...",
    "status.creatingBooking": "Reservierung wird erstellt...",
    "status.bookingConfirmed": "Reservierung bestätigt!",
    "error.required": "Dieses Feld ist erforderlich",
    "error.validationFailed": "Bitte überprüfen Sie das Formular",
    "error.missingFormId": "Formular-ID-Attribut fehlt",
    "error.generic":
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    "availability.title": "Wählen Sie eine Zeit",
    "availability.noSlots": "Keine verfügbaren Zeiten für dieses Datum",
    "availability.selectDate": "Wählen Sie ein Datum",
    "confirmation.title": "Reservierung Bestätigt",
    "confirmation.code": "Bestätigungscode",
    "confirmation.email": "Eine Bestätigungs-E-Mail wurde gesendet",
    "confirmation.newBooking": "Eine Weitere Reservierung Vornehmen",
  },
};

export class I18nService {
  private locale: string;
  private translations: Translations;

  constructor(locale: string = "it", customTranslations?: Translations) {
    this.locale = locale;
    this.translations = customTranslations || DEFAULT_TRANSLATIONS;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }

  t(key: string, fallback?: string): string {
    const translation = this.translations[this.locale]?.[key];

    if (translation) {
      return translation;
    }

    // Fallback to English
    const englishTranslation = this.translations["en"]?.[key];
    if (englishTranslation) {
      return englishTranslation;
    }

    // Return fallback or key itself
    return fallback || key;
  }

  translateLabel(label: I18nString | string | undefined): string {
    if (!label) return "";

    if (typeof label === "string") {
      return label;
    }

    // Try current locale first
    if (label[this.locale]) {
      return label[this.locale];
    }

    // Fallback to English
    if (label["en"]) {
      return label["en"];
    }

    // Return first available translation
    const firstKey = Object.keys(label)[0];
    return label[firstKey] || "";
  }

  addTranslations(locale: string, translations: Record<string, string>): void {
    if (!this.translations[locale]) {
      this.translations[locale] = {};
    }

    this.translations[locale] = {
      ...this.translations[locale],
      ...translations,
    };
  }
}
