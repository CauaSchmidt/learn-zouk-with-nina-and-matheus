/*
  CONTEÚDO EDITÁVEL DO SITE
  ------------------------------------------------------------
  Para atualizar agenda, vídeos ou contatos, mexa só neste arquivo.

  Eventos:
    - startDate / endDate no formato "AAAA-MM-DD"
    - instructor: "both" (os dois), "nina" ou "matheus"
    - isLocation: true  = workshop numa cidade (mostra botão de aula particular)
                  false = festival/congresso (aparece em "Stages we've taught on")
    - link: site do evento (opcional)
  Eventos que já passaram somem sozinhos da agenda.
*/
window.SITE = {
  contact: {
    whatsapp: "5519992955198",
    phoneLabel: "+55 19 99295-5198",
    email: "ninaandmatheus@gmail.com",
    instagram: "ninaandmatheus"
  },

  links: {
    tidycal: "https://tidycal.com/learnzouk/workshop-private",
    youtube: "https://www.youtube.com/channel/UCXe6U9JXZSR_pXQboFrRehA",
    instagram: "https://www.instagram.com/ninaandmatheus",
    instagramNina: "https://www.instagram.com/ninadarbello",
    instagramMatheus: "https://www.instagram.com/thsfranco"
  },

  events: [
    // ---- Adicione aqui as datas de 2027 ----

    // ---- 2025 (já passaram; ficam como histórico) ----
    { startDate: "2025-01-08", endDate: "2025-01-12", name: "Rio Zouk Congress", location: "Rio de Janeiro, Brazil", isLocation: false, link: "https://lnk.bio/riozoukcongress", instructor: "both" },
    { startDate: "2025-01-16", endDate: "2025-01-20", name: "International Zouk Congress (IZC)", location: "Miami, USA", isLocation: false, instructor: "both" },
    { startDate: "2025-02-07", endDate: "2025-02-19", name: "Taiwan Workshop", location: "Taiwan", isLocation: true, instructor: "matheus" },
    { startDate: "2025-02-11", endDate: "2025-02-12", name: "Paris Workshop", location: "Paris, France", isLocation: true, instructor: "nina" },
    { startDate: "2025-02-13", endDate: "2025-02-16", name: "Warsaw Workshop", location: "Warsaw, Poland", isLocation: true, instructor: "nina" },
    { startDate: "2025-02-17", endDate: "2025-02-18", name: "Paris Workshop", location: "Paris, France", isLocation: true, instructor: "nina" },
    { startDate: "2025-02-21", endDate: "2025-02-23", name: "Taiwan Zouk Festival", location: "Taipei, Taiwan", isLocation: false, link: "https://taiwanzoukfestival.com", instructor: "both" },
    { startDate: "2025-02-26", endDate: "2025-03-05", name: "Paris Workshop", location: "Paris, France", isLocation: true, instructor: "nina" },
    { startDate: "2025-03-07", endDate: "2025-03-12", name: "Tokyo Workshop", location: "Tokyo, Japan", isLocation: true, instructor: "matheus" },
    { startDate: "2025-03-14", endDate: "2025-03-16", name: "Phoenix Workshop", location: "Phoenix, USA", isLocation: true, instructor: "both" },
    { startDate: "2025-03-21", endDate: "2025-03-23", name: "Michigan Workshop", location: "Michigan, USA", isLocation: true, instructor: "both" },
    { startDate: "2025-03-28", endDate: "2025-04-17", name: "USA Tour", location: "Various cities, USA", isLocation: true, instructor: "both" },
    { startDate: "2025-04-18", endDate: "2025-04-20", name: "Boston Workshop", location: "Boston, USA", isLocation: true, instructor: "both" },
    { startDate: "2025-04-25", endDate: "2025-04-27", name: "Miami Beach Festival", location: "Miami Beach, USA", isLocation: false, link: "https://miamibeachfestival.com", instructor: "both" },
    { startDate: "2025-05-02", endDate: "2025-05-04", name: "Embrazouk", location: "São Paulo, Brazil", isLocation: false, link: "https://embrazouk.com", instructor: "both" },
    { startDate: "2025-05-23", endDate: "2025-05-29", name: "Japan Tour", location: "Various cities, Japan", isLocation: true, instructor: "both" },
    { startDate: "2025-05-30", endDate: "2025-06-01", name: "Japan Workshop", location: "Tokyo, Japan", isLocation: true, instructor: "both" },
    { startDate: "2025-06-06", endDate: "2025-06-08", name: "South Korea Workshop", location: "Seoul, South Korea", isLocation: true, instructor: "both" },
    { startDate: "2025-06-13", endDate: "2025-06-15", name: "Saint-Laurent-d'Aigouze Workshop", location: "Saint-Laurent-d'Aigouze, France", isLocation: true, instructor: "nina" },
    { startDate: "2025-06-16", endDate: "2025-06-23", name: "Paris Workshop", location: "Paris, France", isLocation: true, instructor: "nina" },
    { startDate: "2025-07-18", endDate: "2025-07-20", name: "Auckland Workshop", location: "Auckland, New Zealand", isLocation: true, instructor: "both" },
    { startDate: "2025-07-25", endDate: "2025-07-27", name: "Casa do Zouk", location: "Rio de Janeiro, Brazil", isLocation: false, link: "https://casadozouk.com", instructor: "both" },
    { startDate: "2025-08-01", endDate: "2025-08-03", name: "Melbourne Workshop", location: "Melbourne, Australia", isLocation: true, instructor: "both" },
    { startDate: "2025-08-08", endDate: "2025-08-10", name: "Zouk On", location: "Campinas, Brazil", isLocation: false, link: "https://zoukon.com", instructor: "both" },
    { startDate: "2025-08-29", endDate: "2025-08-31", name: "Malaysia Workshop", location: "Kuala Lumpur, Malaysia", isLocation: true, instructor: "both" },
    { startDate: "2025-09-05", endDate: "2025-09-07", name: "UaiZouk", location: "Uberlândia, Brazil", isLocation: false, link: "https://uaizouk.com", instructor: "both" },
    { startDate: "2025-09-12", endDate: "2025-09-14", name: "ConectZouk", location: "Curitiba, Brazil", isLocation: false, link: "https://conectzouk.com", instructor: "both" },
    { startDate: "2025-10-31", endDate: "2025-11-02", name: "Halloween Zouk Party", location: "New York, USA", isLocation: true, instructor: "both" },
    { startDate: "2025-11-07", endDate: "2025-11-09", name: "Silesian Zouk Festival", location: "Katowice, Poland", isLocation: false, link: "https://silesianzoukfestival.com", instructor: "both" },
    { startDate: "2025-11-14", endDate: "2025-11-16", name: "ZoukTime", location: "Brno, Czech Republic", isLocation: false, link: "https://zouktime.cz", instructor: "both" },
    { startDate: "2025-12-05", endDate: "2025-12-07", name: "Zouk Brasa", location: "Cuiabá, Brazil", isLocation: false, link: "https://zoukbrasa.com", instructor: "both" }
  ],

  // Festivais que não estão na agenda acima, mas aparecem em "Stages we've taught on"
  extraStages: [
    { name: "Brazilian Dance Festival (BDF)", location: "Amsterdam, Netherlands" },
    { name: "Portugal Zouk Festival", location: "Portugal" },
    { name: "Zouk Town", location: "Lyon, France" }
  ],

  videos: [
    { id: "RkggR4Wsbqk", title: "Zouk Town 2022 Demo", description: "Demonstration at Zouk Town, Lyon, France" },
    { id: "Dg7sG2s6sd4", title: "BDF 2022 Demo", description: "Demonstration at Brazilian Dance Festival, Amsterdam" },
    { id: "h5p7bwqecn0", title: "I Have Nothing (BDF 2022)", description: "Choreography at Brazilian Dance Festival, Netherlands" },
    { id: "VGztJuwu-gw", title: "No Lie (ZoukTime 2022)", description: "Performance at ZoukTime, Czech Republic" }
  ]
};
