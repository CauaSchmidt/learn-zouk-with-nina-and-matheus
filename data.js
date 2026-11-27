/*
  CONTEÚDO EDITÁVEL DO SITE
  ------------------------------------------------------------
  Para atualizar agenda, cursos, vídeos ou contatos, mexa só neste arquivo.

  Textos com tradução usam { en: "...", pt: "...", es: "..." }.
  Se só tiver o inglês, pode escrever o texto direto, entre aspas.

  Eventos (agenda):
    - startDate / endDate no formato "AAAA-MM-DD"
    - instructor: "both" (os dois), "nina" ou "matheus"
    - location: "Cidade, País" (ex.: "Denver, USA")
    - isLocation: true  = workshop numa cidade (mostra botão de aula particular pelo WhatsApp)
                  false = festival/congresso (entra também na faixa de palcos)
    - link: site do evento (opcional)
    - instagram: Instagram do evento (opcional)
    Se tiver link ou instagram, aparece o botão "View more" com os dois.
  Cada fim de semana do calendário mostra os eventos daquele fim de semana.
  Fim de semana sem evento aparece como "livre", com botão para convidar.
*/
window.SITE = {
  contact: {
    whatsapp: "5519992955198",
    phoneLabel: "+55 19 99295-5198",
    email: "ninaandmatheus@gmail.com",
    instagram: "ninaandmatheus"
  },

  links: {
    lab: "https://lab.dance/n&m",
    youtube: "https://www.youtube.com/channel/UCXe6U9JXZSR_pXQboFrRehA",
    instagram: "https://www.instagram.com/ninaandmatheus",
    instagramNina: "https://www.instagram.com/ninadarbello",
    instagramMatheus: "https://www.instagram.com/thsfranco"
  },

  // Período mostrado no calendário (mês inicial e mês final)
  calendar: { from: "2026-12", to: "2027-12" },

  // Cursos à venda no Lab (lab.dance)
  products: [
    {
      title: "Welcome To Zouk",
      tag: { en: "Foundations", pt: "Fundamentos", es: "Fundamentos" },
      description: {
        en: "The Zouk foundations course by Nina & Matheus.",
        pt: "O curso de fundamentos de Zouk da Nina e do Matheus.",
        es: "El curso de fundamentos de Zouk de Nina y Matheus."
      },
      price: "US$ 79",
      url: "https://lab.dance/n&m/product/cmbmrevq60004rsu91t1i9d0l?lid=cm6o3o8ve004n9xkl8kbho4pj",
      image: "https://i.imgur.com/0YFIBnc.jpeg"
    },
    {
      title: "Choreo Journey 1",
      tag: { en: "Class videos", pt: "Vídeos das aulas", es: "Videos de las clases" },
      description: {
        en: "Six mini choreographies in Zouk or Lambada from Nina's first Solo Choreo Journey, broken down with the technique behind each move. For leaders and followers.",
        pt: "Seis mini coreografias de Zouk ou Lambada do primeiro Solo Choreo Journey da Nina, explicadas com a técnica por trás de cada movimento. Para condutores e conduzidos.",
        es: "Seis mini coreografías de Zouk o Lambada del primer Solo Choreo Journey de Nina, explicadas con la técnica detrás de cada movimiento. Para leaders y followers."
      },
      price: "US$ 60",
      url: "https://lab.dance/n&m/product/cmluueei002mnivq8itm6hfc2?lid=cm6o3o8ve004n9xkl8kbho4pj",
      image: "https://i.imgur.com/GLIf1mo.jpeg"
    }
  ],

  // Mentoria (Choreo Journey). Quando tiver o link do Lab, coloque em "url".
  // Sem link, o botão abre o WhatsApp.
  mentoring: { url: "" },

  events: [
    // ---- Dezembro 2026 (fonte: lab.dance/n&m) ----
    { startDate: "2026-12-03", endDate: "2026-12-07", name: "Elevation Zouk Festival", location: "Denver, USA", isLocation: false, link: "https://www.elevationdenverzouk.com/", instructor: "both" },
    { startDate: "2026-12-17", endDate: "2026-12-22", name: "One Zouk Brazilian Congress", location: "São Paulo, Brazil", isLocation: false, instructor: "both" },

    // ---- Adicione aqui as datas de 2027 ----

    // ---- Já passaram (ficam como histórico e na faixa de palcos) ----
    { startDate: "2025-01-08", endDate: "2025-01-12", name: "Rio Zouk Congress", location: "Rio de Janeiro, Brazil", isLocation: false, link: "https://lnk.bio/riozoukcongress", instructor: "both" },
    { startDate: "2025-01-16", endDate: "2025-01-20", name: "International Zouk Congress (IZC)", location: "Miami, USA", isLocation: false, instructor: "both" },
    { startDate: "2025-02-21", endDate: "2025-02-23", name: "Taiwan Zouk Festival", location: "Taipei, Taiwan", isLocation: false, link: "https://taiwanzoukfestival.com", instructor: "both" },
    { startDate: "2025-04-25", endDate: "2025-04-27", name: "Miami Beach Festival", location: "Miami Beach, USA", isLocation: false, link: "https://miamibeachfestival.com", instructor: "both" },
    { startDate: "2025-05-02", endDate: "2025-05-04", name: "Embrazouk", location: "São Paulo, Brazil", isLocation: false, link: "https://embrazouk.com", instructor: "both" },
    { startDate: "2025-07-25", endDate: "2025-07-27", name: "Casa do Zouk", location: "Rio de Janeiro, Brazil", isLocation: false, link: "https://casadozouk.com", instructor: "both" },
    { startDate: "2025-08-08", endDate: "2025-08-10", name: "Zouk On", location: "Campinas, Brazil", isLocation: false, link: "https://zoukon.com", instructor: "both" },
    { startDate: "2025-09-05", endDate: "2025-09-07", name: "UaiZouk", location: "Uberlândia, Brazil", isLocation: false, link: "https://uaizouk.com", instructor: "both" },
    { startDate: "2025-09-12", endDate: "2025-09-14", name: "ConectZouk", location: "Curitiba, Brazil", isLocation: false, link: "https://conectzouk.com", instructor: "both" },
    { startDate: "2025-11-07", endDate: "2025-11-09", name: "Silesian Zouk Festival", location: "Katowice, Poland", isLocation: false, link: "https://silesianzoukfestival.com", instructor: "both" },
    { startDate: "2025-11-14", endDate: "2025-11-16", name: "ZoukTime", location: "Brno, Czech Republic", isLocation: false, link: "https://zouktime.cz", instructor: "both" },
    { startDate: "2025-12-05", endDate: "2025-12-07", name: "Zouk Brasa", location: "Cuiabá, Brazil", isLocation: false, link: "https://zoukbrasa.com", instructor: "both" },
    { startDate: "2026-10-15", endDate: "2026-10-18", name: "Zouk Sense", location: "", isLocation: false, instructor: "both" },
    { startDate: "2026-11-05", endDate: "2026-11-08", name: "Zouk Fire", location: "", isLocation: false, instructor: "both" }
  ],

  // Festivais que não estão na agenda acima, mas aparecem na faixa de palcos
  extraStages: [
    { name: "Brazilian Dance Festival (BDF)", location: "Amsterdam, Netherlands" },
    { name: "Portugal Zouk Festival", location: "Portugal" },
    { name: "Zouk Town", location: "Lyon, France" }
  ],

  videos: [
    { id: "RkggR4Wsbqk", title: "Zouk Town 2022 Demo",
      description: { en: "Demonstration at Zouk Town, Lyon, France", pt: "Demonstração no Zouk Town, Lyon, França", es: "Demostración en Zouk Town, Lyon, Francia" } },
    { id: "Dg7sG2s6sd4", title: "BDF 2022 Demo",
      description: { en: "Demonstration at Brazilian Dance Festival, Amsterdam", pt: "Demonstração no Brazilian Dance Festival, Amsterdã", es: "Demostración en el Brazilian Dance Festival, Ámsterdam" } },
    { id: "h5p7bwqecn0", title: "I Have Nothing (BDF 2022)",
      description: { en: "Choreography at Brazilian Dance Festival, Netherlands", pt: "Coreografia no Brazilian Dance Festival, Holanda", es: "Coreografía en el Brazilian Dance Festival, Países Bajos" } },
    { id: "VGztJuwu-gw", title: "No Lie (ZoukTime 2022)",
      description: { en: "Performance at ZoukTime, Czech Republic", pt: "Apresentação no ZoukTime, República Tcheca", es: "Presentación en ZoukTime, República Checa" } }
  ]
};
