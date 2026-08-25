export const contactConfig = {
  agencyName: "Click Creators Agency",
  tagline: "Criatividade que conecta marcas, pessoas e histórias.",
  /* Número configurável — se estiver vazio ou preenchido posteriormente, 
     o sistema gera o link wa.me devidamente formatado */
  whatsapp: "+258861693504",
  whatsappFormatted: "+258 86 169 3504",
  whatsappMessage: "Olá, Click Creators! Gostaria de saber mais sobre os vossos serviços.",
  phone: "+258 86 169 3504",
  phoneFormatted: "+258 86 169 3504",
  email: "info@clickcreatorsagency.com",
  address: "Beira, Moçambique",
  workingHours: "Segunda a Sexta: 08h30 - 18h00",
  googleMapsUrl: "https://www.google.com/maps/dir/-19.8180864,34.832384/-19.81725,34.85328/@-19.8169388,34.8249973,14z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0",
};

export const getWhatsAppUrl = (customMessage?: string) => {
  const cleanNumber = contactConfig.whatsapp.replace(/\D/g, "");
  const message = customMessage || contactConfig.whatsappMessage;
  if (!cleanNumber) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const contact = contactConfig;