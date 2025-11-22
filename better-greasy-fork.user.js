// ==UserScript==
// @name         Better Greasy Fork – CZ Edition
// @namespace    https://github.com/janachmelarskadp-art/Better-Greasy-Fork/
// @version      0.2.0
// @description  Vylepšený Greasy Fork: pokročilé vyhledávání, filtry, tmavý mód, notifikace. Forked & enhanced pro CZ uživatele.
// @author       0H4S (forked by janachmelarskadp-art)
// @match        https://greasyfork.org/*
// @match        https://greasyfork.org/cs/*  // Podpora CZ verze
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/janachmelarskadp-art/Better-Greasy-Fork/main/better-greasy-fork.user.js
// @downloadURL  https://raw.githubusercontent.com/janachmelarskadp-art/Better-Greasy-Fork/main/better-greasy-fork.user.js
// @icon         data:image/svg+xml;base64,... (přidej ikonu z icons.json později)
// ==/UserScript==

(function() {
    'use strict';

    // Načti custom CSS z tvého repa
    const cssUrl = 'https://raw.githubusercontent.com/janachmelarskadp-art/Better-Greasy-Fork/main/custom.css';
    fetch(cssUrl)
        .then(response => response.text())
        .then(css => {
            const style = document.createElement('style');
            style.id = 'better-gf-css';
            style.textContent = css + `
                /* Dodatečné CZ styly */
                .dark-mode { background: #1a1a1a; color: #e0e0e0; }
                .gf-search-filters { background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px; }
                .gf-filter-btn { background: #007bff; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer; }
                .gf-filter-btn:hover { background: #0056b3; }
            `;
            document.head.appendChild(style);
        })
        .catch(err => console.error('Better GF: CSS load failed', err));

    // Načti ikony z JSON
    const iconsUrl = 'https://raw.githubusercontent.com/janachmelarskadp-art/Better-Greasy-Fork/main/icons.json';
    let iconsData = {};
    fetch(iconsUrl)
        .then(response => response.json())
        .then(icons => {
            iconsData = icons;
            addIconsToUI(icons);
        })
        .catch(err => console.error('Better GF: Icons load failed', err));

    function addIconsToUI(icons) {
        // Příklad: Přidej filtr ikonu do headeru
        const header = document.querySelector('header');
        if (header && icons.filterIcon) {
            const filterDiv = document.createElement('div');
            filterDiv.className = 'gf-search-filters';
            filterDiv.innerHTML = `
                <button class="gf-filter-btn" onclick="toggleDarkMode()">🌙 Tmavý mód</button>
                <button class="gf-filter-btn" onclick="applyLanguageFilter('cs')">🇨🇿 CZ skripty</button>
                <button class="gf-filter-btn" onclick="showUpdates()">🔔 Aktualizace</button>
                ${icons.filterIcon ? `<img src="${icons.filterIcon}" alt="Filtry" style="width:20px;">` : ''}
            `;
            header.appendChild(filterDiv);
        }
    }

    // Funkce pro vylepšení
    window.toggleDarkMode = () => document.body.classList.toggle('dark-mode');
    window.applyLanguageFilter = (lang) => {
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput) {
            searchInput.value = (searchInput.value + ` lang:${lang}`).trim();
            searchInput.form.submit();  // Spusť vyhledávání
        }
        console.log(`Better GF: Aplikováno filtrování pro ${lang}`);
    };
    window.showUpdates = () => {
        // Příklad notifikace – získej z localStorage nebo API
        alert('Nové aktualizace: 5 skriptů! (Přidej logiku pro real data)');
    };

    // Enhance search bar
    function enhanceSearch() {
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput) {
            searchInput.placeholder = 'Hledej skripty... (přidej: lang:cs, rating:4+, telegram)';
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.includes('lang:cs')) {
                    // Automatický filtr pro CZ
                    console.log('Automatický CZ filtr aktivní');
                }
                // Přidej real-time náhledy (pokročilé – použij MutationObserver)
            });

            // Přidej rychlé instalace tlačítko
            const installBtn = document.createElement('button');
            installBtn.textContent = '🚀 Instaluj vybrané';
            installBtn.onclick = () => {
                const selected = document.querySelectorAll('input[type="checkbox"]:checked');
                selected.forEach(cb => {
                    const link = cb.closest('tr').querySelector('a[href*="/scripts/"]');
                    if (link) window.open(link.href + '/code', '_blank');  // Otevři instalaci
                });
            };
            searchInput.parentNode.appendChild(installBtn);
        }
    }

    // Spusť po načtení
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceSearch);
    } else {
        enhanceSearch();
    }

    // Zkontroluj aktualizace (jednou za den)
    const lastCheck = localStorage.getItem('gf-last-update-check');
    if (!lastCheck || Date.now() - parseInt(lastCheck) > 86400000) {
        fetch('https://api.github.com/repos/janachmelarskadp-art/Better-Greasy-Fork/commits/main')
            .then(res => res.json())
            .then(data => {
                const latestVersion = data.sha.substring(0, 7);
                if (localStorage.getItem('gf-version') !== latestVersion) {
                    alert('Nová verze Better GF dostupná! Update z GitHubu.');
                    localStorage.setItem('gf-version', latestVersion);
                }
                localStorage.setItem('gf-last-update-check', Date.now().toString());
            });
    }

    console.log('Better Greasy Fork – CZ Edition načteno! Verze 0.2.0');
})();