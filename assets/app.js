(function () {
  const appData = window.CMS_DATA || {};
  const botData = window.BOT_KNOWLEDGE || {};
  const pageType = document.body.dataset.page || "home";
  const currentFile = location.pathname.split("/").pop() || "index.html";

  const stateKey = "cmsintra-state-v1";
  const authKey = "cmsintra-auth-v1";
  const publicPages = ["index.html", "login.html"];

  function initialState() {
    return {
      profile: { ...appData.citizen },
      processes: [...(appData.defaults?.processes || [])],
      payments: [...(appData.defaults?.payments || [])],
      messages: [...(appData.defaults?.messages || [])],
      incidents: [...(appData.defaults?.incidents || [])],
      appointments: [...(appData.defaults?.appointments || [])],
      documents: [...(appData.defaults?.documents || [])],
      consents: [...(appData.defaults?.consents || [])],
      votes: [],
      tasks: [],
      datasetsRequests: [],
      shares: []
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(stateKey);
      if (!saved) return initialState();
      return { ...initialState(), ...JSON.parse(saved) };
    } catch {
      return initialState();
    }
  }

  function getAuth() {
    try {
      const raw = localStorage.getItem(authKey);
      if (!raw) return { loggedIn: false };
      return JSON.parse(raw);
    } catch {
      return { loggedIn: false };
    }
  }

  function setAuth(loggedIn, user) {
    localStorage.setItem(authKey, JSON.stringify({ loggedIn, user }));
  }

  const state = loadState();
  const auth = getAuth();

  if (!auth.loggedIn && !publicPages.includes(currentFile)) {
    location.href = "login.html";
    return;
  }

  function persist() {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function makeId(prefix) {
    const t = Date.now().toString().slice(-6);
    return prefix + "-" + t;
  }

  function activePageName() {
    const found = (appData.pages || []).find((p) => p[1] === currentFile);
    return found ? found[0] : "Portal";
  }

  function badge(status) {
    if (["Pago", "Valido", "Resolvida", "Ativo", "Deferido", "Concluido"].includes(status)) return `<span class="badge ok">${status}</span>`;
    if (["Pendente", "Em analise", "Em execucao", "Submetido"].includes(status)) return `<span class="badge warn">${status}</span>`;
    if (["Rejeitado", "Atrasado"].includes(status)) return `<span class="badge danger">${status}</span>`;
    return `<span class="badge info">${status}</span>`;
  }

  function kpiCard(label, value) {
    return `<article class="card"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></article>`;
  }

  function navItems() {
    const hiddenMenus = new Set(["notificacoes.html", "opendata.html", "backoffice.html", "roadmap.html", "requisitos.html", "analytics.html"]);
    if (!auth.loggedIn) {
      return [["Início", "index.html"], ["Autenticação", "login.html"]];
    }
    return (appData.pages || []).filter(([, href]) => !hiddenMenus.has(href));
  }

  function botWidget() {
    return `
      <button id="botFab" class="bot-fab" aria-label="Abrir assistente">💬</button>
      <section id="botPanel" class="bot-panel" style="display:none;">
        <header class="bot-header">
          <strong>Assistente Sintra</strong>
          <button id="botClose" class="bot-close" aria-label="Fechar">×</button>
        </header>
        <div id="botMessages" class="bot-messages">
          <div class="bot-msg bot-msg-ai">Posso ajudar com escolas na freguesia, morada do urbanismo e estacionamento na Vila de Sintra.</div>
        </div>
        <div id="botMapWrap" class="bot-map-wrap" style="display:none;">
          <div id="botMap" class="bot-map"></div>
        </div>
        <form id="botForm" class="bot-form">
          <input id="botInput" type="text" placeholder="Escreva a sua pergunta" />
          <button class="btn primary" type="submit">Enviar</button>
        </form>
      </section>
    `;
  }

  function shellStart() {
    const items = navItems().map(([name, href]) => `<li><a class="${href === currentFile ? "active" : ""}" href="${href}">${name}</a></li>`).join("");
    const userInfo = auth.loggedIn && currentFile !== "index.html"
      ? `<div class="header-info"><span class="pill">Municipe: ${state.profile.name}</span><span class="pill">Freguesia: ${state.profile.parish}</span></div>`
      : `<div class="header-info"><span class="pill">Portal municipal</span></div>`;

    const searchBox = currentFile === "login.html"
      ? ""
      : `<div class="search"><input id="globalSearch" type="text" placeholder="Pesquisar modulo ou processo" /></div>`;

    const actions = auth.loggedIn
      ? `<div class="header-actions"><button class="btn" data-go="portal.html">Area Pessoal</button><button class="btn" id="btnLogout">Terminar sessao</button></div>`
      : `<div class="header-actions"><button class="btn primary" data-go="login.html">Autenticar</button></div>`;

    return `
      <div class="app-shell">
        <aside class="side-nav">
          <div class="side-brand">
            <img src="assets/Sintra_logo.png" alt="Sintra logo" />
            <div>
              <h1>Câmara Municipal de Sintra</h1>
              <small>Portal do Munícipe</small>
            </div>
          </div>
          <nav><ul>${items}</ul></nav>
        </aside>
        <div class="content-area">
          <header class="site-header">
            <div class="header-row">
              ${userInfo}
              ${searchBox}
              ${actions}
            </div>
          </header>
          <main>
    `;
  }

  function shellEnd() {
    return `</main><footer>Portal funcional em ambiente mock.</footer>${botWidget()}</div></div>`;
  }

  function landingPage() {
    return `
      <section class="hero"><h2>Portal do Munícipe Digital de Sintra</h2><p>Aceda aos serviços municipais online com autenticação segura.</p></section>
      <section class="grid two">
        <article class="card">
          <h3>Serviços disponíveis</h3>
          <ul class="list">
            <li><span>Pedidos e processos</span><span>${badge("Ativo")}</span></li>
            <li><span>Urbanismo digital</span><span>${badge("Ativo")}</span></li>
            <li><span>Pagamentos e carteira digital</span><span>${badge("Ativo")}</span></li>
            <li><span>Atendimento e assistente virtual</span><span>${badge("Ativo")}</span></li>
          </ul>
        </article>
        <article class="card">
          <h3>Acesso ao portal</h3>
          <p>Para consultar dados pessoais e submeter operações, autentique-se.</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn primary" data-go="login.html">Autenticar</button>
          </div>
        </article>
      </section>
    `;
  }

  function loginPage() {
    return `
      <section class="hero"><h2>Autenticação</h2><p>Acesso reservado ao Portal do Munícipe.</p></section>
      <section class="auth-wrap">
        <article class="card auth-card">
          <h3>Iniciar sessão</h3>
          <form id="form-login" class="form">
            <label>Utilizador<input type="text" name="user" required /></label>
            <label>Palavra-passe<input type="password" name="password" required /></label>
            <div class="full"><button type="submit" class="btn primary">Entrar</button></div>
            <div class="full"><label class="hint">Credenciais de teste: user avilela | password CMS2026</label></div>
            <div class="full" id="login-error" style="display:none;color:#bf2f3a;font-weight:600;">Credenciais inválidas.</div>
          </form>
        </article>
      </section>
    `;
  }

  function formCard(title, fields, submitLabel, formId) {
    const htmlFields = fields.map((f) => {
      if (f.type === "textarea") return `<label class="full">${f.label}<textarea name="${f.name}" required></textarea></label>`;
      if (f.type === "select") return `<label>${f.label}<select name="${f.name}">${f.options.map((o) => `<option>${o}</option>`).join("")}</select></label>`;
      return `<label>${f.label}<input type="${f.type || "text"}" name="${f.name}" ${f.required ? "required" : ""}/></label>`;
    }).join("");

    return `<article class="card"><h3>${title}</h3><form class="form" id="${formId}">${htmlFields}<div class="full"><button class="btn primary" type="submit">${submitLabel}</button></div></form></article>`;
  }

  function portalPage() {
    const processRows = state.processes.map((p) => `<tr><td>${p.id}</td><td>${p.type}</td><td>${p.owner}</td><td>${badge(p.status)}</td><td>${p.due || "-"}</td></tr>`).join("");
    const paymentRows = state.payments.map((p) => `<tr><td>${p.ref}</td><td>${p.concept}</td><td>${p.amount} EUR</td><td>${badge(p.status)}</td></tr>`).join("");

    return `
      <section class="hero"><h2>Área Pessoal 360</h2><p>Visão consolidada de processos, pagamentos, documentos, mensagens e agenda.</p></section>
      <section class="grid kpi">
        ${kpiCard("Pendências", state.payments.filter((p) => p.status === "Pendente").length)}
        ${kpiCard("Mensagens por ler", state.messages.filter((m) => !m.read).length)}
        ${kpiCard("Atendimentos", state.appointments.length)}
        ${kpiCard("Documentos", state.documents.length)}
      </section>
      <section class="grid two">
        <article class="card"><h3>Processos</h3><table class="table"><thead><tr><th>ID</th><th>Tipo</th><th>Serviço</th><th>Estado</th><th>Prazo</th></tr></thead><tbody>${processRows}</tbody></table></article>
        <article class="card"><h3>Pagamentos</h3><table class="table"><thead><tr><th>Referência</th><th>Conceito</th><th>Valor</th><th>Estado</th></tr></thead><tbody>${paymentRows}</tbody></table></article>
      </section>
    `;
  }

  function moduleGeneric(page) {
    const reqs = (appData.requirementsByPage || {})[page] || [];
    let actionCard = "";
    let stateCard = "";

    if (page === "identidade") {
      actionCard = formCard("Atualizar perfil e consentimentos", [
        { label: "Nome", name: "name", type: "text", required: true },
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Telefone", name: "phone", type: "text", required: true },
        { label: "Freguesia", name: "parish", type: "text", required: true }
      ], "Guardar perfil", "form-profile");
      stateCard = `<article class="card"><h3>Consentimentos</h3><ul class="list">${state.consents.map((c, i) => `<li><span>${c.topic}</span><button class="btn" data-toggle-consent="${i}">${c.enabled ? "Ativo" : "Inativo"}</button></li>`).join("")}</ul></article>`;
    }

    if (page === "servicos") {
      actionCard = formCard("Submeter pedido online", [
        { label: "Serviço", name: "service", type: "select", options: appData.services.map((s) => s.name) },
        { label: "Assunto", name: "subject", type: "text", required: true },
        { label: "Descrição", name: "description", type: "textarea" }
      ], "Submeter pedido", "form-service");
      stateCard = `<article class="card"><h3>Serviços disponíveis</h3><table class="table"><thead><tr><th>ID</th><th>Serviço</th><th>Área</th><th>Taxa</th></tr></thead><tbody>${appData.services.map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.area}</td><td>${s.fee} EUR</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "processos") {
      actionCard = formCard("Atualizar estado de processo", [
        { label: "ID do processo", name: "id", type: "text", required: true },
        { label: "Novo estado", name: "status", type: "select", options: ["Submetido", "Em analise", "Pendente", "Deferido", "Concluido"] }
      ], "Atualizar estado", "form-process-update");
      stateCard = `<article class="card"><h3>Processos do munícipe</h3><table class="table"><thead><tr><th>ID</th><th>Tipo</th><th>Estado</th><th>Serviço</th></tr></thead><tbody>${state.processes.map((p) => `<tr><td>${p.id}</td><td>${p.type}</td><td>${badge(p.status)}</td><td>${p.owner}</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "urbanismo") {
      actionCard = formCard("Submissão urbanística", [
        { label: "Tipo de processo", name: "type", type: "select", options: ["Licenca", "Alvara", "Certidao"] },
        { label: "Localização", name: "place", type: "text", required: true },
        { label: "Área (m2)", name: "size", type: "number", required: true }
      ], "Criar processo urbanismo", "form-urban");
      stateCard = `<article class="card"><h3>Simulador de taxa urbanística</h3><form id="form-urban-sim" class="form"><label>Área m2<input name="sqm" type="number" required /></label><label>Coeficiente<select name="coef"><option>1.1</option><option>1.25</option><option>1.4</option></select></label><div class="full"><button class="btn primary" type="submit">Simular</button></div></form><p id="sim-out" class="notice" style="display:none"></p></article>`;
    }

    if (page === "reclamacoes") {
      actionCard = formCard("Submeter reclamação/petição", [
        { label: "Tipo", name: "kind", type: "select", options: ["Reclamacao", "Peticao", "Sugestao", "Elogio"] },
        { label: "Tema", name: "topic", type: "text", required: true },
        { label: "Descrição", name: "description", type: "textarea" }
      ], "Enviar", "form-claim");
      stateCard = `<article class="card"><h3>Encaminhamento automático</h3><p>As entradas são associadas a um processo e ficam visíveis na caixa postal.</p><button class="btn" data-go="caixa-postal.html">Abrir caixa postal</button></article>`;
    }

    if (page === "ocorrencias") {
      actionCard = formCard("Reportar ocorrência", [
        { label: "Categoria", name: "cat", type: "select", options: ["Iluminacao", "Residuos", "Pavimento", "Sinalizacao"] },
        { label: "Localização", name: "place", type: "text", required: true },
        { label: "Descrição", name: "desc", type: "textarea" }
      ], "Registar ocorrência", "form-incident");
      stateCard = `<article class="card"><h3>Mapa operacional</h3><div style="height:120px;border:1px dashed var(--line);border-radius:10px;display:grid;place-items:center;background:#f6fbff;">Camadas GIS e georreferência em simulação</div><ul class="list">${state.incidents.map((i) => `<li><span>${i.id} - ${i.place}</span>${badge(i.status)}</li>`).join("")}</ul></article>`;
    }

    if (page === "pagamentos") {
      actionCard = `<article class="card"><h3>Pagamentos pendentes</h3><table class="table"><thead><tr><th>Ref</th><th>Conceito</th><th>Valor</th><th>Estado</th><th>Ação</th></tr></thead><tbody>${state.payments.map((p, idx) => `<tr><td>${p.ref}</td><td>${p.concept}</td><td>${p.amount} EUR</td><td>${badge(p.status)}</td><td>${p.status === "Pendente" ? `<button class="btn primary" data-pay="${idx}">Pagar</button>` : "-"}</td></tr>`).join("")}</tbody></table></article>`;
      stateCard = formCard("Gerar nova referência", [{ label: "Conceito", name: "concept", type: "text", required: true }, { label: "Valor", name: "amount", type: "number", required: true }], "Criar referência", "form-payment");
    }

    if (page === "caixa-postal") {
      actionCard = `<article class="card"><h3>Mensagens oficiais</h3><ul class="list">${state.messages.map((m, idx) => `<li><span>${m.id} - ${m.subject}</span><button class="btn" data-read="${idx}">${m.read ? "Lida" : "Marcar lida"}</button></li>`).join("")}</ul></article>`;
      stateCard = formCard("Responder comunicação", [{ label: "ID Mensagem", name: "message", type: "text", required: true }, { label: "Resposta", name: "reply", type: "textarea" }], "Enviar resposta", "form-reply");
    }

    if (page === "atendimento") {
      actionCard = formCard("Agendar atendimento", [
        { label: "Canal", name: "mode", type: "select", options: ["Presencial", "Video"] },
        { label: "Serviço", name: "service", type: "text", required: true },
        { label: "Data e hora", name: "when", type: "datetime-local", required: true }
      ], "Marcar atendimento", "form-appointment");
      stateCard = `<article class="card"><h3>Agenda do munícipe</h3><ul class="list">${state.appointments.map((a) => `<li><span>${a.id} - ${a.service} (${a.mode})</span><span>${a.when}</span></li>`).join("")}</ul></article>`;
    }

    if (page === "assistente") {
      actionCard = `<article class="card"><h3>Assistente virtual</h3><form class="form" id="form-ai"><label class="full">Pergunta<textarea name="q" required></textarea></label><div class="full"><button class="btn primary" type="submit">Perguntar</button></div></form><div id="ai-answer" class="notice" style="display:none"></div></article>`;
      stateCard = `<article class="card"><h3>Escalonamento</h3><p>Quando necessário, encaminha para atendimento humano.</p><button class="btn" data-go="atendimento.html">Transferir para operador</button></article>`;
    }

    if (page === "carteira") {
      actionCard = `<article class="card"><h3>Documentos digitais do municipe</h3>
      <form id="form-upload-doc" class="form">
        <label>Selecionar ficheiro<input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required /></label>
        <label>Descricao do documento<input type="text" name="docName" placeholder="Ex: Comprovativo de morada" required /></label>
        <div class="full"><button class="btn primary" type="submit">Fazer upload</button></div>
      </form>
      <table class="table"><thead><tr><th>ID</th><th>Documento</th><th>Validade</th><th>Estado</th></tr></thead><tbody>${state.documents.map((d) => `<tr><td>${d.id}</td><td>${d.name}</td><td>${d.validUntil}</td><td>${badge(d.state)}</td></tr>`).join("")}</tbody></table></article>`;
      stateCard = `<article class="card"><h3>Partilha por link seguro</h3>
      <form id="form-share-doc" class="form">
        <label>Documento<select name="doc" required>${state.documents.map((d) => `<option value="${d.id}">${d.id} - ${d.name}</option>`).join("")}</select></label>
        <label>Destino (email)<input type="email" name="to" required /></label>
        <div class="full"><button class="btn primary" type="submit">Gerar link seguro</button></div>
      </form>
      <ul class="list">${state.shares.length ? state.shares.map((s) => `<li><span>${s.docId} para ${s.to}</span><a href="${s.url}" target="_blank" rel="noopener">Abrir link</a></li>`).join("") : "<li><span>Sem links gerados</span><span>-</span></li>"}</ul>
      </article>`;
    }

    if (page === "app") {
      actionCard = `<article class="card"><h3>Configurar app móvel</h3><form id="form-app" class="form"><label>SO<select name="os"><option>Android</option><option>iOS</option></select></label><label>Push<select name="push"><option>Ativo</option><option>Inativo</option></select></label><div class="full"><button class="btn primary" type="submit">Guardar</button></div></form></article>`;
      stateCard = `<article class="card"><h3>Funcionalidades mobile</h3><ul class="list"><li><span>Dashboard mobile</span><span class="badge ok">Ativo</span></li><li><span>Reporte com foto</span><span class="badge ok">Ativo</span></li><li><span>Carteira digital</span><span class="badge ok">Ativo</span></li></ul></article>`;
    }

    if (page === "participacao") {
      actionCard = formCard("Submeter proposta / votar", [{ label: "Título", name: "title", type: "text", required: true }, { label: "Ação", name: "action", type: "select", options: ["Submeter proposta", "Votar proposta"] }, { label: "Descrição", name: "desc", type: "textarea" }], "Registar participação", "form-participation");
      stateCard = `<article class="card"><h3>Registos de participação</h3><ul class="list">${state.votes.map((v) => `<li><span>${v.action}: ${v.title}</span><span>${v.date}</span></li>`).join("") || "<li><span>Sem registos</span><span>-</span></li>"}</ul></article>`;
    }

    if (page === "beneficios") {
      actionCard = formCard("Candidatura a apoio / reserva", [{ label: "Tipo", name: "kind", type: "select", options: ["Apoio social", "Reserva equipamento"] }, { label: "Equipamento/Programa", name: "program", type: "text", required: true }, { label: "Observações", name: "obs", type: "textarea" }], "Submeter candidatura", "form-benefit");
      stateCard = `<article class="card"><h3>Estado atual</h3><p>As candidaturas entram no fluxo de backoffice com notificação formal.</p></article>`;
    }

    if (page === "mobilidade") {
      actionCard = formCard("Pedido mobilidade", [{ label: "Tipo", name: "kind", type: "select", options: ["Distico residente", "Ocupacao via publica", "Autorizacao temporaria"] }, { label: "Localização", name: "place", type: "text", required: true }, { label: "Período", name: "period", type: "text", required: true }], "Submeter pedido", "form-mobility");
      stateCard = `<article class="card"><h3>Licenças de mobilidade</h3><ul class="list"><li><span>Distico #D-2291</span><span class="badge ok">Valido</span></li><li><span>Ocupacao via #OVP-440</span><span class="badge warn">Em analise</span></li></ul></article>`;
    }

    if (page === "mapas") {
      actionCard = `<article class="card"><h3>Camadas GIS</h3><form id="form-gis" class="form"><label><input type="checkbox" checked name="equip"/> Equipamentos</label><label><input type="checkbox" checked name="obras"/> Obras</label><label><input type="checkbox" name="ocorr"/> Ocorrências</label><div class="full"><button class="btn primary" type="submit">Aplicar camadas</button></div></form></article>`;
      stateCard = `<article class="card"><h3>Mapa interativo</h3><div style="height:160px;border:1px dashed var(--line);border-radius:10px;display:grid;place-items:center;background:#f6fbff;">Seleção de localização com geocodificação simulada</div></article>`;
    }

    if (!actionCard) {
      actionCard = `<article class="card"><h3>${activePageName()}</h3><p>Página disponível após autenticação.</p></article>`;
      stateCard = `<article class="card"><h3>Estado</h3><p>Sem ações adicionais configuradas para esta página.</p></article>`;
    }

    return `
      <section class="hero"><h2>${activePageName()}</h2><p>Fluxos ativos do portal.</p></section>
      <section class="grid kpi">
        ${kpiCard("Funcionalidades", reqs.length)}
        ${kpiCard("Processos", state.processes.length)}
        ${kpiCard("Mensagens", state.messages.length)}
        ${kpiCard("Pagamentos", state.payments.length)}
      </section>
      <section class="grid two">${actionCard}${stateCard}</section>
    `;
  }

  function wireActions() {
    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        location.href = btn.getAttribute("data-go");
      });
    });

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem(authKey);
        location.href = "index.html";
      });
    }

    const search = document.getElementById("globalSearch");
    if (search) {
      search.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        const term = search.value.trim().toLowerCase();
        if (!term) return;
        const pageHit = (appData.pages || []).find(([name, href]) => name.toLowerCase().includes(term) || href.toLowerCase().includes(term));
        if (pageHit) {
          location.href = pageHit[1];
          return;
        }
        const processHit = state.processes.find((p) => p.id.toLowerCase().includes(term) || p.type.toLowerCase().includes(term));
        if (processHit) {
          location.href = "processos.html";
          return;
        }
        alert("Sem resultados diretos.");
      });
    }

    const fLogin = document.getElementById("form-login");
    if (fLogin) {
      fLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fLogin);
        const user = String(fd.get("user") || "").trim();
        const password = String(fd.get("password") || "").trim();
        if (user === "avilela" && password === "CMS2026") {
          setAuth(true, user);
          location.href = "portal.html";
          return;
        }
        const err = document.getElementById("login-error");
        if (err) err.style.display = "block";
      });
    }

    const fProfile = document.getElementById("form-profile");
    if (fProfile) {
      fProfile.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fProfile);
        state.profile = { ...state.profile, name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), parish: fd.get("parish") };
        persist();
        alert("Perfil atualizado.");
        location.reload();
      });
    }

    const fService = document.getElementById("form-service");
    if (fService) {
      fService.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fService);
        state.processes.unshift({ id: makeId("PR"), type: fd.get("subject"), status: "Submetido", owner: fd.get("service"), due: "2026-08-01" });
        state.messages.unshift({ id: makeId("CP"), subject: "Pedido submetido: " + fd.get("subject"), kind: "Informativa", read: false });
        persist();
        alert("Pedido criado e associado a processo.");
        location.href = "processos.html";
      });
    }

    const fProcess = document.getElementById("form-process-update");
    if (fProcess) {
      fProcess.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fProcess);
        const id = String(fd.get("id") || "").trim();
        const item = state.processes.find((p) => p.id === id);
        if (!item) {
          alert("Processo não encontrado.");
          return;
        }
        item.status = fd.get("status");
        state.messages.unshift({ id: makeId("CP"), subject: "Estado atualizado para " + item.status + " no processo " + id, kind: "Formal", read: false });
        persist();
        location.reload();
      });
    }

    const fUrban = document.getElementById("form-urban");
    if (fUrban) {
      fUrban.addEventListener("submit", (e) => {
        e.preventDefault();
        state.processes.unshift({ id: makeId("URB"), type: "Processo urbanístico", status: "Submetido", owner: "Urbanismo", due: "2026-08-10" });
        state.payments.unshift({ ref: makeId("PG"), concept: "Taxa urbanística", amount: 180, status: "Pendente", due: "2026-07-25" });
        persist();
        alert("Processo urbanístico criado.");
        location.href = "pagamentos.html";
      });
    }

    const fUrbanSim = document.getElementById("form-urban-sim");
    if (fUrbanSim) {
      fUrbanSim.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fUrbanSim);
        const sqm = Number(fd.get("sqm") || 0);
        const coef = Number(fd.get("coef") || 1);
        const result = Math.round(sqm * coef * 1.85);
        const out = document.getElementById("sim-out");
        out.style.display = "block";
        out.textContent = "Estimativa de taxa: " + result + " EUR";
      });
    }

    const fClaim = document.getElementById("form-claim");
    if (fClaim) {
      fClaim.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fClaim);
        state.processes.unshift({ id: makeId("RP"), type: String(fd.get("kind")) + ": " + fd.get("topic"), status: "Submetido", owner: "Atendimento", due: "2026-07-30" });
        state.messages.unshift({ id: makeId("CP"), subject: "Registo recebido", kind: "Formal", read: false });
        persist();
        location.href = "caixa-postal.html";
      });
    }

    const fIncident = document.getElementById("form-incident");
    if (fIncident) {
      fIncident.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fIncident);
        state.incidents.unshift({ id: makeId("OC"), cat: fd.get("cat"), place: fd.get("place"), status: "Submetida" });
        state.messages.unshift({ id: makeId("CP"), subject: "Ocorrência recebida em " + fd.get("place"), kind: "Informativa", read: false });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-pay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-pay"));
        if (!Number.isNaN(idx) && state.payments[idx]) {
          state.payments[idx].status = "Pago";
          state.documents.unshift({ id: makeId("CD"), name: "Comprovativo " + state.payments[idx].ref, validUntil: "Arquivo", state: "Valido" });
          state.messages.unshift({ id: makeId("CP"), subject: "Pagamento confirmado: " + state.payments[idx].ref, kind: "Formal", read: false });
          persist();
          location.reload();
        }
      });
    });

    const fPayment = document.getElementById("form-payment");
    if (fPayment) {
      fPayment.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fPayment);
        state.payments.unshift({ ref: makeId("PG"), concept: fd.get("concept"), amount: Number(fd.get("amount")), status: "Pendente", due: "2026-08-01" });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-read]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-read"));
        if (!Number.isNaN(idx) && state.messages[idx]) {
          state.messages[idx].read = true;
          persist();
          location.reload();
        }
      });
    });

    const fReply = document.getElementById("form-reply");
    if (fReply) {
      fReply.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fReply);
        state.messages.unshift({ id: makeId("CP"), subject: "Resposta enviada para " + fd.get("message"), kind: "Informativa", read: false });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-toggle-consent]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-toggle-consent"));
        if (!Number.isNaN(idx) && state.consents[idx]) {
          state.consents[idx].enabled = !state.consents[idx].enabled;
          persist();
          location.reload();
        }
      });
    });

    const fAppointment = document.getElementById("form-appointment");
    if (fAppointment) {
      fAppointment.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fAppointment);
        state.appointments.unshift({ id: makeId("AT"), mode: fd.get("mode"), service: fd.get("service"), when: fd.get("when") });
        state.messages.unshift({ id: makeId("CP"), subject: "Atendimento marcado", kind: "Informativa", read: false });
        persist();
        location.reload();
      });
    }

    const fAi = document.getElementById("form-ai");
    if (fAi) {
      fAi.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fAi);
        const q = String(fd.get("q") || "").toLowerCase();
        const out = document.getElementById("ai-answer");
        out.style.display = "block";
        if (q.includes("pagamento")) out.textContent = "Pode consultar e liquidar pendências na página Pagamentos.";
        else if (q.includes("processo")) out.textContent = "Acompanhe estados no módulo Processos e receba notificações na caixa postal.";
        else out.textContent = "Questão fora do âmbito automático. Encaminhar para atendimento humano.";
      });
    }

    const fShare = document.getElementById("form-share-doc");
    if (fShare) {
      fShare.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fShare);
        const docId = String(fd.get("doc") || "");
        const to = String(fd.get("to") || "");
        const token = Math.random().toString(36).slice(2, 10) + Date.now().toString().slice(-4);
        const url = "https://portal.sintra.pt/partilha-segura/" + token;
        state.shares.unshift({ docId, to, url, createdAt: new Date().toISOString() });
        persist();
        alert("Link seguro gerado com validade de 72h.");
        location.reload();
      });
    }

    const fUploadDoc = document.getElementById("form-upload-doc");
    if (fUploadDoc) {
      fUploadDoc.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fUploadDoc);
        const file = fd.get("file");
        const docName = String(fd.get("docName") || "").trim();
        if (!file || !file.name) {
          alert("Selecione um ficheiro para upload.");
          return;
        }
        state.documents.unshift({
          id: makeId("CD"),
          name: docName || file.name,
          validUntil: "Sem validade definida",
          state: "Valido",
          fileName: file.name,
          fileSize: file.size
        });
        persist();
        alert("Documento carregado com sucesso.");
        location.reload();
      });
    }

    const fApp = document.getElementById("form-app");
    if (fApp) {
      fApp.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Preferências da app guardadas.");
      });
    }

    const fPart = document.getElementById("form-participation");
    if (fPart) {
      fPart.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fPart);
        state.votes.unshift({ title: fd.get("title"), action: fd.get("action"), date: new Date().toISOString().slice(0, 10) });
        persist();
        location.reload();
      });
    }

    const fBenefit = document.getElementById("form-benefit");
    if (fBenefit) {
      fBenefit.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fBenefit);
        state.tasks.unshift({ id: makeId("TK"), unit: "Acao Social", owner: "Backoffice", desc: String(fd.get("kind")) + " - " + String(fd.get("program")) });
        persist();
        alert("Candidatura enviada.");
      });
    }

    const fMob = document.getElementById("form-mobility");
    if (fMob) {
      fMob.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fMob);
        state.processes.unshift({ id: makeId("MOB"), type: String(fd.get("kind")), status: "Submetido", owner: "Mobilidade", due: "2026-08-05" });
        persist();
        location.href = "processos.html";
      });
    }

    const fGis = document.getElementById("form-gis");
    if (fGis) {
      fGis.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Camadas aplicadas.");
      });
    }

    wireBot();
  }

  function addBotMessage(text, fromUser) {
    const box = document.getElementById("botMessages");
    if (!box) return;
    const el = document.createElement("div");
    el.className = fromUser ? "bot-msg bot-msg-user" : "bot-msg bot-msg-ai";
    el.innerHTML = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  async function ensureLeaflet() {
    if (window.L) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    await new Promise((resolve, reject) => {
      if (document.getElementById("leaflet-js")) {
        document.getElementById("leaflet-js").addEventListener("load", resolve, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function renderParkingMap() {
    const wrap = document.getElementById("botMapWrap");
    const mapEl = document.getElementById("botMap");
    if (!wrap || !mapEl) return;
    wrap.style.display = "block";
    await ensureLeaflet();
    if (mapEl.dataset.ready === "1") return;
    const map = window.L.map("botMap").setView([38.7985, -9.388], 14);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    (botData.parkingInVila || []).forEach((p) => {
      const popup = `<strong>${p.name}</strong><br/>Custo: ${p.hourlyCost}<br/>Max diario: ${p.maxDaily}<br/><a href="${p.directionsUrl}" target="_blank" rel="noopener">Pedir direcoes</a>`;
      window.L.marker(p.coords).addTo(map).bindPopup(popup);
    });
    mapEl.dataset.ready = "1";
  }

  async function answerBot(question) {
    const q = question.toLowerCase();
    const parish = state.profile.parish || "Algueirao-Mem Martins";

    if (q.includes("estabelecimentos de ensino") || q.includes("escolas") || q.includes("freguesia")) {
      const edu = (botData.educationByParish || {})[parish] || (botData.educationByParish || {})["Algueirao-Mem Martins"];
      if (!edu) {
        return "Nao encontrei dados de escolas para a freguesia pedida.";
      }
      return `Na freguesia de ${parish}, a lista de estabelecimentos e:<br/><br/><strong>Publico</strong><br/>- ${edu.public.join("<br/>- ")}<br/><br/><strong>Privado</strong><br/>- ${edu.private.join("<br/>- ")}<br/><br/><small>${edu.note}</small>`;
    }

    if (q.includes("morada") && q.includes("urbanismo")) {
      const u = botData.urbanismDepartment || {};
      return `Departamento de Urbanismo:<br/><strong>${u.address || "Largo Dr. Virgilio Horta, 2714-501 Sintra"}</strong><br/>Telefone: ${u.phone || "+351 219 238 500"}<br/>Email: ${u.email || "municipe@cm-sintra.pt"}<br/><small>${u.note || ""}</small>`;
    }

    if (q.includes("vou a vila") || q.includes("estacionar") || q.includes("estacionamento")) {
      await renderParkingMap();
      return "Mostrei o mapa interativo dos estacionamentos da Vila de Sintra. Clique num marcador para ver custo horario e pedir direcoes.";
    }

    return "Posso responder sobre: 1) estabelecimentos de ensino na freguesia, 2) morada do urbanismo, 3) estacionamento na Vila de Sintra.";
  }

  function wireBot() {
    const fab = document.getElementById("botFab");
    const panel = document.getElementById("botPanel");
    const close = document.getElementById("botClose");
    const form = document.getElementById("botForm");
    const input = document.getElementById("botInput");
    if (!fab || !panel) return;

    fab.addEventListener("click", () => {
      panel.style.display = panel.style.display === "none" ? "flex" : "none";
    });
    if (close) {
      close.addEventListener("click", () => {
        panel.style.display = "none";
      });
    }
    if (form && input) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        addBotMessage(q, true);
        input.value = "";
        const response = await answerBot(q);
        addBotMessage(response, false);
      });
    }
  }

  function pageContent() {
    if (pageType === "home") return landingPage();
    if (pageType === "login") return loginPage();
    if (pageType === "portal") return portalPage();
    return moduleGeneric(pageType);
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = shellStart() + pageContent() + shellEnd();
    wireActions();
  }

  render();
})();
