document.addEventListener("DOMContentLoaded", function () {
	const mainContent = document.getElementById("main-content");
	const menuPC = document.getElementById("menuPC");
	const menuMobile = document.getElementById("menuMobile");

	document.body.addEventListener("click", function (e) {
		const link = e.target.closest("a");
		if (
			link &&
			link.href &&
			link.origin === location.origin &&
			!link.pathname.startsWith("/assets")
		) {
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
				const newMenuPC = doc.getElementById("menuPC");
				const newMenuMobile = doc.getElementById("menuMobile");

				mainContent.replaceChildren(...newMain.children);
				menuPC.replaceChildren(...newMenuPC.children);
				menuMobile.replaceChildren(...newMenuMobile.children);

				history.pushState({}, "", url);
			})
			.catch(console.error);
	}

	window.addEventListener("popstate", () => loadNewContent(location.href));
});