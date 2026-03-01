const MOJIBAKE_MARKERS = /[ÃÂ¢�Ò]/;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);

function scoreText(value: string): number {
  const badMatches = value.match(/[ÃÂ¢�Ò]/g)?.length ?? 0;
  const replacementChars = value.match(/�/g)?.length ?? 0;
  return badMatches * 2 + replacementChars * 3;
}

function decodeLatin1AsUtf8(value: string): string {
  const bytes = Uint8Array.from(Array.from(value, (char) => char.charCodeAt(0) & 0xff));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function applyPortugueseFixes(value: string): string {
  return value
    .replace(/\bVisao\b/g, "Visão")
    .replace(/\bAcao\b/g, "Ação")
    .replace(/\bIntegracoes\b/g, "Integrações")
    .replace(/\bOtimizacao\b/g, "Otimização")
    .replace(/\bAtencao\b/g, "Atenção")
    .replace(/\bCritico\b/g, "Crítico")
    .replace(/\bGovernanca\b/g, "Governança")
    .replace(/\bOperacao\b/g, "Operação")
    .replace(/\bExperiencia\b/g, "Experiência")
    .replace(/\bArea\b/g, "Área")
    .replace(/\bUltima\b/g, "Última")
    .replace(/\bRevisao\b/g, "Revisão")
    .replace(/\bSemaforo\b/g, "Semáforo")
    .replace(/\bMedico\b/g, "Médico")
    .replace(/\bMetrica\b/g, "Métrica")
    .replace(/\bMetricas\b/g, "Métricas")
    .replace(/\bProjecao\b/g, "Projeção")
    .replace(/\bDistribuicao\b/g, "Distribuição")
    .replace(/\bConversao\b/g, "Conversão")
    .replace(/\bOcupacao\b/g, "Ocupação")
    .replace(/\bLiquido\b/g, "Líquido")
    .replace(/\bFuncionario\b/g, "Funcionário")
    .replace(/\bRetencao\b/g, "Retenção")
    .replace(/\bAquisicao\b/g, "Aquisição")
    .replace(/\bTendencia\b/g, "Tendência")
    .replace(/\bDimensao\b/g, "Dimensão")
    .replace(/\bPersistencia\b/g, "Persistência")
    .replace(/\bNao\b/g, "Não")
    .replace(/Òš/g, "Ú")
    .replace(/Ò£/g, "ã")
    .replace(/Ò§/g, "ç")
    .replace(/Òª/g, "ê")
    .replace(/Ò©/g, "é")
    .replace(/Òí/g, "í")
    .replace(/Òá/g, "á")
    .replace(/Òó/g, "ó")
    .replace(/Òõ/g, "õ")
    .replace(/ÒÁ/g, "Á")
    .replace(/ÒÉ/g, "É")
    .replace(/ÒÍ/g, "Í")
    .replace(/ÒÓ/g, "Ó")
    .replace(/ÒÕ/g, "Õ");
}

export function normalizeMojibakeText(input: string): string {
  if (!input || !MOJIBAKE_MARKERS.test(input)) {
    return input;
  }

  let best = input;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const decoded = decodeLatin1AsUtf8(best);
      if (!decoded || scoreText(decoded) > scoreText(best)) {
        break;
      }

      best = decoded;
    } catch {
      break;
    }
  }

  return applyPortugueseFixes(best);
}

function normalizeAttributes(element: Element) {
  for (const attributeName of ["placeholder", "title", "aria-label"]) {
    const currentValue = element.getAttribute(attributeName);
    if (!currentValue) continue;

    const normalizedValue = normalizeMojibakeText(currentValue);
    if (normalizedValue !== currentValue) {
      element.setAttribute(attributeName, normalizedValue);
    }
  }
}

function normalizeTextNode(node: Text) {
  const value = node.nodeValue;
  if (!value) return;

  const normalizedValue = normalizeMojibakeText(value);
  if (normalizedValue !== value) {
    node.nodeValue = normalizedValue;
  }
}

export function normalizeMojibakeTree(root: ParentNode) {
  if (root instanceof Element) {
    normalizeAttributes(root);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parentTag = textNode.parentElement?.tagName;
    if (!parentTag || !SKIP_TAGS.has(parentTag)) {
      normalizeTextNode(textNode);
    }
    current = walker.nextNode();
  }

  if (root instanceof Element) {
    root.querySelectorAll("*").forEach((element) => normalizeAttributes(element));
  }
}
