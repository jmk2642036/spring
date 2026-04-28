/* global L, SPOTS */

const spots = Array.isArray(window.SPOTS) ? window.SPOTS : [];

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initMap() {
  // Seoul center
  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([37.5665, 126.978], 12);

  // Use a widely-allowed OSM-based tileset to avoid "Referer required" blocks.
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);

  const bounds = L.latLngBounds([]);
  const markersById = new Map();

  const icon = L.divIcon({
    className: "spotPin",
    html: `<div class="spotPin__dot" aria-hidden="true"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -8],
  });

  for (const spot of spots) {
    const latlng = L.latLng(spot.lat, spot.lng);
    bounds.extend(latlng);

    const popupHtml = `
      <div style="min-width: 210px">
        <div style="font-weight: 800; margin-bottom: 4px;">${escapeHtml(
          spot.name
        )}</div>
        <div style="color: rgba(255,255,255,0.78); font-size: 13px; line-height: 1.45;">
          ${escapeHtml(spot.desc)}
        </div>
        <div style="margin-top: 8px; font-size: 12.5px; color: rgba(255,255,255,0.78);">
          좌표: ${spot.lat.toFixed(5)}, ${spot.lng.toFixed(5)}
        </div>
      </div>
    `;

    const marker = L.marker(latlng, { icon }).addTo(map).bindPopup(popupHtml);
    markersById.set(spot.id, marker);
  }

  map.fitBounds(bounds.pad(0.18));

  return { map, markersById };
}

function renderLegend({ map, markersById }) {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";

  for (const spot of spots) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = spot.name;
    btn.addEventListener("click", () => {
      const marker = markersById.get(spot.id);
      if (!marker) return;
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: true });
      marker.openPopup();
    });
    li.appendChild(btn);
    legend.appendChild(li);
  }
}

function renderSpotCards() {
  const root = document.getElementById("spots");
  root.innerHTML = "";

  for (const spot of spots) {
    const el = document.createElement("a");
    el.className = "spot spot--link";
    el.href = `./spot.html?id=${encodeURIComponent(spot.id)}`;
    el.setAttribute("aria-label", `${spot.name} 상세페이지로 이동`);

    const tips = spot.tips
      .map((t, idx) => {
        const cls = idx % 2 === 0 ? "pill" : "pill pill--cool";
        return `<span class="${cls}">${escapeHtml(t)}</span>`;
      })
      .join("");

    const imageBaseName = encodeURIComponent(spot.name);
    const imageCandidates = [
      `./assets/${imageBaseName}.jpg`,
      `./assets/${imageBaseName}.jpeg`,
      `./assets/${imageBaseName}.png`,
      `./assets/${imageBaseName}.webp`,
    ];

    el.innerHTML = `
      <div class="spot__head">
        <h3 class="spot__name">${escapeHtml(spot.name)}</h3>
        <span class="spot__tag">${escapeHtml(spot.tag)}</span>
      </div>
      <p class="spot__desc">${escapeHtml(spot.desc)}</p>
      <div class="spot__imageWrap" aria-label="${escapeHtml(
        spot.name
      )} 사진">
        <img class="spot__image" alt="${escapeHtml(spot.name)}" loading="lazy" />
      </div>
      <div class="spot__meta">${tips}</div>
    `;

    root.appendChild(el);

    // Resolve image in order of common extensions. If none exist, hide the slot.
    const img = el.querySelector(".spot__image");
    const wrap = el.querySelector(".spot__imageWrap");
    if (img && wrap) {
      let i = 0;
      const tryNext = () => {
        i += 1;
        if (i >= imageCandidates.length) {
          wrap.hidden = true;
          return;
        }
        img.src = imageCandidates[i];
      };
      img.addEventListener("error", tryNext);
      img.src = imageCandidates[0];
    }
  }
}

function injectPinStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .spotPin { }
    .spotPin__dot {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 30%, rgba(255,106,166,0.95) 70%);
      border: 2px solid rgba(255,255,255,0.78);
      box-shadow: 0 10px 26px rgba(255, 106, 166, 0.42);
    }
  `;
  document.head.appendChild(style);
}

function main() {
  injectPinStyles();
  const mapCtx = initMap();
  renderLegend(mapCtx);
  renderSpotCards();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}

