const main = document.getElementById("main-content");
const links = document.querySelectorAll("nav a");
const smiley = document.getElementById("profile-smiley");

const faces = {
	readme: ":O",
	projects: ":P",
	github: ":D",
	resume: ":|",
	links: ":)",
};
const missingFace = ":(";
const hoverFace = ";)";
let face = faces.readme;

const githubUser = "w0x7y";
const cacheMinutes = 10;
const searchLimit = 1000;
const commands = {
	github: ["git", "log"],
	links: ["./links.sh"],
};
const loaders = {
	projects: loadProjects,
	github: loadCommits,
};
let renderCount = 0;

const languageColors = {
	Java: "red",
	TypeScript: "blue",
	JavaScript: "green",
	Python: "yellow",
	Rust: "pink",
	Lua: "violet",
	CSS: "cyan",
};

function fileType(name) {
	if (name.endsWith("/")) return "ls-dir";
	if (name.endsWith(".sh")) return "ls-exec";
	return "ls-file";
}

function element(tag, className, text) {
	const el = document.createElement(tag);
	el.className = className;
	if (text !== undefined) el.textContent = text;
	return el;
}

function span(className, text) {
	return element("span", className, text);
}

function readCache(key) {
	try {
		const cached = JSON.parse(sessionStorage.getItem(key));
		if (cached && Date.now() - cached.time < cacheMinutes * 60_000)
			return cached.data;
	} catch {}
	return null;
}

function writeCache(key, data) {
	try {
		sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
	} catch {}
}

async function fetchGithub(url) {
	const response = await fetch(url, {
		headers: { Accept: "application/vnd.github+json" },
	});
	if (response.status === 403 || response.status === 429) {
		throw new Error("GitHub rate limit reached, try again later");
	}
	if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
	return response.json();
}

async function getRepos() {
	const cached = readCache("repos");
	if (cached) return cached;

	const repos = await fetchGithub(
		`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=pushed`,
	);
	const projects = repos
		.filter((repo) => !repo.fork && repo.name.toLowerCase() !== githubUser)
		.map((repo) => ({
			name: repo.name,
			url: repo.html_url,
			description: repo.description,
			language: repo.language,
			stars: repo.stargazers_count,
			pushed: repo.pushed_at.slice(0, 10),
		}));

	writeCache("repos", projects);
	return projects;
}

function repoList(repos) {
	const list = element("ul", "repo-list");
	for (const repo of repos) {
		const item = element("li", "repo");
		const head = element("div", "repo-head");

		const name = element("a", "repo-name", `${repo.name}/`);
		name.href = repo.url;

		const meta = span("repo-meta");
		const parts = [];
		if (repo.language) {
			const language = span("repo-language", repo.language);
			language.style.color = `var(--rime-${languageColors[repo.language] ?? "steel"})`;
			parts.push(language);
		}
		if (repo.stars) {
			parts.push(
				span(
					"repo-stars",
					repo.stars === 1 ? "1 star" : `${repo.stars} stars`,
				),
			);
		}
		parts.push(span("repo-date", repo.pushed));
		parts.forEach((part, i) =>
			meta.append(...(i ? [" · ", part] : [part])),
		);

		head.append(name, meta);
		item.append(head);

		if (repo.description) {
			item.append(element("p", "repo-description", repo.description));
		}
		list.append(item);
	}
	return list;
}

async function loadProjects(container, isCurrent) {
	const status = element(
		"p",
		"status status-loading",
		"fetching repos from github...",
	);
	container.append(status);

	try {
		const repos = await getRepos();
		if (!isCurrent()) return;
		status.classList.remove("status-loading");
		status.textContent = `total ${repos.length}`;
		status.after(repoList(repos));
	} catch (error) {
		if (!isCurrent()) return;
		status.replaceWith(
			element(
				"p",
				"prompt-error",
				`ls: cannot access 'projects/': ${error.message}`,
			),
		);
	}
}

function prompt(command, target, type) {
	const line = document.createElement("h1");
	line.className = "prompt";
	line.append(
		span("prompt-path", "~/w0x7y"),
		" ",
		span("prompt-symbol", ">"),
		" ",
		span(
			command.startsWith("./")
				? "prompt-command ls-exec"
				: "prompt-command",
			command,
		),
	);
	if (target)
		line.append(" ", span(`prompt-target ${type ?? ""}`.trim(), target));
	return line;
}

