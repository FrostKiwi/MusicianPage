document.addEventListener("DOMContentLoaded", function () {
	const mainContent = document.getElementById("main-content");

	document.body.addEventListener("click", function (e) {
		const link = e.target.closest("a");
		if (link && link.href && link.origin === location.origin) {
			e.preventDefault();
			navigateTo(link.href);
		}
	});

	function navigateTo(url) {
		if (document.startViewTransition)
			document.startViewTransition(() => loadNewContent(url));
		else
			loadNewContent(url);
	}

	function loadNewContent(url) {
		fetch(url)
			.then(response => response.text())
			.then(html => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");
				const newMain = doc.getElementById("main-content");
				if (newMain) {
					mainContent.replaceChildren(...newMain.children);
					history.pushState({}, "", url);
				}
			})
			.catch(console.error);
	}

	window.addEventListener("popstate", () => loadNewContent(location.href));
});