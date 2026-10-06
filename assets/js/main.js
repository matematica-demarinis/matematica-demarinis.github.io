// Light/dark theme and content size for the home page.
// The choices are saved with the same keys used by the lessons,
// so they carry over between the home page and every lesson.
(() => {
	'use strict';
	const root = document.documentElement;
	const THEME_KEY = 'matematica-tema';
	const ZOOM_KEY = 'matematica-zoom';
	const ZOOMS = ['100', '115', '130', '150'];
	const THEME_COLOR = { light: '#F3F6F9', dark: '#0F141A' };

	// localStorage can be missing or blocked (private mode): the page must work anyway.
	const read = key => { try { return localStorage.getItem(key); } catch (e) { return null; } };
	const write = (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} };

	// Applied while the <head> is read, so the page is never drawn with the wrong theme.
	root.dataset.theme = read(THEME_KEY) === 'dark' ? 'dark' : 'light';
	root.dataset.zoom = ZOOMS.includes(read(ZOOM_KEY)) ? read(ZOOM_KEY) : '100';
	const themeMeta = document.querySelector('meta[name="theme-color"]');
	if (themeMeta) themeMeta.content = THEME_COLOR[root.dataset.theme];

	document.addEventListener('DOMContentLoaded', () => {
		const $ = id => document.getElementById(id);

		// ---------- Theme ----------
		const themeBtn = $('theme');
		function applyTheme(dark, save) {
			root.dataset.theme = dark ? 'dark' : 'light';
			$('themeGlyph').textContent = dark ? '☀' : '☾';
			themeBtn.setAttribute('aria-label', dark ? 'Attiva il tema chiaro' : 'Attiva il tema scuro');
			themeBtn.title = dark ? 'Tema chiaro' : 'Tema scuro';
			if (themeMeta) themeMeta.content = dark ? THEME_COLOR.dark : THEME_COLOR.light;
			if (save) write(THEME_KEY, dark ? 'dark' : 'light');
		}
		applyTheme(root.dataset.theme === 'dark', false);
		themeBtn.addEventListener('click', () => applyTheme(root.dataset.theme !== 'dark', true));

		// ---------- Content size ----------
		const inputs = [...document.querySelectorAll('[name="zoomLevel"]')];
		function applyZoom(value, save) {
			const z = ZOOMS.includes(value) ? value : '100';
			root.dataset.zoom = z;
			inputs.forEach(i => { i.checked = i.value === z; });
			if (save) write(ZOOM_KEY, z);
		}
		applyZoom(root.dataset.zoom, false);
		inputs.forEach(i => i.addEventListener('change', () => { if (i.checked) applyZoom(i.value, true); }));

		// ---------- Size panel: opens under the magnifier, closes with ✕, Esc or a click outside ----------
		const panel = $('zpanel');
		const zoomBtn = $('zoomBtn');
		function setPanel(open, backToButton) {
			panel.hidden = !open;
			zoomBtn.setAttribute('aria-expanded', String(open));
			if (open) (inputs.find(i => i.checked) || inputs[0]).focus();
			else if (backToButton) zoomBtn.focus();
		}
		zoomBtn.addEventListener('click', () => setPanel(panel.hidden));
		$('zclose').addEventListener('click', () => setPanel(false, true));
		document.addEventListener('pointerdown', e => {
			if (!panel.hidden && !$('zmenu').contains(e.target)) setPanel(false, false);
		});
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); setPanel(false, true); }
		});
		// Leaving the panel with Tab closes it. relatedTarget is null when Safari taps a label: keep it open then.
		panel.addEventListener('focusout', e => {
			if (e.relatedTarget && !$('zmenu').contains(e.relatedTarget)) setPanel(false, false);
		});
	});
})();
