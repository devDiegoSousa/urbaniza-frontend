let paginaAtual = 0;
const divLista = document.getElementById("reportContainer");
const spanPagina = document.getElementById("pagina-atual");

function carregarPagina(pagina) {
  if (pagina < 0) return;

  fetch(`http://localhost:8282/denuncias?page=${pagina}&size=8`)
    .then(res => res.json())
    .then(data => {
      if (data.content.length === 0 && pagina > 0) return;

      divLista.innerHTML = "";
      data.content.forEach(report => {
        const report = document.createElement("li");
        report.className = "report";
        report.innerHTML = `
          <section class="infoContainer">
            <h2 class="reportTitle">${report.title}</h2>
            <div class="reportLocation">
              <p class="location">Long: ${report.longitude}, Lat: ${report.latitude}</p>
              <p class="region">Região: ${d.region || "N/D"}</p>
            </div>
            <div class="tagContainer">
              <span class="reportTag worksTag">${d.segment.departmentName || "DEPARTAMENTO"}</span>
              <span class="reportTag segmentTag">${d.segment || "SEGMENTO"}</span>
            </div>
          </section>
          <section class="statusContainer">
            <span class="currentStatus ${getStatusClass(report.status)}">${report.status || "NOVA"}</span>
          </section>
        `;
        divLista.appendChild(report);
      });

      paginaAtual = pagina;
      spanPagina.innerText = `Página: ${pagina}`;
    });
}

function getStatusClass(status) {
  const map = {
    "NOVA": "newStatus",
    "EM ANALISE": "analyzingStatus",
    "RESOLVENDO": "correctingStatus",
    "CONCLUÍDO": "resolvedStatus",
    "APROVADO": "aprovedStatus",
    "REJEITADO": "rejectedStatus"
  };
  return map[status?.toUpperCase()] || "newStatus";
}

document.getElementById("btnAnterior").onclick = () => carregarPagina(paginaAtual - 1);
document.getElementById("btnProximo").onclick = () => carregarPagina(paginaAtual + 1);

carregarPagina(paginaAtual);
