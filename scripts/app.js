const main = document.getElementById("main-content");
const links = document.querySelectorAll("nav a");
const smiley = document.getElementById("profile-smiley");

const faces = {
	readme: ":O",
	projects: ":P",
	github: ":D",
	resume: ":|",
};
const missingFace = ":(";
const hoverFace = ";)";
let face = faces.readme;

function span(className, text) {
	const el = document.createElement("span");
	el.className = className;
	el.textContent = text;
	return el;
}

function prompt(command, target) {
	const line = document.createElement("h1");
	line.className = "prompt";
	line.append(
		span("prompt-path", "~/w0x7y"),
		" ",
		span("prompt-symbol", ">"),
		" ",
		span("prompt-command", command),
		" ",
		span("prompt-target", target),
	);
	return line;
}

function render() {
	const page = location.hash.slice(1) || "readme";
	const link = [...links].find((link) => link.hash === `#${page}`);
	const target = link ? link.textContent.trim() : page;
	const command = target.endsWith("/") ? "ls" : "cat";
	const template = document.getElementById(`page-${page}`);

	const content = template
		? template.content.cloneNode(true)
		: span("prompt-error", `${command}: ${target}: No such file or directory`);

	main.replaceChildren(prompt(command, target), content);

	face = template ? (faces[page] ?? faces.readme) : missingFace;
	smiley.textContent = face;

	links.forEach((link) => {
		if (link.hash === `#${page}`) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	});
}

smiley.parentElement.addEventListener("pointerenter", () => {
	smiley.textContent = hoverFace;
});
smiley.parentElement.addEventListener("pointerleave", () => {
	smiley.textContent = face;
});

window.addEventListener("hashchange", render);
render();