async function getCommits(page) {
	const key = `commits-${page}`;
	const cached = readCache(key);
	if (cached) return cached;

	const data = await fetchGithub(
		`https://api.github.com/search/commits?q=author:${githubUser}&sort=author-date&order=desc&per_page=100&page=${page}`,
	);
	const result = {
		total: data.total_count,
		commits: data.items.map((item) => ({
			sha: item.sha.slice(0, 7),
			url: item.html_url,
			message: item.commit.message.split("\n")[0],
			repo: item.repository.name,
			date: item.commit.author.date.slice(0, 10),
		})),
	};

	writeCache(key, result);
	return result;
}

function commitItem(commit) {
	const item = element("li", "commit");
	const sha = element("a", "commit-sha", commit.sha);
	sha.href = commit.url;
	item.append(
		sha,
		" ",
		span("commit-repo", `(${commit.repo})`),
		" ",
		span("commit-message", commit.message),
	);
	return item;
}

async function loadCommits(container, isCurrent) {
	const status = element(
		"p",
		"status status-loading",
		"fetching commits from github...",
	);
	const log = element("div", "commit-log");
	const error = element("p", "prompt-error");
	const more = element("button", "load-more", "load more");
	more.type = "button";
	error.hidden = true;
	more.hidden = true;
	container.append(status, log, error, more);

	let page = 0;
	let shown = 0;
	let day = null;
	let list = null;

	async function next() {
		more.disabled = true;
		error.hidden = true;
		try {
			const { total, commits } = await getCommits(page + 1);
			if (!isCurrent()) return;
			page += 1;

			for (const commit of commits) {
				if (commit.date !== day) {
					day = commit.date;
					list = element("ul", "commit-list");
					log.append(element("h2", "commit-date", day), list);
				}
				list.append(commitItem(commit));
			}

			shown += commits.length;
			status.classList.remove("status-loading");
			status.textContent = `showing ${shown} of ${total} commits`;
			more.hidden =
				commits.length === 0 || shown >= Math.min(total, searchLimit);
		} catch (err) {
			if (!isCurrent()) return;
			if (shown === 0) status.hidden = true;
			error.textContent = `fatal: ${err.message}`;
			error.hidden = false;
		} finally {
			more.disabled = false;
		}
	}

	more.addEventListener("click", next);
	await next();
}

function render() {
	const current = ++renderCount;
	const page = location.hash.slice(1) || "readme";
	const link = [...links].find((link) => link.hash === `#${page}`);
	const target = link ? link.textContent.trim() : page;
	const [command, argument, type] = commands[page] ?? [
		target.endsWith("/") ? "ls" : "cat",
		target,
		fileType(target),
	];
	const template = document.getElementById(`page-${page}`);

	const content = template
		? template.content.cloneNode(true)
		: span(
				"prompt-error",
				`${command}: ${argument}: No such file or directory`,
			);

	main.replaceChildren(prompt(command, argument, type), content);

	if (template && loaders[page]) {
		loaders[page](main, () => current === renderCount);
	}

	face = template ? (faces[page] ?? faces.readme) : missingFace;
	smiley.textContent = face;

	links.forEach((link) => {
		if (link.hash === `#${page}`) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	});
}

const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeName = document.getElementById("theme-name");
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeLabels = { dark: "rime", light: "rime frost" };

function applyTheme(theme) {
	const root = document.documentElement;
	if (theme === "light") root.dataset.theme = "light";
	else delete root.dataset.theme;

	themeButtons.forEach((button) => {
		button.setAttribute(
			"aria-pressed",
			button.dataset.themeOption === theme,
		);
	});
	themeName.textContent = themeLabels[theme];
	themeColor.content = getComputedStyle(root)
		.getPropertyValue("--rime-bg")
		.trim();
}

themeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const theme = button.dataset.themeOption;
		applyTheme(theme);
		try {
			localStorage.setItem("theme", theme);
		} catch {}
	});
});

applyTheme(
	document.documentElement.dataset.theme === "light" ? "light" : "dark",
);

smiley.parentElement.addEventListener("pointerenter", () => {
	smiley.textContent = hoverFace;
});
smiley.parentElement.addEventListener("pointerleave", () => {
	smiley.textContent = face;
});

window.addEventListener("hashchange", render);
render();
