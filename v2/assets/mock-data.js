window.APP_DATA = {
  citizen: {
    name: "António Vilela",
    nif: "238 445 901",
    email: "antonio.vilela@exemplo.pt",
    phone: "+351 915 222 440",
    parish: "Algueirão-Mem Martins"
  },
  shortcuts: [
    { label: "Novo pedido", page: "servicos.html" },
    { label: "Reportar ocorrência", page: "ocorrencias.html" },
    { label: "Pagar taxas", page: "pagamentos.html" },
    { label: "Marcar atendimento", page: "atendimento.html" },
    { label: "Assistente virtual", page: "assistente.html" }
  ],
  modules: [
    { key: "m1", title: "Identidade e Conta", page: "identidade.html", code: "ID", kpi: 10, status: "ok" },
    { key: "m2", title: "Area Pessoal 360", page: "area-pessoal.html", code: "AP", kpi: 10, status: "ok" },
    { key: "m3", title: "Catalogo e Pedidos", page: "servicos.html", code: "CS", kpi: 12, status: "ok" },
    { key: "m4", title: "Gestao de Processos", page: "processos.html", code: "PR", kpi: 10, status: "warn" },
    { key: "m5", title: "Urbanismo Digital", page: "urbanismo.html", code: "URB", kpi: 10, status: "warn" },
    { key: "m6", title: "Reclamacoes e Peticoes", page: "reclamacoes.html", code: "RP", kpi: 10, status: "ok" },
    { key: "m7", title: "Ocorrencias Urbanas", page: "ocorrencias.html", code: "OC", kpi: 12, status: "ok" },
    { key: "m8", title: "Pagamentos e Taxas", page: "pagamentos.html", code: "PG", kpi: 10, status: "ok" },
    { key: "m9", title: "Caixa Postal", page: "caixa-postal.html", code: "CP", kpi: 10, status: "ok" },
    { key: "m10", title: "Notificacoes", page: "notificacoes.html", code: "NT", kpi: 10, status: "ok" },
    { key: "m11", title: "Atendimento e Video", page: "atendimento.html", code: "AT", kpi: 10, status: "ok" },
    { key: "m12", title: "Assistente IA", page: "assistente.html", code: "IA", kpi: 12, status: "warn" },
    { key: "m13", title: "Carteira Digital", page: "carteira.html", code: "CD", kpi: 10, status: "ok" },
    { key: "m14", title: "App Movel", page: "app.html", code: "APP", kpi: 12, status: "ok" },
    { key: "m15", title: "Participacao Publica", page: "participacao.html", code: "PP", kpi: 8, status: "warn" },
    { key: "m16", title: "Beneficios e Apoios", page: "beneficios.html", code: "BA", kpi: 8, status: "ok" },
    { key: "m17", title: "Mobilidade", page: "mobilidade.html", code: "MOB", kpi: 8, status: "ok" },
    { key: "m18", title: "Mapas e Localizacao", page: "mapas.html", code: "GIS", kpi: 6, status: "warn" },
    { key: "m19", title: "Open Data e APIs", page: "opendata.html", code: "OD", kpi: 12, status: "warn" },
    { key: "m20", title: "Backoffice", page: "backoffice.html", code: "BO", kpi: 12, status: "ok" },
    { key: "m21", title: "Analytics e Reporting", page: "analytics.html", code: "BI", kpi: 8, status: "ok" }
  ],
  processes: [
    { id: "PR-2026-00192", service: "Licenca de Obras", status: "Em analise", nextPage: "urbanismo.html", priority: "warn" },
    { id: "PR-2026-00231", service: "Pedido de Dístico Residente", status: "Submetido", nextPage: "mobilidade.html", priority: "info" },
    { id: "PR-2026-00141", service: "Reserva de Pavilhao", status: "Deferido", nextPage: "beneficios.html", priority: "ok" },
    { id: "PR-2026-00107", service: "Reclamacao de Ruido", status: "A aguardar elementos", nextPage: "reclamacoes.html", priority: "danger" }
  ],
  payments: [
    { ref: "PG-998-442-11", concept: "Taxa de urbanismo", amount: "245,00 EUR", due: "2026-07-21", status: "Pendente", nextPage: "pagamentos.html", priority: "danger" },
    { ref: "PG-887-551-02", concept: "Taxa de ocupacao de via publica", amount: "58,00 EUR", due: "2026-08-02", status: "Por pagar", nextPage: "mobilidade.html", priority: "warn" },
    { ref: "PG-771-210-45", concept: "Renovacao de dístico", amount: "42,00 EUR", due: "Pago", status: "Liquidado", nextPage: "pagamentos.html", priority: "ok" }
  ],
  messages: [
    { id: "CP-1102", subject: "Pedido de elementos adicionais", type: "Formal", page: "caixa-postal.html", date: "Hoje 09:41", priority: "warn" },
    { id: "CP-1096", subject: "Comprovativo de pagamento emitido", type: "Informativa", page: "carteira.html", date: "Ontem", priority: "ok" },
    { id: "CP-1088", subject: "Convocatoria para consulta publica", type: "Participacao", page: "participacao.html", date: "12 Jul", priority: "info" }
  ],
  incidents: [
    { id: "OC-2026-044", cat: "Iluminacao", place: "Rua da Esperanca", state: "Em execucao", page: "ocorrencias.html", priority: "warn" },
    { id: "OC-2026-039", cat: "Residuos", place: "Av. de Sintra", state: "Resolvida", page: "ocorrencias.html", priority: "ok" },
    { id: "OC-2026-031", cat: "Pavimento", place: "Rio de Mouro", state: "Submetida", page: "ocorrencias.html", priority: "info" }
  ],
  appointments: [
    { id: "AT-2201", mode: "Videoatendimento", service: "Urbanismo", when: "2026-07-16 10:00", page: "atendimento.html" },
    { id: "AT-2202", mode: "Presencial", service: "Apoio Social", when: "2026-07-18 14:30", page: "atendimento.html" }
  ],
  documents: [
    { id: "CD-778", name: "Certidao de obras", validity: "Valida ate 2027-04-30", page: "carteira.html", priority: "ok" },
    { id: "CD-742", name: "Alvara de ocupacao", validity: "Expira em 9 dias", page: "carteira.html", priority: "warn" },
    { id: "CD-701", name: "Comprovativo de pagamento", validity: "Arquivo permanente", page: "carteira.html", priority: "info" }
  ],
  openData: [
    { dataset: "Ocorrencias por freguesia", format: "CSV/JSON", update: "Semanal", page: "opendata.html" },
    { dataset: "Licencas urbanisticas", format: "CSV/API", update: "Mensal", page: "opendata.html" },
    { dataset: "Execucao orcamental OP", format: "CSV", update: "Trimestral", page: "participacao.html" }
  ],
  requirementsSamples: {
    identidade: ["ID-001", "ID-003", "ID-004", "ID-008", "ID-010"],
    area: ["AP-001", "AP-003", "AP-006", "AP-008", "AP-010"],
    servicos: ["CS-001", "CS-004", "CS-005", "CS-009", "CS-011"],
    processos: ["PR-001", "PR-003", "PR-005", "PR-008", "PR-010"],
    urbanismo: ["URB-001", "URB-003", "URB-006", "URB-008", "URB-010"],
    reclamacoes: ["RP-001", "RP-002", "RP-006", "RP-008", "RP-010"],
    ocorrencias: ["OC-001", "OC-002", "OC-005", "OC-008", "OC-012"],
    pagamentos: ["PG-001", "PG-003", "PG-005", "PG-008", "PG-010"],
    caixa: ["CP-001", "CP-003", "CP-006", "CP-008", "CP-010"],
    notificacoes: ["NT-001", "NT-004", "NT-006", "NT-008", "NT-010"],
    atendimento: ["AT-001", "AT-003", "AT-005", "AT-008", "AT-010"],
    assistente: ["IA-001", "IA-003", "IA-006", "IA-011", "IA-012"],
    carteira: ["CD-001", "CD-005", "CD-006", "CD-009", "CD-010"],
    app: ["APP-001", "APP-004", "APP-006", "APP-009", "APP-012"],
    participacao: ["PP-001", "PP-004", "PP-005", "PP-006", "PP-008"],
    beneficios: ["BA-001", "BA-003", "BA-004", "BA-007", "BA-008"],
    mobilidade: ["MOB-001", "MOB-003", "MOB-004", "MOB-005", "MOB-007"],
    mapas: ["GIS-001", "GIS-002", "GIS-003", "GIS-004", "GIS-006"],
    opendata: ["OD-001", "OD-005", "OD-006", "OD-010", "OD-012"],
    backoffice: ["BO-001", "BO-004", "BO-005", "BO-010", "BO-012"],
    analytics: ["BI-001", "BI-003", "BI-004", "BI-006", "BI-008"]
  }
};
