let paginaAtual = 0;
const divLista = document.getElementById("denuncias");
const spanPagina = document.getElementById("pagina-atual");

function carregarPagina(pagina) {
  if (pagina < 0) return;

  fetch(`http://localhost:8080/denuncias?page=${pagina}&size=5`)
    .then(res => res.json())
    .then(data => {
      if (data.content.length === 0 && pagina > 0) return;

      divLista.innerHTML = "";
      data.content.forEach(d => {
        const denuncia = document.createElement("div");
        denuncia.className = "report";
        denuncia.innerHTML = `
          <section class="infoContainer">
            <h2 class="reportTitle">${d.titulo}</h2>
            <div class="reportLocation">
              <p class="location">${d.endereco}</p>
              <p class="region">Região: ${d.regiao || "N/D"}</p>
            </div>
            <div class="tagContainer">
              <span class="reportTag worksTag">${d.departamento || "DEPARTAMENTO"}</span>
              <span class="reportTag segmentTag">${d.segmento || "SEGMENTO"}</span>
            </div>
          </section>
          <section class="statusContainer">
            <span class="currentStatus ${getStatusClass(d.status)}">${d.status || "NOVA"}</span>
          </section>
        `;
        divLista.appendChild(denuncia);
      });

      paginaAtual = pagina;
      spanPagina.innerText = `Página: ${pagina + 1}`;
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

carregarPagina(0);
