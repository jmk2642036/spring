/* global SPOTS */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSpotId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id") || "";
}

function resolveImageCandidates(spotName) {
  const imageBaseName = encodeURIComponent(spotName);
  return [
    `./assets/${imageBaseName}.jpg`,
    `./assets/${imageBaseName}.jpeg`,
    `./assets/${imageBaseName}.png`,
    `./assets/${imageBaseName}.webp`,
  ];
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function main() {
  const spots = Array.isArray(window.SPOTS) ? window.SPOTS : [];
  const id = getSpotId();
  const spot = spots.find((s) => s.id === id);

  if (!spot) {
    document.title = "명소를 찾을 수 없음";
    setText("spotTitle", "명소를 찾을 수 없어요.");
    setText("spotTag", "메인으로 돌아가 다른 장소를 선택해주세요.");
    setText("spotDesc", "URL의 id 값이 올바르지 않거나 데이터가 없습니다.");
    return;
  }

  document.title = `${spot.name} 상세`;
  setText("spotTitle", spot.name);
  setText("spotTag", spot.tag);
  setText("spotDesc", spot.longDesc || spot.desc);
  setText("spotTagValue", spot.tag);
  setText("spotCoords", `${spot.lat.toFixed(5)}, ${spot.lng.toFixed(5)}`);

  const factsWrap = document.getElementById("detailFacts");
  if (factsWrap) {
    factsWrap.innerHTML = "";
    const d = spot.detail;
    if (d && typeof d === "object") {
      const rows = [
        ["기간", d.period],
        ["장소", d.area],
        ["주요 행사", d.events],
        ["벚꽃 특징", d.blossomFeature],
        ["팁", d.tip],
      ];
      for (const [label, value] of rows) {
        if (!value) continue;
        const item = document.createElement("div");
        item.className = "detailFact";
        item.innerHTML = `<div class="detailLabel">${escapeHtml(label)}</div><div class="detailValue">${escapeHtml(value)}</div>`;
        factsWrap.appendChild(item);
      }
      factsWrap.hidden = factsWrap.children.length === 0;
    } else {
      factsWrap.hidden = true;
    }
  }

  const tipsRoot = document.getElementById("spotTips");
  if (tipsRoot) {
    tipsRoot.innerHTML = "";
    for (let i = 0; i < spot.tips.length; i += 1) {
      const t = spot.tips[i];
      const span = document.createElement("span");
      span.className = i % 2 === 0 ? "pill" : "pill pill--cool";
      span.textContent = t;
      tipsRoot.appendChild(span);
    }
  }

  const img = document.getElementById("spotImage");
  if (img) {
    img.alt = `${escapeHtml(spot.name)} 사진`;
    const candidates = resolveImageCandidates(spot.name);
    let idx = 0;
    const tryNext = () => {
      idx += 1;
      if (idx >= candidates.length) {
        img.removeAttribute("src");
        img.alt = `${spot.name} (이미지 없음)`;
        return;
      }
      img.src = candidates[idx];
    };
    img.addEventListener("error", tryNext);
    img.src = candidates[0];
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}

