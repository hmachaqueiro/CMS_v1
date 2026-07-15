window.BOT_KNOWLEDGE = {
  updatedAt: "2026-07-15",
  sources: {
    education: [
      "https://emds.edu.pt/",
      "https://emds.edu.pt/escolas/",
      "https://www.aememmartins.pt/",
      "https://www.aememmartins.pt/contactos/",
      "https://www.efcastro.pt/default.aspx?canal=10",
      "https://colegioherdeirosdofuturo.pt/"
    ],
    urbanism: [
      "https://cm-sintra.pt/",
      "https://cm-sintra.pt/informacoes-e-servicos/regulamentos-municipais/urbanismo-e-obras",
      "https://cm-sintra.pt/informacoes-e-servicos/formularios/urbanismo",
      "https://www.sintraonline.pt/"
    ],
    parking: [
      "https://visitsintra.travel/pt/programe-a-sua-visita/mobilidade",
      "https://www.emes.pt/pages/421",
      "https://parking.sintra.pt/en/Thismayhelp",
      "https://www.parkopedia.pt/estacionamento/sintra/"
    ]
  },
  educationByParish: {
    "Algueirao-Mem Martins": {
      public: [
        "Agrupamento de Escolas do Algueirao",
        "Escola Basica e Secundaria Mestre Domingos Saraiva",
        "Agrupamento de Escolas de Mem Martins",
        "Escola EB 2,3 Maria Alberta Meneres",
        "Agrupamento de Escolas Ferreira de Castro (Ouressa)"
      ],
      private: [
        "Colegio Herdeiros do Futuro"
      ],
      note: "Lista orientada para apoio rapido no chatbot. Confirmar disponibilidade de vagas e moradas atualizadas no Roteiro das Escolas/GesEdu."
    }
  },
  urbanismDepartment: {
    name: "Departamento de Urbanismo - Camara Municipal de Sintra",
    address: "Largo Dr. Virgilio Horta, 2714-501 Sintra",
    phone: "+351 219 238 500",
    email: "municipe@cm-sintra.pt",
    note: "Atendimento e submissao digital podem ser feitos em Sintra Online."
  },
  parkingInVila: [
    {
      id: "pv-portela",
      name: "Parque da Portela de Sintra",
      coords: [38.802533, -9.374314],
      hourlyCost: "Referencia EMES: EUR 0,30 (1a fracao 15 min) + EUR 0,25 por cada fracao seguinte",
      maxDaily: "EUR 1,80",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=38.802533,-9.374314"
    },
    {
      id: "pv-estacao",
      name: "Parque junto a Estacao de Sintra",
      coords: [38.798211, -9.387905],
      hourlyCost: "Tarifario regulado EMES (confirmar no local)",
      maxDaily: "Conforme parque",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=38.798211,-9.387905"
    },
    {
      id: "pv-vila",
      name: "Zona de estacionamento Sintra Vila",
      coords: [38.797393, -9.390035],
      hourlyCost: "Tarifario de zona em vigor (consultar sinalizacao e EMES)",
      maxDaily: "Conforme zona",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=38.797393,-9.390035"
    }
  ]
};
