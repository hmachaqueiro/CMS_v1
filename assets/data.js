window.CMS_DATA = {
  citizen: {
    name: "António Vilela",
    email: "antonio.vilela@municipe.pt",
    phone: "+351 915 222 440",
    nif: "238445901",
    parish: "Algueirao-Mem Martins"
  },
  pages: [
    ["Início", "index.html"],
    ["Área Pessoal", "portal.html"],
    ["Identidade", "identidade.html"],
    ["Serviços", "servicos.html"],
    ["Processos", "processos.html"],
    ["Urbanismo", "urbanismo.html"],
    ["Reclamações", "reclamacoes.html"],
    ["Ocorrências", "ocorrencias.html"],
    ["Pagamentos", "pagamentos.html"],
    ["Caixa Postal", "caixa-postal.html"],
    ["Notificações", "notificacoes.html"],
    ["Atendimento", "atendimento.html"],
    ["Assistente IA", "assistente.html"],
    ["Carteira", "carteira.html"],
    ["App Móvel", "app.html"],
    ["Participação", "participacao.html"],
    ["Benefícios", "beneficios.html"],
    ["Mobilidade", "mobilidade.html"],
    ["Mapas", "mapas.html"],
    ["Open Data", "opendata.html"],
    ["Backoffice", "backoffice.html"],
    ["Analytics", "analytics.html"],
    ["Roadmap", "roadmap.html"],
    ["Matriz", "requisitos.html"]
  ],
  requirementsByPage: {
    identidade: ["ID-001", "ID-002", "ID-004", "ID-006", "ID-008", "ID-010"],
    servicos: ["CS-001", "CS-003", "CS-004", "CS-005", "CS-011"],
    processos: ["PR-001", "PR-002", "PR-003", "PR-005", "PR-009"],
    urbanismo: ["URB-001", "URB-002", "URB-003", "URB-006", "URB-008"],
    reclamacoes: ["RP-001", "RP-002", "RP-005", "RP-006", "RP-008"],
    ocorrencias: ["OC-001", "OC-002", "OC-005", "OC-007", "OC-010"],
    pagamentos: ["PG-001", "PG-003", "PG-004", "PG-005", "PG-010"],
    "caixa-postal": ["CP-001", "CP-003", "CP-004", "CP-006", "CP-010"],
    notificacoes: ["NT-001", "NT-004", "NT-006", "NT-008", "NT-010"],
    atendimento: ["AT-001", "AT-002", "AT-003", "AT-006", "AT-008"],
    assistente: ["IA-001", "IA-003", "IA-005", "IA-007", "IA-011"],
    carteira: ["CD-001", "CD-003", "CD-005", "CD-006", "CD-010"],
    app: ["APP-001", "APP-004", "APP-005", "APP-006", "APP-012"],
    participacao: ["PP-001", "PP-003", "PP-004", "PP-005", "PP-008"],
    beneficios: ["BA-001", "BA-003", "BA-004", "BA-006", "BA-008"],
    mobilidade: ["MOB-001", "MOB-003", "MOB-004", "MOB-005", "MOB-008"],
    mapas: ["GIS-001", "GIS-002", "GIS-003", "GIS-004", "GIS-006"],
    opendata: ["OD-001", "OD-003", "OD-005", "OD-006", "OD-012"],
    backoffice: ["BO-001", "BO-004", "BO-005", "BO-006", "BO-010"],
    analytics: ["BI-001", "BI-002", "BI-004", "BI-006", "BI-008"]
  },
  services: [
    { id: "SV-001", name: "Licença de obras", area: "Urbanismo", fee: 245, page: "urbanismo.html" },
    { id: "SV-002", name: "Dístico residente", area: "Mobilidade", fee: 42, page: "mobilidade.html" },
    { id: "SV-003", name: "Reserva de pavilhão", area: "Equipamentos", fee: 58, page: "beneficios.html" },
    { id: "SV-004", name: "Reclamação municipal", area: "Atendimento", fee: 0, page: "reclamacoes.html" }
  ],
  defaults: {
    processes: [
      { id: "PR-2026-00192", type: "Licença de obras", status: "Em analise", owner: "Urbanismo", due: "2026-07-24" },
      { id: "PR-2026-00231", type: "Dístico residente", status: "Submetido", owner: "Mobilidade", due: "2026-07-28" }
    ],
    payments: [
      { ref: "PG-998-442-11", concept: "Taxa de urbanismo", amount: 245, status: "Pendente", due: "2026-07-21" },
      { ref: "PG-887-551-02", concept: "Taxa de mobilidade", amount: 58, status: "Pendente", due: "2026-07-22" }
    ],
    messages: [
      { id: "CP-1102", subject: "Pedido de elementos", kind: "Formal", read: false },
      { id: "CP-1096", subject: "Comprovativo disponível", kind: "Informativa", read: true }
    ],
    incidents: [
      { id: "OC-2026-044", cat: "Iluminacao", place: "Rua da Esperanca", status: "Em execucao" },
      { id: "OC-2026-039", cat: "Residuos", place: "Avenida de Sintra", status: "Resolvida" }
    ],
    appointments: [
      { id: "AT-2201", mode: "Video", service: "Urbanismo", when: "2026-07-16 10:00" }
    ],
    documents: [
      { id: "CD-778", name: "Certidao de obras", validUntil: "2027-04-30", state: "Valido" }
    ],
    consents: [
      { topic: "Email transacional", enabled: true },
      { topic: "SMS alertas", enabled: true },
      { topic: "Push app", enabled: false }
    ]
  }
};
