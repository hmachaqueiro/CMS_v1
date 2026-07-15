(function () {
  const appData = window.CMS_DATA || {};
  const botData = window.BOT_KNOWLEDGE || {};
  const pageType = document.body.dataset.page || "home";
  const currentFile = location.pathname.split("/").pop() || "index.html";

  const stateKey = "cmsintra-v3-state";
  const authKey = "cmsintra-v3-auth";
  const publicPages = ["index.html", "login.html"];

  function initialState() {
    const d = appData.defaults || {};
    return {
      profile: { ...(appData.citizen || {}) },
      processes: [...(d.processes || [])],
      payments: [...(d.payments || [])],
      messages: [...(d.messages || [])],
      incidents: [...(d.incidents || [])],
      appointments: [...(d.appointments || [])],
      documents: [...(d.documents || [])],
      consents: [...(d.consents || [])],
      shares: [],
      votes: [],
      tasks: [],
      associations: [...(d.associations || [])],
      assets: [...(d.assets || [])],
      contracts: [...(d.contracts || [])],
      schoolRequests: [...(d.schoolRequests || [])],
      campaigns: [...(d.campaigns || [])],
      portals: [...(d.portals || [])],
      parkingZones: [...(d.parkingZones || [])],
      mobile: {
        os: d.mobile?.os || "Android",
        push: d.mobile?.push || "Ativo",
        readings: [...(d.mobile?.readings || [])],
        bulky: [...(d.mobile?.bulky || [])],
        hearings: [...(d.mobile?.hearings || [])],
        alertAreas: [...(d.mobile?.alertAreas || [])]
      }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(stateKey);
      if (!raw) return initialState();
      return { ...initialState(), ...JSON.parse(raw) };
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
    return prefix + "-" + Date.now().toString().slice(-6);
  }

  function badge(status) {
    if (["Pago", "Valido", "Resolvida", "Ativo", "Deferido", "Concluido", "Saudavel", "Operacional", "Confirmada"].includes(status)) return `<span class="badge ok">${status}</span>`;
    if (["Pendente", "Em analise", "Em execucao", "Submetido", "Em avaliacao", "Manutencao", "Agendado"].includes(status)) return `<span class="badge warn">${status}</span>`;
    if (["Atrasado", "Bloqueado", "Rejeitado"].includes(status)) return `<span class="badge danger">${status}</span>`;
    return `<span class="badge info">${status}</span>`;
  }

  function kpiCard(label, value) {
    return `<article class="card"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></article>`;
  }

  function activePageName() {
    const found = (appData.pages || []).find((p) => p[1] === currentFile);
    return found ? found[0] : "Portal";
  }

  function navItems() {
    if (!auth.loggedIn) return [["Início", "index.html"], ["Autenticação", "login.html"]];
    return appData.pages || [];
  }

  function shellStart() {
    const items = navItems()
      .map(([name, href]) => `<li><a class="${href === currentFile ? "active" : ""}" href="${href}">${name}</a></li>`)
      .join("");

    const userInfo = auth.loggedIn && currentFile !== "index.html"
      ? `<div class="header-info"><span class="pill">Munícipe: ${state.profile.name}</span><span class="pill">Freguesia: ${state.profile.parish}</span></div>`
      : `<div class="header-info"><span class="pill">Portal municipal v3</span></div>`;

    const searchBox = currentFile === "login.html" ? "" : `<div class="search"><input id="globalSearch" type="text" placeholder="Pesquisar módulo ou processo" /></div>`;

    const actions = auth.loggedIn
      ? `<div class="header-actions"><button class="btn" data-go="portal.html">Área Pessoal</button><button class="btn" id="btnLogout">Terminar sessão</button></div>`
      : `<div class="header-actions"><button class="btn primary" data-go="login.html">Autenticar</button></div>`;

    return `
      <div class="app-shell">
        <aside class="side-nav">
          <div class="side-brand">
            <img src="../assets/Sintra_logo.png" alt="Sintra logo" />
            <div>
              <h1>Câmara Municipal de Sintra</h1>
              <small>Portal do Munícipe v3</small>
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

  function botWidget() {
    return `
      <button id="botFab" class="bot-fab" aria-label="Abrir assistente">💬</button>
      <section id="botPanel" class="bot-panel" style="display:none;">
        <header class="bot-header">
          <strong>Assistente Sintra</strong>
          <button id="botClose" class="bot-close" aria-label="Fechar">×</button>
        </header>
        <div id="botMessages" class="bot-messages">
          <div class="bot-msg bot-msg-ai">Posso ajudar com escolas, urbanismo e estacionamento na Vila de Sintra.</div>
        </div>
        <div id="botMapWrap" class="bot-map-wrap" style="display:none;"><div id="botMap" class="bot-map"></div></div>
        <form id="botForm" class="bot-form">
          <input id="botInput" type="text" placeholder="Escreva a sua pergunta" />
          <button class="btn primary" type="submit">Enviar</button>
        </form>
      </section>
    `;
  }

  function shellEnd() {
    return `</main><footer>Portal funcional v3 com fluxos interativos.</footer>${botWidget()}</div></div>`;
  }

  function landingPage() {
    return `
      <section class="hero"><h2>Portal do Munícipe Digital v3</h2><p>Serviços municipais com autenticação e operação integrada.</p></section>
      <section class="grid two">
        <article class="card">
          <h3>Funcionalidades ativas</h3>
          <ul class="list">
            <li><span>Serviços transacionais</span>${badge("Ativo")}</li>
            <li><span>Urbanismo e ocorrências</span>${badge("Ativo")}</li>
            <li><span>Carteira com upload e partilha segura</span>${badge("Ativo")}</li>
            <li><span>Novos módulos v3 (22-30)</span>${badge("Ativo")}</li>
            <li><span>App móvel emulada</span>${badge("Ativo")}</li>
          </ul>
        </article>
        <article class="card">
          <h3>Acesso</h3>
          <p>Entre para operar os módulos e testar todos os fluxos.</p>
          <button class="btn primary" data-go="login.html">Autenticar</button>
        </article>
      </section>
    `;
  }

  function loginPage() {
    return `
      <section class="hero"><h2>Autenticação</h2><p>Acesso reservado ao Portal do Munícipe v3.</p></section>
      <section class="auth-wrap">
        <article class="card auth-card">
          <h3>Iniciar sessão</h3>
          <form id="form-login" class="form">
            <label>Utilizador<input type="text" name="user" required /></label>
            <label>Palavra-passe<input type="password" name="password" required /></label>
            <div class="full"><button type="submit" class="btn primary">Entrar</button></div>
            <div class="full"><label class="hint">Credenciais: avilela / CMS2026</label></div>
            <div class="full" id="login-error" style="display:none;color:#bf2f3a;font-weight:600;">Credenciais inválidas.</div>
          </form>
        </article>
      </section>
    `;
  }

  function formCard(title, fields, submitLabel, formId) {
    const htmlFields = fields
      .map((f) => {
        if (f.type === "textarea") return `<label class="full">${f.label}<textarea name="${f.name}" ${f.required ? "required" : ""}></textarea></label>`;
        if (f.type === "select") return `<label>${f.label}<select name="${f.name}">${f.options.map((o) => `<option>${o}</option>`).join("")}</select></label>`;
        return `<label>${f.label}<input type="${f.type || "text"}" name="${f.name}" ${f.required ? "required" : ""}/></label>`;
      })
      .join("");
    return `<article class="card"><h3>${title}</h3><form class="form" id="${formId}">${htmlFields}<div class="full"><button class="btn primary" type="submit">${submitLabel}</button></div></form></article>`;
  }

  function portalPage() {
    return `
      <section class="hero"><h2>Área Pessoal 360</h2><p>Visão consolidada de processos, pagamentos, mensagens, ativos e contratos.</p></section>
      <section class="grid kpi">
        ${kpiCard("Processos", state.processes.length)}
        ${kpiCard("Pagamentos pendentes", state.payments.filter((p) => p.status === "Pendente").length)}
        ${kpiCard("Ocorrências", state.incidents.length)}
        ${kpiCard("Contratos", state.contracts.length)}
      </section>
      <section class="grid two">
        <article class="card"><h3>Processos recentes</h3><table class="table"><thead><tr><th>ID</th><th>Tipo</th><th>Estado</th><th>Serviço</th></tr></thead><tbody>${state.processes.slice(0, 8).map((p) => `<tr><td>${p.id}</td><td>${p.type}</td><td>${badge(p.status)}</td><td>${p.owner}</td></tr>`).join("")}</tbody></table></article>
        <article class="card"><h3>Mensagens por ler</h3><ul class="list">${state.messages.slice(0, 8).map((m) => `<li><span>${m.id} - ${m.subject}</span>${m.read ? badge("Lida") : badge("Pendente")}</li>`).join("")}</ul></article>
      </section>
    `;
  }

  function appEmulator() {
    const readings = state.mobile.readings.map((r) => `<li><span>${r.id} ${r.meter} (${r.value})</span><span>${r.date}</span></li>`).join("") || "<li><span>Sem leituras</span><span>-</span></li>";
    const bulky = state.mobile.bulky.map((r) => `<li><span>${r.id} ${r.address}</span>${badge(r.status)}</li>`).join("") || "<li><span>Sem pedidos</span><span>-</span></li>";
    const hearings = state.mobile.hearings.map((r) => `<li><span>${r.topic}</span><span>${r.when}</span></li>`).join("") || "<li><span>Sem audiências</span><span>-</span></li>";

    return `
      <section class="hero"><h2>App Móvel (Emulador)</h2><p>Ecrã de simulação funcional para leituras, recolha de monos, audiências e alertas territoriais.</p></section>
      <section class="grid two">
        <article class="card">
          <div class="mobile-emulator-wrap">
            <div class="mobile-frame">
              <div class="mobile-screen">
                <div class="mobile-topbar">App Sintra v3</div>
                <div class="mobile-tabs">
                  <button class="mobile-tab active" data-mobile-tab="leituras">Leituras</button>
                  <button class="mobile-tab" data-mobile-tab="monos">Monos</button>
                  <button class="mobile-tab" data-mobile-tab="audiencias">Audiências</button>
                  <button class="mobile-tab" data-mobile-tab="alertas">Alertas</button>
                </div>
                <div class="mobile-body">
                  <div class="mobile-card" data-mobile-panel="leituras">
                    <form id="form-mobile-reading" class="form">
                      <label>Contador<input name="meter" type="text" required /></label>
                      <label>Leitura<input name="value" type="number" required /></label>
                      <div class="full"><button class="btn primary" type="submit">Enviar leitura</button></div>
                    </form>
                    <ul class="list">${readings}</ul>
                  </div>
                  <div class="mobile-card" data-mobile-panel="monos" style="display:none;">
                    <form id="form-mobile-bulky" class="form">
                      <label>Morada<input name="address" type="text" required /></label>
                      <label>Data recolha<input name="when" type="date" required /></label>
                      <div class="full"><button class="btn primary" type="submit">Agendar recolha</button></div>
                    </form>
                    <ul class="list">${bulky}</ul>
                  </div>
                  <div class="mobile-card" data-mobile-panel="audiencias" style="display:none;">
                    <form id="form-mobile-hearing" class="form">
                      <label>Tema<input name="topic" type="text" required /></label>
                      <label>Data e hora<input name="when" type="datetime-local" required /></label>
                      <div class="full"><button class="btn primary" type="submit">Marcar audiência</button></div>
                    </form>
                    <ul class="list">${hearings}</ul>
                  </div>
                  <div class="mobile-card" data-mobile-panel="alertas" style="display:none;">
                    <form id="form-mobile-alert" class="form">
                      <label>Área/freguesia<input name="area" type="text" required /></label>
                      <div class="full"><button class="btn primary" type="submit">Subscrever alerta</button></div>
                    </form>
                    <ul class="list">${state.mobile.alertAreas.map((a) => `<li><span>${a}</span>${badge("Ativo")}</li>`).join("")}</ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <article class="mobile-card"><h4>Farmácias de serviço</h4><p>Consulta rápida por geografia com atualização diária.</p></article>
              <article class="mobile-card"><h4>Rede de transportes</h4><p>Pesquisa por origem/destino e consulta de horários.</p></article>
              <article class="mobile-card"><h4>Turismo local</h4><p>Roteiros, onde comer e pontos de interesse.</p></article>
            </div>
          </div>
        </article>
        <article class="card">
          <h3>Preferências da app</h3>
          <form id="form-app" class="form">
            <label>SO<select name="os"><option ${state.mobile.os === "Android" ? "selected" : ""}>Android</option><option ${state.mobile.os === "iOS" ? "selected" : ""}>iOS</option></select></label>
            <label>Push<select name="push"><option ${state.mobile.push === "Ativo" ? "selected" : ""}>Ativo</option><option ${state.mobile.push === "Inativo" ? "selected" : ""}>Inativo</option></select></label>
            <div class="full"><button class="btn primary" type="submit">Guardar</button></div>
          </form>
          <h3>Estado</h3>
          <ul class="list"><li><span>Leituras de água</span>${badge("Ativo")}</li><li><span>Recolha de monos</span>${badge("Ativo")}</li><li><span>Audiências digitais</span>${badge("Ativo")}</li><li><span>Alertas territoriais</span>${badge("Ativo")}</li></ul>
        </article>
      </section>
    `;
  }

  function moduleGeneric(page) {
    let actionCard = "";
    let stateCard = "";

    if (page === "identidade") {
      actionCard = formCard("Atualizar perfil", [
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
        { label: "Descrição", name: "description", type: "textarea", required: true }
      ], "Submeter pedido", "form-service");
      stateCard = `<article class="card"><h3>Catálogo de serviços</h3><table class="table"><thead><tr><th>ID</th><th>Serviço</th><th>Área</th><th>Taxa</th></tr></thead><tbody>${(appData.services || []).map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.area}</td><td>${s.fee} EUR</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "processos") {
      actionCard = formCard("Atualizar estado de processo", [
        { label: "ID processo", name: "id", type: "text", required: true },
        { label: "Novo estado", name: "status", type: "select", options: ["Submetido", "Em analise", "Pendente", "Deferido", "Concluido"] }
      ], "Atualizar", "form-process-update");
      stateCard = `<article class="card"><h3>Lista de processos</h3><table class="table"><thead><tr><th>ID</th><th>Tipo</th><th>Estado</th><th>Unidade</th></tr></thead><tbody>${state.processes.map((p) => `<tr><td>${p.id}</td><td>${p.type}</td><td>${badge(p.status)}</td><td>${p.owner}</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "urbanismo") {
      actionCard = formCard("Submeter processo urbanístico", [
        { label: "Tipo", name: "type", type: "select", options: ["Licenca", "Alvara", "Certidao"] },
        { label: "Localização", name: "place", type: "text", required: true },
        { label: "Area (m2)", name: "size", type: "number", required: true }
      ], "Criar processo", "form-urban");
      stateCard = `<article class="card"><h3>Simulador de taxa</h3><form id="form-urban-sim" class="form"><label>Area m2<input name="sqm" type="number" required /></label><label>Coeficiente<select name="coef"><option>1.1</option><option>1.25</option><option>1.4</option></select></label><div class="full"><button class="btn primary" type="submit">Simular</button></div></form><p id="sim-out" class="notice" style="display:none"></p></article>`;
    }

    if (page === "reclamacoes") {
      actionCard = formCard("Submeter reclamação ou petição", [
        { label: "Tipo", name: "kind", type: "select", options: ["Reclamacao", "Peticao", "Sugestao", "Elogio"] },
        { label: "Tema", name: "topic", type: "text", required: true },
        { label: "Descrição", name: "description", type: "textarea", required: true }
      ], "Enviar", "form-claim");
      stateCard = `<article class="card"><h3>Encaminhamento</h3><p>Cada submissao gera processo e mensagem formal na caixa postal.</p><button class="btn" data-go="caixa-postal.html">Abrir caixa postal</button></article>`;
    }

    if (page === "ocorrencias") {
      actionCard = formCard("Reportar ocorrência", [
        { label: "Categoria", name: "cat", type: "select", options: ["Iluminacao", "Residuos", "Pavimento", "Sinalizacao"] },
        { label: "Localização", name: "place", type: "text", required: true },
        { label: "Descrição", name: "desc", type: "textarea", required: true }
      ], "Registar", "form-incident");
      stateCard = `<article class="card"><h3>Ocorrências</h3><ul class="list">${state.incidents.map((i) => `<li><span>${i.id} - ${i.place}</span>${badge(i.status)}</li>`).join("")}</ul></article>`;
    }

    if (page === "pagamentos") {
      actionCard = `<article class="card"><h3>Pagamentos pendentes</h3><table class="table"><thead><tr><th>Ref.</th><th>Conceito</th><th>Valor</th><th>Estado</th><th>Ação</th></tr></thead><tbody>${state.payments.map((p, idx) => `<tr><td>${p.ref}</td><td>${p.concept}</td><td>${p.amount} EUR</td><td>${badge(p.status)}</td><td>${p.status === "Pendente" ? `<button class="btn primary" data-pay="${idx}">Pagar</button>` : "-"}</td></tr>`).join("")}</tbody></table></article>`;
      stateCard = formCard("Gerar referência", [
        { label: "Conceito", name: "concept", type: "text", required: true },
        { label: "Valor", name: "amount", type: "number", required: true }
      ], "Criar referência", "form-payment");
    }

    if (page === "caixa-postal") {
      actionCard = `<article class="card"><h3>Mensagens oficiais</h3><ul class="list">${state.messages.map((m, idx) => `<li><span>${m.id} - ${m.subject}</span><button class="btn" data-read="${idx}">${m.read ? "Lida" : "Marcar lida"}</button></li>`).join("")}</ul></article>`;
      stateCard = formCard("Responder comunicação", [
        { label: "ID Mensagem", name: "message", type: "text", required: true },
        { label: "Resposta", name: "reply", type: "textarea", required: true }
      ], "Enviar", "form-reply");
    }

    if (page === "atendimento") {
      actionCard = formCard("Agendar atendimento", [
        { label: "Canal", name: "mode", type: "select", options: ["Presencial", "Video"] },
        { label: "Serviço", name: "service", type: "text", required: true },
        { label: "Data e hora", name: "when", type: "datetime-local", required: true }
      ], "Marcar", "form-appointment");
      stateCard = `<article class="card"><h3>Agenda</h3><ul class="list">${state.appointments.map((a) => `<li><span>${a.id} - ${a.service} (${a.mode})</span><span>${a.when}</span></li>`).join("")}</ul></article>`;
    }

    if (page === "assistente") {
      actionCard = `<article class="card"><h3>Assistente virtual</h3><form class="form" id="form-ai"><label class="full">Pergunta<textarea name="q" required></textarea></label><div class="full"><button class="btn primary" type="submit">Perguntar</button></div></form><div id="ai-answer" class="notice" style="display:none"></div></article>`;
      stateCard = `<article class="card"><h3>Escalonamento</h3><p>Quando necessário, o pedido é encaminhado para atendimento humano.</p><button class="btn" data-go="atendimento.html">Transferir para operador</button></article>`;
    }

    if (page === "carteira") {
      actionCard = `<article class="card"><h3>Documentos digitais</h3>
      <form id="form-upload-doc" class="form">
        <label>Selecionar ficheiro<input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required /></label>
        <label>Descrição<input type="text" name="docName" required /></label>
        <div class="full"><button class="btn primary" type="submit">Fazer upload</button></div>
      </form>
      <table class="table"><thead><tr><th>ID</th><th>Documento</th><th>Validade</th><th>Estado</th></tr></thead><tbody>${state.documents.map((d) => `<tr><td>${d.id}</td><td>${d.name}</td><td>${d.validUntil}</td><td>${badge(d.state)}</td></tr>`).join("")}</tbody></table></article>`;
      stateCard = `<article class="card"><h3>Partilha segura</h3><form id="form-share-doc" class="form"><label>Documento<select name="doc" required>${state.documents.map((d) => `<option value="${d.id}">${d.id} - ${d.name}</option>`).join("")}</select></label><label>Destino (email)<input type="email" name="to" required /></label><div class="full"><button class="btn primary" type="submit">Gerar link seguro</button></div></form><ul class="list">${state.shares.length ? state.shares.map((s) => `<li><span>${s.docId} para ${s.to}</span><a href="${s.url}" target="_blank" rel="noopener">Abrir link</a></li>`).join("") : "<li><span>Sem links gerados</span><span>-</span></li>"}</ul></article>`;
    }

    if (page === "participacao") {
      actionCard = formCard("Submeter proposta ou votar", [
        { label: "Titulo", name: "title", type: "text", required: true },
        { label: "Ação", name: "action", type: "select", options: ["Submeter proposta", "Votar proposta"] },
        { label: "Descrição", name: "desc", type: "textarea", required: true }
      ], "Registar", "form-participation");
      stateCard = `<article class="card"><h3>Registos</h3><ul class="list">${state.votes.length ? state.votes.map((v) => `<li><span>${v.action}: ${v.title}</span><span>${v.date}</span></li>`).join("") : "<li><span>Sem registos</span><span>-</span></li>"}</ul></article>`;
    }

    if (page === "beneficios") {
      actionCard = formCard("Candidatura a apoio", [
        { label: "Tipo", name: "kind", type: "select", options: ["Apoio social", "Reserva equipamento"] },
        { label: "Programa", name: "program", type: "text", required: true },
        { label: "Observações", name: "obs", type: "textarea", required: true }
      ], "Submeter", "form-benefit");
      stateCard = `<article class="card"><h3>Estado atual</h3><p>As candidaturas seguem workflow interno e notificação formal.</p></article>`;
    }

    if (page === "mobilidade") {
      actionCard = formCard("Pedido de mobilidade", [
        { label: "Tipo", name: "kind", type: "select", options: ["Distico residente", "Ocupacao via publica", "Autorizacao temporaria"] },
        { label: "Localização", name: "place", type: "text", required: true },
        { label: "Período", name: "period", type: "text", required: true }
      ], "Submeter", "form-mobility");
      stateCard = `<article class="card"><h3>Licenças</h3><ul class="list"><li><span>Distico D-2291</span>${badge("Valido")}</li><li><span>OVP-440</span>${badge("Em analise")}</li></ul></article>`;
    }

    if (page === "mapas") {
      actionCard = `<article class="card"><h3>Camadas GIS</h3><form id="form-gis" class="form"><label><input type="checkbox" checked name="equip"/> Equipamentos</label><label><input type="checkbox" checked name="obras"/> Obras</label><label><input type="checkbox" name="ocorr"/> Ocorrências</label><div class="full"><button class="btn primary" type="submit">Aplicar camadas</button></div></form></article>`;
      stateCard = `<article class="card"><h3>Mapa interativo</h3><div style="height:160px;border:1px dashed var(--line);border-radius:10px;display:grid;place-items:center;background:#f6fbff;">Seleção de localização com geocodificação simulada</div></article>`;
    }

    if (page === "institucional") {
      actionCard = formCard("Publicar notícia ou edital", [
        { label: "Tipo", name: "kind", type: "select", options: ["Noticia", "Edital", "Evento"] },
        { label: "Titulo", name: "title", type: "text", required: true },
        { label: "Resumo", name: "summary", type: "textarea", required: true }
      ], "Publicar", "form-institutional");
      stateCard = `<article class="card"><h3>Comunicação pública</h3><ul class="list"><li><span>Agenda municipal</span>${badge("Ativo")}</li><li><span>Editais com validade</span>${badge("Ativo")}</li><li><span>Pesquisa global</span>${badge("Ativo")}</li></ul></article>`;
    }

    if (page === "associativismo") {
      actionCard = formCard("Registar coletividade / candidatura", [
        { label: "Nome da coletividade", name: "name", type: "text", required: true },
        { label: "Tipo de apoio", name: "support", type: "select", options: ["Financeiro", "Logístico", "Espaço"] },
        { label: "Descrição", name: "description", type: "textarea", required: true }
      ], "Submeter", "form-association");
      stateCard = `<article class="card"><h3>Associações</h3><table class="table"><thead><tr><th>ID</th><th>Nome</th><th>Estado</th><th>Apoio</th></tr></thead><tbody>${state.associations.map((a) => `<tr><td>${a.id}</td><td>${a.name}</td><td>${badge(a.status)}</td><td>${a.support}</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "ativos") {
      actionCard = formCard("Registar ativo", [
        { label: "Nome do ativo", name: "name", type: "text", required: true },
        { label: "Tipo", name: "type", type: "select", options: ["Imóvel", "Equipamento", "Viatura"] },
        { label: "Unidade responsável", name: "owner", type: "text", required: true }
      ], "Adicionar ativo", "form-asset");
      stateCard = `<article class="card"><h3>Inventário</h3><table class="table"><thead><tr><th>ID</th><th>Ativo</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>${state.assets.map((a, idx) => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.type}</td><td><button class="btn" data-asset-state="${idx}">${a.state}</button></td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "contratos") {
      actionCard = formCard("Criar contrato/empreitada", [
        { label: "Fornecedor", name: "supplier", type: "text", required: true },
        { label: "Objeto", name: "object", type: "text", required: true },
        { label: "Execução física (%)", name: "physical", type: "number", required: true },
        { label: "Execução financeira (%)", name: "financial", type: "number", required: true }
      ], "Registar contrato", "form-contract");
      const backlog = state.contracts.filter((c) => c.status === "Submetido");
      const running = state.contracts.filter((c) => c.status === "Em execucao");
      const done = state.contracts.filter((c) => c.status === "Concluido");
      stateCard = `<article class="card"><h3>Execução de contratos</h3><div class="kanban"><div class="kanban-col"><h4>Submetido</h4>${backlog.map((c, idx) => `<div class="kanban-item"><strong>${c.id}</strong><div>${c.object}</div><button class="btn" data-contract-next="${state.contracts.indexOf(c)}">Avançar</button></div>`).join("") || "<div class=\"kanban-item\">Sem itens</div>"}</div><div class="kanban-col"><h4>Em execucao</h4>${running.map((c) => `<div class="kanban-item"><strong>${c.id}</strong><div>Físico ${c.physical}% | Financeiro ${c.financial}%</div><button class="btn" data-contract-next="${state.contracts.indexOf(c)}">Avançar</button></div>`).join("") || "<div class=\"kanban-item\">Sem itens</div>"}</div><div class="kanban-col"><h4>Concluido</h4>${done.map((c) => `<div class="kanban-item"><strong>${c.id}</strong><div>${c.object}</div></div>`).join("") || "<div class=\"kanban-item\">Sem itens</div>"}</div></div></article>`;
    }

    if (page === "educacao") {
      actionCard = formCard("Pedido escolar", [
        { label: "Tipo", name: "type", type: "select", options: ["Transporte escolar", "Refeicao", "Apoio educativo"] },
        { label: "Aluno", name: "student", type: "text", required: true },
        { label: "Observações", name: "notes", type: "textarea", required: true }
      ], "Submeter pedido", "form-education");
      stateCard = `<article class="card"><h3>Observatório de educação</h3><table class="table"><thead><tr><th>ID</th><th>Tipo</th><th>Aluno</th><th>Estado</th></tr></thead><tbody>${state.schoolRequests.map((r, idx) => `<tr><td>${r.id}</td><td>${r.type}</td><td>${r.student}</td><td><button class="btn" data-school-next="${idx}">${r.status}</button></td></tr>`).join("")}</tbody></table><p class="notice">Indicador de risco territorial: ${Math.max(1, Math.round(state.schoolRequests.filter((r) => r.status !== "Concluido").length * 1.3))} alertas.</p></article>`;
    }

    if (page === "estacionamento") {
      actionCard = formCard("Criar zona de estacionamento", [
        { label: "Nome da zona", name: "name", type: "text", required: true },
        { label: "Tarifa EUR/h", name: "tariff", type: "number", required: true },
        { label: "Ocupação (%)", name: "occupancy", type: "number", required: true }
      ], "Registar zona", "form-parking");
      stateCard = `<article class="card"><h3>Zonas e tarifários</h3><table class="table"><thead><tr><th>ID</th><th>Zona</th><th>Tarifa</th><th>Ocupação</th><th>Ação</th></tr></thead><tbody>${state.parkingZones.map((z, idx) => `<tr><td>${z.id}</td><td>${z.name}</td><td>${z.tariff} EUR</td><td>${z.occupancy}%</td><td><button class="btn" data-parking-raise="${idx}">+5%</button></td></tr>`).join("")}</tbody></table><button class="btn" id="btn-open-bot-map">Abrir mapa no bot</button></article>`;
    }

    if (page === "campanhas") {
      actionCard = formCard("Lançar campanha", [
        { label: "Nome", name: "name", type: "text", required: true },
        { label: "Canal", name: "channel", type: "select", options: ["Email", "SMS", "Push"] },
        { label: "Segmento", name: "segment", type: "text", required: true }
      ], "Lançar", "form-campaign");
      stateCard = `<article class="card"><h3>Campanhas executadas</h3><table class="table"><thead><tr><th>ID</th><th>Campanha</th><th>Canal</th><th>Segmento</th><th>Envios</th></tr></thead><tbody>${state.campaigns.map((c) => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.channel}</td><td>${c.segment}</td><td>${c.sent}</td></tr>`).join("")}</tbody></table></article>`;
    }

    if (page === "multiportal") {
      actionCard = formCard("Adicionar portal", [
        { label: "Nome", name: "name", type: "text", required: true },
        { label: "Tema", name: "theme", type: "text", required: true },
        { label: "Estado", name: "health", type: "select", options: ["Saudável", "Atenuado", "Crítico"] }
      ], "Criar portal", "form-portal");
      stateCard = `<article class="card"><h3>Operação multiportal</h3><table class="table"><thead><tr><th>ID</th><th>Portal</th><th>Tema</th><th>Saúde</th><th>Ação</th></tr></thead><tbody>${state.portals.map((p, idx) => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.theme}</td><td>${badge(p.health)}</td><td><button class="btn" data-portal-toggle="${idx}">Alternar</button></td></tr>`).join("")}</tbody></table></article>`;
    }

    if (!actionCard) {
      actionCard = `<article class="card"><h3>${activePageName()}</h3><p>Página funcional disponível após autenticação.</p></article>`;
      stateCard = `<article class="card"><h3>Estado</h3><p>Sem ações adicionais configuradas.</p></article>`;
    }

    const genericKpi = `
      <section class="grid kpi">
        ${kpiCard("Processos", state.processes.length)}
        ${kpiCard("Pagamentos", state.payments.length)}
        ${kpiCard("Mensagens", state.messages.length)}
        ${kpiCard("Documentos", state.documents.length)}
      </section>
    `;

    return `<section class="hero"><h2>${activePageName()}</h2><p>Fluxos funcionais com interação e persistência local.</p></section>${genericKpi}<section class="grid two">${actionCard}${stateCard}</section>`;
  }

  function pageContent() {
    if (pageType === "home") return landingPage();
    if (pageType === "login") return loginPage();
    if (pageType === "portal") return portalPage();
    if (pageType === "app") return appEmulator();
    return moduleGeneric(pageType);
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
        const hitPage = (appData.pages || []).find(([name, href]) => name.toLowerCase().includes(term) || href.toLowerCase().includes(term));
        if (hitPage) {
          location.href = hitPage[1];
          return;
        }
        const hitProc = state.processes.find((p) => p.id.toLowerCase().includes(term) || p.type.toLowerCase().includes(term));
        if (hitProc) {
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

    const fService = document.getElementById("form-service");
    if (fService) {
      fService.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fService);
        state.processes.unshift({ id: makeId("PR"), type: fd.get("subject"), status: "Submetido", owner: fd.get("service"), due: "2026-08-01" });
        state.messages.unshift({ id: makeId("CP"), subject: "Pedido submetido: " + fd.get("subject"), kind: "Informativa", read: false });
        persist();
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
        if (!item) return alert("Processo não encontrado.");
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
        const out = document.getElementById("sim-out");
        if (out) {
          out.style.display = "block";
          out.textContent = "Estimativa de taxa: " + Math.round(sqm * coef * 1.85) + " EUR";
        }
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
          state.documents.unshift({ id: makeId("CD"), name: "Comprovativo " + state.payments[idx].ref, validUntil: "Arquivo", state: "Válido" });
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
        const q = String(new FormData(fAi).get("q") || "").toLowerCase();
        const out = document.getElementById("ai-answer");
        if (!out) return;
        out.style.display = "block";
        if (q.includes("pagamento")) out.textContent = "Pode consultar e liquidar pendências na página Pagamentos.";
        else if (q.includes("processo")) out.textContent = "Acompanhe estados no módulo Processos e receba notificações na caixa postal.";
        else out.textContent = "Questão fora do âmbito automático. Encaminhar para atendimento humano.";
      });
    }

    const fUploadDoc = document.getElementById("form-upload-doc");
    if (fUploadDoc) {
      fUploadDoc.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fUploadDoc);
        const file = fd.get("file");
        const docName = String(fd.get("docName") || "").trim();
        if (!file || !file.name) return alert("Selecione um ficheiro.");
        state.documents.unshift({ id: makeId("CD"), name: docName || file.name, validUntil: "Sem validade definida", state: "Válido", fileName: file.name, fileSize: file.size });
        persist();
        alert("Documento carregado com sucesso.");
        location.reload();
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
        state.tasks.unshift({ id: makeId("TK"), unit: "Ação Social", owner: "Backoffice", desc: String(fd.get("kind")) + " - " + String(fd.get("program")) });
        state.messages.unshift({ id: makeId("CP"), subject: "Candidatura submetida", kind: "Informativa", read: false });
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

    const fInstitutional = document.getElementById("form-institutional");
    if (fInstitutional) {
      fInstitutional.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fInstitutional);
        state.messages.unshift({ id: makeId("CP"), subject: fd.get("kind") + " publicado: " + fd.get("title"), kind: "Informativa", read: false });
        persist();
        alert("Publicacao registada.");
      });
    }

    const fAssociation = document.getElementById("form-association");
    if (fAssociation) {
      fAssociation.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fAssociation);
        state.associations.unshift({ id: makeId("AS"), name: String(fd.get("name")), status: "Ativa", support: "Em avaliacao" });
        state.processes.unshift({ id: makeId("PR"), type: "Apoio associativo", status: "Submetido", owner: "Associativismo", due: "2026-08-07" });
        persist();
        location.reload();
      });
    }

    const fAsset = document.getElementById("form-asset");
    if (fAsset) {
      fAsset.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fAsset);
        state.assets.unshift({ id: makeId("GA"), name: String(fd.get("name")), type: String(fd.get("type")), state: "Operacional", owner: String(fd.get("owner")) });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-asset-state]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-asset-state"));
        if (!Number.isNaN(idx) && state.assets[idx]) {
          state.assets[idx].state = state.assets[idx].state === "Operacional" ? "Manutenção" : "Operacional";
          persist();
          location.reload();
        }
      });
    });

    const fContract = document.getElementById("form-contract");
    if (fContract) {
      fContract.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fContract);
        state.contracts.unshift({
          id: makeId("GC"),
          supplier: String(fd.get("supplier")),
          object: String(fd.get("object")),
          physical: Number(fd.get("physical") || 0),
          financial: Number(fd.get("financial") || 0),
          status: "Submetido"
        });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-contract-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-contract-next"));
        const c = state.contracts[idx];
        if (!c) return;
        if (c.status === "Submetido") c.status = "Em execucao";
        else if (c.status === "Em execucao") c.status = "Concluido";
        persist();
        location.reload();
      });
    });

    const fEducation = document.getElementById("form-education");
    if (fEducation) {
      fEducation.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fEducation);
        state.schoolRequests.unshift({ id: makeId("ED"), type: String(fd.get("type")), student: String(fd.get("student")), status: "Submetido" });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-school-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-school-next"));
        const r = state.schoolRequests[idx];
        if (!r) return;
        if (r.status === "Submetido") r.status = "Em analise";
        else if (r.status === "Em analise") r.status = "Concluido";
        else r.status = "Submetido";
        persist();
        location.reload();
      });
    });

    const fParking = document.getElementById("form-parking");
    if (fParking) {
      fParking.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fParking);
        state.parkingZones.unshift({ id: makeId("ME"), name: String(fd.get("name")), tariff: Number(fd.get("tariff")), occupancy: Number(fd.get("occupancy")) });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-parking-raise]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-parking-raise"));
        if (!Number.isNaN(idx) && state.parkingZones[idx]) {
          state.parkingZones[idx].occupancy = Math.min(100, state.parkingZones[idx].occupancy + 5);
          persist();
          location.reload();
        }
      });
    });

    const btnBotMap = document.getElementById("btn-open-bot-map");
    if (btnBotMap) {
      btnBotMap.addEventListener("click", async () => {
        const panel = document.getElementById("botPanel");
        if (panel) panel.style.display = "flex";
        await renderParkingMap();
        addBotMessage("Mostrei o mapa de estacionamento da Vila de Sintra.", false);
      });
    }

    const fCampaign = document.getElementById("form-campaign");
    if (fCampaign) {
      fCampaign.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fCampaign);
        state.campaigns.unshift({ id: makeId("CM"), name: String(fd.get("name")), channel: String(fd.get("channel")), segment: String(fd.get("segment")), sent: 1200 + Math.round(Math.random() * 800) });
        persist();
        location.reload();
      });
    }

    const fPortal = document.getElementById("form-portal");
    if (fPortal) {
      fPortal.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fPortal);
        state.portals.unshift({ id: makeId("MP"), name: String(fd.get("name")), theme: String(fd.get("theme")), health: String(fd.get("health")) });
        persist();
        location.reload();
      });
    }

    document.querySelectorAll("[data-portal-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-portal-toggle"));
        const p = state.portals[idx];
        if (!p) return;
        p.health = p.health === "Saudavel" ? "Atenuado" : p.health === "Atenuado" ? "Critico" : "Saudavel";
        persist();
        location.reload();
      });
    });

    const fApp = document.getElementById("form-app");
    if (fApp) {
      fApp.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fApp);
        state.mobile.os = String(fd.get("os"));
        state.mobile.push = String(fd.get("push"));
        persist();
        alert("Preferências da app guardadas.");
      });
    }

    document.querySelectorAll(".mobile-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-mobile-tab");
        document.querySelectorAll(".mobile-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll("[data-mobile-panel]").forEach((panel) => {
          panel.style.display = panel.getAttribute("data-mobile-panel") === key ? "block" : "none";
        });
      });
    });

    const fRead = document.getElementById("form-mobile-reading");
    if (fRead) {
      fRead.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fRead);
        state.mobile.readings.unshift({ id: makeId("AM-R"), meter: String(fd.get("meter")), value: Number(fd.get("value")), date: new Date().toISOString().slice(0, 10) });
        persist();
        location.reload();
      });
    }

    const fBulky = document.getElementById("form-mobile-bulky");
    if (fBulky) {
      fBulky.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fBulky);
        state.mobile.bulky.unshift({ id: makeId("AM-M"), address: String(fd.get("address")), when: String(fd.get("when")), status: "Agendado" });
        persist();
        location.reload();
      });
    }

    const fHearing = document.getElementById("form-mobile-hearing");
    if (fHearing) {
      fHearing.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fHearing);
        state.mobile.hearings.unshift({ id: makeId("AM-A"), topic: String(fd.get("topic")), when: String(fd.get("when")), status: "Confirmada" });
        persist();
        location.reload();
      });
    }

    const fAlert = document.getElementById("form-mobile-alert");
    if (fAlert) {
      fAlert.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fAlert);
        const area = String(fd.get("area") || "").trim();
        if (!area) return;
        if (!state.mobile.alertAreas.includes(area)) state.mobile.alertAreas.unshift(area);
        persist();
        location.reload();
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
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
    (botData.parkingInVila || []).forEach((p) => {
      const popup = `<strong>${p.name}</strong><br/>Custo: ${p.hourlyCost}<br/>Máx. diário: ${p.maxDaily}<br/><a href="${p.directionsUrl}" target="_blank" rel="noopener">Pedir direções</a>`;
      window.L.marker(p.coords).addTo(map).bindPopup(popup);
    });
    mapEl.dataset.ready = "1";
  }

  async function answerBot(question) {
    const q = question.toLowerCase();
    const parish = state.profile.parish || "Algueirao-Mem Martins";

    if (q.includes("escolas") || q.includes("estabelecimentos de ensino") || q.includes("freguesia")) {
      const edu = (botData.educationByParish || {})[parish] || (botData.educationByParish || {})["Algueirao-Mem Martins"];
      if (!edu) return "Não encontrei dados de escolas para a freguesia pedida.";
      return `Na freguesia de ${parish}:<br/><br/><strong>Publico</strong><br/>- ${edu.public.join("<br/>- ")}<br/><br/><strong>Privado</strong><br/>- ${edu.private.join("<br/>- ")}`;
    }

    if (q.includes("morada") && q.includes("urbanismo")) {
      const u = botData.urbanismDepartment || {};
      return `Departamento de Urbanismo:<br/><strong>${u.address || "Largo Dr. Virgilio Horta, 2714-501 Sintra"}</strong><br/>Telefone: ${u.phone || "+351 219 238 500"}<br/>Email: ${u.email || "municipe@cm-sintra.pt"}`;
    }

    if (q.includes("estacionamento") || q.includes("vou a vila") || q.includes("estacionar")) {
      await renderParkingMap();
      return "Mostrei o mapa interativo dos estacionamentos da Vila de Sintra.";
    }

    return "Posso responder sobre: escolas na freguesia, morada do urbanismo e estacionamento na Vila de Sintra.";
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

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = shellStart() + pageContent() + shellEnd();
    wireActions();
  }

  render();
})();
