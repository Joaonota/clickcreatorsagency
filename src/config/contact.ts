export const contactConfig = {
  agencyName: "Click Creators Agency",
  tagline: "Criatividade que conecta marcas, pessoas e histórias.",
  /* Número configurável — se estiver vazio ou preenchido posteriormente, 
     o sistema gera o link wa.me devidamente formatado */
  whatsapp: "+258840000000",
  whatsappFormatted: "+258 84 000 0000",
  whatsappMessage: "Olá, Click Creators! Gostaria de saber mais sobre os vossos serviços.",
  phone: "+258 84 000 0000",
  phoneFormatted: "+258 84 000 0000",
  email: "contacto@clickcreators.agency",
  address: "Maputo, Moçambique",
  workingHours: "Segunda a Sexta: 08h30 - 18h00",
  googleMapsUrl: "https://maps.google.com/?q=Maputo+Mozambique",
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