window.CMS_DATA = {
  citizen: {
    name: "Antonio Vilela",
    email: "antonio.vilela@municipe.pt",
    phone: "+351915222440",
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
    ["Atendimento", "atendimento.html"],
    ["Assistente", "assistente.html"],
    ["Carteira", "carteira.html"],
    ["App Móvel", "app.html"],
    ["Participação", "participacao.html"],
    ["Benefícios", "beneficios.html"],
    ["Mobilidade", "mobilidade.html"],
    ["Mapas", "mapas.html"],
    ["Portal Institucional", "institucional.html"],
    ["Associativismo", "associativismo.html"],
    ["Ativos", "ativos.html"],
    ["Contratos", "contratos.html"],
    ["Educação", "educacao.html"],
    ["Estacionamento", "estacionamento.html"],
    ["Campanhas", "campanhas.html"],
    ["Multiportal", "multiportal.html"]
  ],
  services: [
    { id: "SV-001", name: "Licenca de obras", area: "Urbanismo", fee: 245 },
    { id: "SV-002", name: "Distico residente", area: "Mobilidade", fee: 42 },
    { id: "SV-003", name: "Reserva de pavilhao", area: "Equipamentos", fee: 58 },
    { id: "SV-004", name: "Reclamacao municipal", area: "Atendimento", fee: 0 },
    { id: "SV-005", name: "Apoio associativo", area: "Associativismo", fee: 0 }
  ],
  defaults: {
    processes: [
      { id: "PR-2026-00192", type: "Licenca de obras", status: "Em analise", owner: "Urbanismo", due: "2026-07-24" },
      { id: "PR-2026-00231", type: "Distico residente", status: "Submetido", owner: "Mobilidade", due: "2026-07-28" }
    ],
    payments: [
      { ref: "PG-998-442-11", concept: "Taxa de urbanismo", amount: 245, status: "Pendente", due: "2026-07-21" },
      { ref: "PG-887-551-02", concept: "Taxa de mobilidade", amount: 58, status: "Pendente", due: "2026-07-22" }
    ],
    messages: [
      { id: "CP-1102", subject: "Pedido de elementos", kind: "Formal", read: false },
      { id: "CP-1096", subject: "Comprovativo disponivel", kind: "Informativa", read: true }
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
    ],
    associations: [
      { id: "AS-001", name: "Associacao Cultural Mem Martins", status: "Ativa", support: "Em avaliacao" }
    ],
    assets: [
      { id: "GA-101", name: "Escola Basica Monte Abraao", type: "Imovel", state: "Operacional", owner: "Educacao" },
      { id: "GA-102", name: "Viatura Recolha RSU 14", type: "Equipamento", state: "Manutencao", owner: "Ambiente" }
    ],
    contracts: [
      { id: "GC-220", supplier: "Construtora Serra", object: "Requalificacao arruamentos", physical: 55, financial: 47, status: "Em execucao" }
    ],
    schoolRequests: [
      { id: "ED-501", type: "Transporte escolar", student: "Rita Vilela", status: "Submetido" }
    ],
    campaigns: [
      { id: "CM-700", name: "Alerta de calor", channel: "SMS", segment: "Sintra Vila", sent: 3200 }
    ],
    portals: [
      { id: "MP-01", name: "Municipio Sintra", theme: "Azul", health: "Saudavel" },
      { id: "MP-02", name: "Intermunicipal Oeste", theme: "Verde", health: "Saudavel" }
    ],
    parkingZones: [
      { id: "ME-A", name: "Sintra Vila", tariff: 1.2, occupancy: 78 },
      { id: "ME-B", name: "Portela", tariff: 0.9, occupancy: 64 }
    ],
    mobile: {
      os: "Android",
      push: "Ativo",
      readings: [
        { id: "AM-R1", meter: "AG-44921", value: 324, date: "2026-07-10" }
      ],
      bulky: [
        { id: "AM-M1", address: "Rua do Pinhal 22", when: "2026-07-18", status: "Agendado" }
      ],
      hearings: [
        { id: "AM-A1", topic: "Mobilidade local", when: "2026-07-25 15:00", status: "Confirmada" }
      ],
      alertAreas: ["Algueirao-Mem Martins"]
    }
  }
};
