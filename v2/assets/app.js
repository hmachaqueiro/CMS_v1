(function () {
  const data = window.APP_DATA;
  const requirementsFull = window.REQUIREMENTS_FULL || [];
  const pageType = document.body.dataset.page || "home";
  const moduleKey = document.body.dataset.module || "";

  const reqPrefixMap = {
    identidade: "ID-",
    area: "AP-",
    servicos: "CS-",
    processos: "PR-",
    urbanismo: "URB-",
    reclamacoes: "RP-",
    ocorrencias: "OC-",
    pagamentos: "PG-",
    caixa: "CP-",
    notificacoes: "NT-",
    atendimento: "AT-",
    assistente: "IA-",
    carteira: "CD-",
    app: "APP-",
    participacao: "PP-",
    beneficios: "BA-",
    mobilidade: "MOB-",
    mapas: "GIS-",
    opendata: "OD-",
    backoffice: "BO-",
    analytics: "BI-"
  };

  const modulePageMap = {
    identidade: { title: "Modulo 1 - Identidade, Autenticacao e Conta", reqKey: "identidade", page: "identidade.html" },
    area: { title: "Modulo 2 - Area Pessoal 360", reqKey: "area", page: "area-pessoal.html" },
    servicos: { title: "Modulo 3 - Catalogo de Servicos e Pedidos", reqKey: "servicos", page: "servicos.html" },
    processos: { title: "Modulo 4 - Gestao e Acompanhamento de Processos", reqKey: "processos", page: "processos.html" },
    urbanismo: { title: "Modulo 5 - Urbanismo Digital", reqKey: "urbanismo", page: "urbanismo.html" },
    reclamacoes: { title: "Modulo 6 - Reclamacoes, Peticoes, Sugestoes e Elogios", reqKey: "reclamacoes", page: "reclamacoes.html" },
    ocorrencias: { title: "Modulo 7 - Ocorrencias Urbanas", reqKey: "ocorrencias", page: "ocorrencias.html" },
    pagamentos: { title: "Modulo 8 - Pagamentos, Taxas, Licencas e Multas", reqKey: "pagamentos", page: "pagamentos.html" },
    caixa: { title: "Modulo 9 - Caixa Postal Digital", reqKey: "caixa", page: "caixa-postal.html" },
    notificacoes: { title: "Modulo 10 - Notificacoes e Alertas", reqKey: "notificacoes", page: "notificacoes.html" },
    atendimento: { title: "Modulo 11 - Atendimento e Videoconferencia", reqKey: "atendimento", page: "atendimento.html" },
    assistente: { title: "Modulo 12 - Assistente Virtual Inteligente", reqKey: "assistente", page: "assistente.html" },
    carteira: { title: "Modulo 13 - Carteira Digital", reqKey: "carteira", page: "carteira.html" },
    app: { title: "Modulo 14 - Aplicacao Movel Integrada", reqKey: "app", page: "app.html" },
    participacao: { title: "Modulo 15 - Participacao Publica e OP", reqKey: "participacao", page: "participacao.html" },
    beneficios: { title: "Modulo 16 - Beneficios, Apoios e Equipamentos", reqKey: "beneficios", page: "beneficios.html" },
    mobilidade: { title: "Modulo 17 - Estacionamento e Mobilidade", reqKey: "mobilidade", page: "mobilidade.html" },
    mapas: { title: "Modulo 18 - Informacao Geografica", reqKey: "mapas", page: "mapas.html" },
    opendata: { title: "Modulo 19 - Open Data, Transparencia e APIs", reqKey: "opendata", page: "opendata.html" },
    backoffice: { title: "Modulo 20 - Backoffice e Workflows", reqKey: "backoffice", page: "backoffice.html" },
    analytics: { title: "Modulo 21 - Reporting e Analytics", reqKey: "analytics", page: "analytics.html" }
  };

  const topNavPages = [
    { title: "Visao Geral", page: "index.html" },
    { title: "Roadmap", page: "roadmap.html" },
    { title: "Matriz Completa", page: "requisitos.html" },
    ...Object.values(modulePageMap).map((m) => ({ title: m.title.replace("Modulo ", "M"), page: m.page }))
  ];

  function badgeClass(type) {
    if (type === "ok") return "badge ok";
    if (type === "warn") return "badge warn";
    if (type === "danger") return "badge danger";
    return "badge info";
  }

  function headerAndNav() {
    const activePage = location.pathname.split("/").pop() || "index.html";
    const navHtml = topNavPages
      .map((item) => `<li><a class="${item.page === activePage ? "active" : ""}" href="${item.page}">${item.title}</a></li>`)
      .join("");

    return `
      <header class="topbar">
        <strong>Portal do Municipe Digital - Sintra</strong>
        <div class="meta">
          <span>Municipe: <strong>${data.citizen.name}</strong></span>
          <span>Freguesia: ${data.citizen.parish}</span>
          <span>NIF: ${data.citizen.nif}</span>
        </div>
      </header>
      <div class="topbar" style="padding-top: 8px; padding-bottom: 8px; background: #f3fbff; color: var(--ink); border-bottom: 1px solid var(--line);">
        <div class="search"><input id="globalSearch" type="text" placeholder="Pesquisar servico, requisito ou modulo (ex: URB, pagamentos, AT-003)" /></div>
        <div class="actions">
          <a class="btn" href="caixa-postal.html">Caixa Postal</a>
          <a class="btn" href="notificacoes.html">Alertas</a>
          <a class="btn primary" href="area-pessoal.html">Area Pessoal 360</a>
        </div>
      </div>
      <nav class="nav"><ul class="nav-list">${navHtml}</ul></nav>
    `;
  }

  function hero(title, subtitle) {
    return `<section class="hero"><h1>${title}</h1><p>${subtitle}</p></section>`;
  }

  function homeContent() {
    const modulesCards = data.modules
      .map((m) => {
        return `<article class="card"><div class="kpi-label">${m.code}</div><h3 style="margin: 8px 0 6px;"><a href="${m.page}">${m.title}</a></h3><div style="display:flex;justify-content:space-between;align-items:center;"><span>Funcionalidades mock: ${m.kpi}</span><span class="${badgeClass(m.status)}">${m.status.toUpperCase()}</span></div></article>`;
      })
      .join("");

    const processRows = data.processes
      .map((p) => `<li><div><strong>${p.id}</strong> - ${p.service}<br/><small>${p.status}</small></div><a href="${p.nextPage}">Abrir</a></li>`)
      .join("");

    const payRows = data.payments
      .map((p) => `<li><div><strong>${p.ref}</strong> - ${p.concept}<br/><small>Vencimento: ${p.due}</small></div><span class="${badgeClass(p.priority)}">${p.amount}</span></li>`)
      .join("");

    const shortcutButtons = data.shortcuts
      .map((s) => `<a class="btn" href="${s.page}">${s.label}</a>`)
      .join("");

    return `
      ${hero("Nova Versao Completa do Site Municipal", "Estrutura completa de paginas baseada em requisitos_v2.md, com navegacao total e interoperabilidade entre modulos.")}
      <section class="kpi-grid">
        <article class="card"><div class="kpi-label">Processos Ativos</div><div class="kpi-value">${data.processes.length}</div></article>
        <article class="card"><div class="kpi-label">Pagamentos em Fluxo</div><div class="kpi-value">${data.payments.length}</div></article>
        <article class="card"><div class="kpi-label">Mensagens Oficiais</div><div class="kpi-value">${data.messages.length}</div></article>
        <article class="card"><div class="kpi-label">Requisitos com Mock</div><div class="kpi-value">${requirementsFull.length || data.modules.length}</div></article>
      </section>
      <section class="panel">
        <article class="card">
          <h2 style="margin-top:0;">Estrutura de paginas da plataforma</h2>
          <div class="card-grid three">${modulesCards}</div>
        </article>
        <article class="card">
          <h3 style="margin-top:0;">Atalhos do Antonio Vilela</h3>
          <div class="actions">${shortcutButtons}</div>
          <h3>Interoperabilidade de processos</h3>
          <ul class="list">${processRows}</ul>
          <h3>Interoperabilidade financeira</h3>
          <ul class="list">${payRows}</ul>
        </article>
      </section>
    `;
  }

  function relatedLinksBlock() {
    return `
      <article class="card">
        <h3 style="margin-top:0;">Ligacoes cruzadas</h3>
        <div class="actions">
          <a class="btn" href="processos.html">Processos</a>
          <a class="btn" href="pagamentos.html">Pagamentos</a>
          <a class="btn" href="carteira.html">Documentos</a>
          <a class="btn" href="caixa-postal.html">Mensagens</a>
          <a class="btn" href="atendimento.html">Atendimento</a>
          <a class="btn" href="assistente.html">Assistente IA</a>
        </div>
      </article>
    `;
  }

  function moduleContent(modKey) {
    const mod = modulePageMap[modKey];
    if (!mod) return `<article class="card"><p>Modulo nao configurado.</p></article>`;

    const prefix = reqPrefixMap[mod.reqKey] || "";
    const reqsFromFull = requirementsFull.filter((r) => r.id.startsWith(prefix));
    const reqs = reqsFromFull.length ? reqsFromFull : (data.requirementsSamples[mod.reqKey] || []).map((id) => ({ id, requirement: "Funcionalidade mock" }));
    const reqRows = reqs
      .map((r) => `<tr><td>${r.id}</td><td>${r.requirement}</td><td><span class="badge info">Configuravel</span></td><td>${data.citizen.name}</td></tr>`)
      .join("");

    const mapByPage = (arr) => arr.filter((x) => x.page === mod.page);
    const modProcesses = mapByPage(data.processes);
    const modPayments = mapByPage(data.payments);
    const modMessages = mapByPage(data.messages);
    const modIncidents = mapByPage(data.incidents);
    const modDocs = mapByPage(data.documents);
    const modOpen = mapByPage(data.openData);

    const related = [
      ...modProcesses.map((x) => `${x.id} - ${x.service}`),
      ...modPayments.map((x) => `${x.ref} - ${x.concept}`),
      ...modMessages.map((x) => `${x.id} - ${x.subject}`),
      ...modIncidents.map((x) => `${x.id} - ${x.cat}`),
      ...modDocs.map((x) => `${x.id} - ${x.name}`),
      ...modOpen.map((x) => `${x.dataset} (${x.format})`)
    ];

    const relatedHtml = related.length
      ? related.map((x) => `<li><div>${x}</div><span class="badge ok">Interligado</span></li>`).join("")
      : `<li><div>Sem registos diretos neste modulo; usa dados partilhados da area pessoal e dashboards.</div><span class="badge info">Global</span></li>`;

    return `
      ${hero(mod.title, `Pagina funcional com mock data para requisitos ${prefix || mod.reqKey}.`)}
      <section class="kpi-grid">
        <article class="card"><div class="kpi-label">Requisitos representados</div><div class="kpi-value">${reqs.length}</div></article>
        <article class="card"><div class="kpi-label">Processos ligados</div><div class="kpi-value">${modProcesses.length}</div></article>
        <article class="card"><div class="kpi-label">Registos de suporte</div><div class="kpi-value">${related.length}</div></article>
        <article class="card"><div class="kpi-label">Municipe</div><div class="kpi-value" style="font-size:1.1rem;">${data.citizen.name}</div></article>
      </section>
      <section class="panel">
        <article class="card">
          <h2 style="margin-top:0;">Mock data por funcionalidade do modulo</h2>
          <table class="table">
            <thead><tr><th>ID Requisito</th><th>Descricao Mock</th><th>Estado</th><th>Perfil</th></tr></thead>
            <tbody>${reqRows}</tbody>
          </table>
        </article>
        <article class="card">
          <h3 style="margin-top:0;">Entidades relacionadas</h3>
          <ul class="list">${relatedHtml}</ul>
        </article>
      </section>
      ${relatedLinksBlock()}
    `;
  }

  function requirementsContent() {
    const rows = requirementsFull
      .map((r) => `<tr><td>${r.id}</td><td>${r.requirement}</td><td>${r.priority || "-"}</td><td>${r.section || "-"}</td><td><span class="badge info">Mock ativo</span></td></tr>`)
      .join("");

    return `
      ${hero("Matriz Completa de Funcionalidades", "Inventario integral extraido de requisitos_v2.md com mock data para todas as funcionalidades.")}
      <section class="kpi-grid">
        <article class="card"><div class="kpi-label">Total de requisitos</div><div class="kpi-value">${requirementsFull.length}</div></article>
        <article class="card"><div class="kpi-label">Modulos funcionais</div><div class="kpi-value">21</div></article>
        <article class="card"><div class="kpi-label">Nao funcionais</div><div class="kpi-value">40</div></article>
        <article class="card"><div class="kpi-label">Implementacao</div><div class="kpi-value">12</div></article>
      </section>
      <article class="card">
        <h2 style="margin-top:0;">Tabela de requisitos e mock data</h2>
        <table class="table">
          <thead><tr><th>ID</th><th>Funcionalidade</th><th>Prioridade</th><th>Secao</th><th>Estado</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </article>
      ${relatedLinksBlock()}
    `;
  }

  function roadmapContent() {
    const rows = [
      ["Fase 0", "Governance e arquitetura", "M0-M1"],
      ["Fase 1", "Identidade, area pessoal, catalogo", "M2-M4"],
      ["Fase 2", "Processos, urbanismo, pagamentos", "M5-M7"],
      ["Fase 3", "Caixa postal, notificacoes, atendimento", "M8-M10"],
      ["Fase 4", "App, carteira, dashboard avancado", "M11-M13"],
      ["Fase 5", "Assistente IA e analytics", "M14-M16"],
      ["Fase 6", "Interoperabilidade avancada", "M17-M19"],
      ["Fase 7", "Open data e participacao", "M20-M22"],
      ["Fase 8", "Otimizacao e transicao", "M23-M24"]
    ];

    const tableRows = rows
      .map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><a href="index.html">Abrir detalhes</a></td></tr>`)
      .join("");

    return `
      ${hero("Roadmap de Implementacao", "Planeamento incremental alinhado ao requisitos_v2.md.")}
      <article class="card">
        <h2 style="margin-top:0;">Timeline funcional</h2>
        <table class="table">
          <thead><tr><th>Fase</th><th>Entrega</th><th>Periodo</th><th>Navegar</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </article>
      ${relatedLinksBlock()}
    `;
  }

  function footer() {
    return `<footer class="footer">Nova versao web com estrutura completa de paginas, navegacao integrada e dados mock por modulo. Perfil ativo: ${data.citizen.name}.</footer>`;
  }

  function render() {
    const root = document.getElementById("app");
    if (!root) return;

    let content = "";
    if (pageType === "home") content = homeContent();
    if (pageType === "roadmap") content = roadmapContent();
    if (pageType === "requirements") content = requirementsContent();
    if (pageType === "module") content = moduleContent(moduleKey);

    root.innerHTML = `
      <main class="page">
        ${headerAndNav()}
        <section class="container">${content}</section>
        ${footer()}
      </main>
    `;

    wireGlobalSearch();
  }

  function wireGlobalSearch() {
    const input = document.getElementById("globalSearch");
    if (!input) return;

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const moduleByCode = data.modules.find((m) => m.code.toLowerCase().includes(term) || m.title.toLowerCase().includes(term));
      if (moduleByCode) {
        location.href = moduleByCode.page;
        return;
      }

      const foundFullReq = requirementsFull.find((r) => r.id.toLowerCase() === term);
      if (foundFullReq) {
        const linked = Object.entries(reqPrefixMap).find(([, prefix]) => foundFullReq.id.startsWith(prefix));
        if (linked && modulePageMap[linked[0]]) {
          location.href = modulePageMap[linked[0]].page;
          return;
        }
      }

      const foundReq = Object.entries(data.requirementsSamples).find(([, arr]) => arr.some((id) => id.toLowerCase() === term));
      if (foundReq && modulePageMap[foundReq[0]]) {
        location.href = modulePageMap[foundReq[0]].page;
        return;
      }

      const processHit = data.processes.find((p) => p.id.toLowerCase().includes(term) || p.service.toLowerCase().includes(term));
      if (processHit) {
        location.href = processHit.nextPage;
        return;
      }

      alert("Sem resultado direto. Experimente codigo de modulo (ex: URB) ou requisito (ex: IA-011).");
    });
  }

  render();
})();
