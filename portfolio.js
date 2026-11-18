const logLines = [
  ["[ BIOS ] Initialising PORTFOLIO-OS", ""],
  ["[ CPU ] developer.mode = ACTIVE", "ok"],
  ["[ FS ] mounting /home/phumudzo", "ok"],
  ["[ DB ] loading skills + projects index", "ok"],
  ["[ NET ] github route ready", "ok"],
  ["[ UI ] responsive shell online", "ok"],
  ["[ SYS ] Welcome, visitor.", "cyan"],
];
const boot = document.getElementById("boot"),
  log = document.getElementById("bootLog"),
  bar = document.getElementById("bootBar"),
  pct = document.getElementById("bootPct");
let skipped = false;
function finishBoot() {
  boot.classList.add("hide");

  setTimeout(() => {
    boot.remove();
    showWelcome();
  }, 700);
}

function showWelcome() {
  const welcome = document.getElementById("welcomePopup");

  if (!welcome) return;

  welcome.classList.add("show");
}

function closeWelcome() {
  const welcome = document.getElementById("welcomePopup");

  if (!welcome) return;

  welcome.classList.remove("show");

  setTimeout(() => {
    welcome.style.display = "none";
  }, 450);
}

document.getElementById("welcomePopup").addEventListener("click", (e) => {
  if (e.target.id === "welcomePopup") {
    closeWelcome();
  }
});
function runBoot() {
  let i = 0;

  // How long each boot stage should pause
  const delays = [500, 700, 900, 1200, 500, 700, 400];

  // Progress values at each stage
  const progress = [8, 21, 38, 55, 71, 84, 100];

  function addLogLine(text, type) {
    const d = document.createElement("div");

    d.textContent = text;

    if (type === "ok") {
      d.innerHTML = d.textContent.replace("[ OK ]", "") + " <b>[ OK ]</b>";
    } else if (type === "cyan") {
      d.style.color = "var(--cyan)";
    }

    log.appendChild(d);

    // Keep the newest line visible
    log.scrollTop = log.scrollHeight;
  }

  function animateProgress(target, duration, callback) {
    const current = parseInt(bar.style.width) || 0;
    const start = performance.now();

    function animate(now) {
      if (skipped) {
        finishBoot();
        return;
      }

      const elapsed = now - start;
      const progressAmount = Math.min(elapsed / duration, 1);

      // Smooth acceleration/deceleration
      const eased =
        progressAmount < 0.5
          ? 2 * progressAmount * progressAmount
          : 1 - Math.pow(-2 * progressAmount + 2, 2) / 2;

      const value = Math.round(current + (target - current) * eased);

      bar.style.width = value + "%";
      pct.textContent = value + "%";

      if (progressAmount < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    }

    requestAnimationFrame(animate);
  }

  function step() {
    if (skipped) {
      finishBoot();
      return;
    }

    if (i >= logLines.length) {
      // Final little pause before disappearing
      setTimeout(() => {
        if (!skipped) finishBoot();
      }, 1200);

      return;
    }

    const [text, type] = logLines[i];

    // Add the system message
    addLogLine(text, type);

    const targetProgress = progress[i];

    // Different speeds for different boot stages
    let animationTime;

    if (i === 0) {
      animationTime = 600;
    } else if (i === 3) {
      // Database takes longer
      animationTime = 1300;
    } else if (i === 6) {
      // Final stage shoots quickly
      animationTime = 450;
    } else {
      animationTime = 700;
    }

    animateProgress(targetProgress, animationTime, () => {
      // Pause after reaching this stage
      setTimeout(() => {
        i++;
        step();
      }, delays[i]);
    });
  }

  step();
}
window.addEventListener(
  "keydown",
  () => {
    if (!document.querySelector(".boot.hide")) {
      skipped = true;
      finishBoot();
    }
  },
  { once: true },
);
window.addEventListener(
  "click",
  () => {
    if (!document.querySelector(".boot.hide")) {
      skipped = true;
      finishBoot();
    }
  },
  { once: true },
);
runBoot();
function go(id) {
  // The gallery and the shell sit above the page, so close them first —
  // otherwise the navigation looks dead while the body stays scroll-locked.
  closeGallery();
  closeTerminal();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
function toast(m) {
  let t = document.getElementById("toast");
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}
function clock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString(
    "en-ZA",
    { hour12: false },
  );
}
clock();
setInterval(clock, 1000);
const modal = document.getElementById("termModal"),
  input = document.getElementById("termInput"),
  body = document.getElementById("termBody");
function openTerminal() {
  closeGallery();
  modal.classList.add("open");
  setTimeout(() => input.focus(), 100);
}
function closeTerminal() {
  modal.classList.remove("open");
}
const commands = {
  help: "help | about | projects | skills | contact | github | clear | date",
  about: "Phumudzo Manenzhe — BSc Computer Science student at Wits.",
  projects:
    "Olympiad Portal [group] | OportuNet [group] | RepoScope [solo] | AI Snake Agent [solo] | StokvelSA [in progress]",
  skills:
    "JavaScript, Python, Java, C++, C, SQL, HTML/CSS, React, Node.js, Express.js, Next.js, REST APIs, Git, Linux, databases, CI/CD.",
  contact: "manenzhephumudzo657@gmail.com | +27 68 313 9841",
  github: "https://github.com/PhumudzoManenzhe",
  date: () => new Date().toString(),
};
input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  let c = input.value.trim().toLowerCase();
  if (!c) return;
  let p = document.createElement("div");
  p.innerHTML =
    '<span style="color:var(--green)">guest@portfolio:~$</span> ' + c;
  body.insertBefore(p, input.parentElement);
  if (c === "clear") {
    body.innerHTML =
      '<div style="color:var(--green)">PORTFOLIO-OS shell cleared.</div>';
  } else {
    let r = document.createElement("div");
    r.style.color = "#8faea0";
    r.style.marginBottom = "8px";
    r.textContent = commands[c]
      ? typeof commands[c] === "function"
        ? commands[c]()
        : commands[c]
      : `command not found: ${c}`;
    body.insertBefore(r, input.parentElement);
  }
  input.value = "";
  body.scrollTop = body.scrollHeight;
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeTerminal();
});
/* ---------------------------------------------------------------------------
   Project case-study galleries
   Every screenshot below was captured from the project running for real.
   --------------------------------------------------------------------------- */
const PROJECT_GALLERIES = {
  olympiad: {
    title: "OLYMPIAD PORTAL",
    subtitle: "PROC_001 · group project · React · Express · Prisma · Supabase",
    repo: "https://github.com/PhumudzoManenzhe/OlympiadPortal",
    shots: [
      {
        src: "assets/showcase/projects/olympiad/01-organiser-dashboard.png",
        caption:
          "Organiser dashboard — round status, submission volume and the marking backlog, with a next action for every open round.",
      },
      {
        src: "assets/showcase/projects/olympiad/02-paper-review.png",
        caption:
          "Paper review — an educator's digitised paper has to be verified before the round can accept a sitting.",
      },
      {
        src: "assets/showcase/projects/olympiad/03-student-exam.png",
        caption:
          "Student sitting — a server-authoritative countdown, a question map, and per-sitting shuffled question and option order.",
      },
      {
        src: "assets/showcase/projects/olympiad/04-standings-released.png",
        caption:
          "Results released — auto-marked objective questions publish to students, and standings become the season's record.",
      },
    ],
  },
  oportunet: {
    title: "OPORTUNET",
    subtitle: "PROC_002 · group project · JavaScript · Firebase · Firestore",
    repo: "https://github.com/PhumudzoManenzhe/OportuNet",
    shots: [
      {
        src: "assets/showcase/projects/oportunet/01-applicant-dashboard.png",
        caption:
          "Applicant dashboard — live submission counts, one pending and one shortlisted, and a profile-strength score read from the applicant's own completion value.",
      },
      {
        src: "assets/showcase/projects/oportunet/02-applications.png",
        caption:
          "My applications — every submission with its current status and the next action available to the applicant.",
      },
      {
        src: "assets/showcase/projects/oportunet/03-edit-profile.png",
        caption:
          "Editable profile — education, qualifications, skills and projects are the inputs that drive profile strength.",
      },
      {
        src: "assets/showcase/projects/oportunet/04-recruiter-review.png",
        caption:
          "Recruiter review — the applicant's qualification sits beside the opportunity, and shortlist / accept / reject act in place.",
      },
    ],
  },
  reposcope: {
    title: "REPOSCOPE",
    subtitle: "PROC_003 · individual · Python · FastAPI · SQLite WAL",
    repo: "https://github.com/PhumudzoManenzhe/Repo-Analysis-Tool",
    shots: [
      {
        src: "assets/showcase/projects/reposcope/01-overview.png",
        caption:
          "Change profile — 177 commits, 272,786 lines added, 138,393 removed and 411,179 total churn for the selected commit set.",
      },
      {
        src: "assets/showcase/projects/reposcope/02-churn-ownership.png",
        caption:
          "Churn composition and ownership — contribution share measured by lines moved, not by commit count.",
      },
      {
        src: "assets/showcase/projects/reposcope/03-metric-table.png",
        caption:
          "Metric table — 2,852 rows across files, directories, authors and the repository root, sortable and searchable.",
      },
      {
        src: "assets/showcase/projects/reposcope/04-filters.png",
        caption:
          "Filtering — object type, path prefix, author, time window or an explicit commit list, all without re-reading Git.",
      },
    ],
  },
  snake: {
    title: "AI SNAKE AGENT",
    subtitle: "PROC_004 · individual · Java · A* search · game AI",
    repo: "https://github.com/PhumudzoManenzhe/AI-Snake-Agent-WITS-AI-competition-",
    shots: [
      {
        src: "assets/showcase/projects/snake/01-mid-game.png",
        caption:
          "Mid-game — the agent holds the centre of a 40×40 board while it controls open space against three opponents.",
      },
      {
        src: "assets/showcase/projects/snake/02-elimination.png",
        caption:
          "Elimination — head-collision prediction is decided a move ahead; the event feed records each death with its tick and cause.",
      },
      {
        src: "assets/showcase/projects/snake/03-final-standings.png",
        caption:
          "Final standings — length, apples and eliminations per snake, replayed from the match trace the agent produced.",
      },
    ],
  },
};
const galleryModal = document.getElementById("galleryModal"),
  galleryFrame = galleryModal
    ? galleryModal.querySelector(".gallery-frame")
    : null,
  galleryTitle = document.getElementById("galleryTitle"),
  gallerySub = document.getElementById("gallerySub"),
  galleryRepo = document.getElementById("galleryRepo"),
  galleryGrid = document.getElementById("galleryGrid");
function openGallery(slug) {
  const gallery = PROJECT_GALLERIES[slug];

  if (!gallery || !galleryModal) return;

  galleryTitle.textContent = gallery.title;
  gallerySub.textContent = gallery.subtitle;
  galleryRepo.href = gallery.repo;
  galleryGrid.textContent = "";

  gallery.shots.forEach((shot) => {
    const figure = document.createElement("figure"),
      link = document.createElement("a"),
      image = document.createElement("img"),
      caption = document.createElement("figcaption");

    // Clicking a shot opens the full-resolution capture in a new tab.
    link.href = shot.src;
    link.target = "_blank";
    link.rel = "noopener";
    image.src = shot.src;
    image.alt = shot.caption;
    image.loading = "lazy";
    caption.textContent = shot.caption;
    link.appendChild(image);
    figure.append(link, caption);
    galleryGrid.appendChild(figure);
  });

  galleryModal.classList.add("open");
  document.body.style.overflow = "hidden";

  if (galleryFrame) galleryFrame.scrollTop = 0;
}
function closeGallery() {
  if (!galleryModal) return;

  galleryModal.classList.remove("open");
  document.body.style.overflow = "";
}
galleryModal?.addEventListener("click", (e) => {
  if (e.target === galleryModal) closeGallery();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeGallery();
    closeTerminal();
    return;
  }

  // The gallery and the shell are modal: nothing else should react to keys.
  if (galleryModal?.classList.contains("open")) return;
  if (modal.classList.contains("open")) return;

  if (["1", "2", "3", "4"].includes(e.key))
    go(["about", "projects", "skills", "contact"][+e.key - 1]);
  if (e.key.toLowerCase() === "t") openTerminal();
});

/* ---------------------------------------------------------------------------
   /about story — the animations between the chapters
   --------------------------------------------------------------------------- */
const TYPED_LINES = [
  ["$ whoami", "term-cmd"],
  ["phumudzo · full-stack engineer · wits", ""],
  ["$ cat ./focus", "term-cmd"],
  ["frontend · backend · data · systems", ""],
  ["$ ./status --verbose", "term-cmd"],
  ["building · breaking · debugging · shipping", ""]
];

function buildPathGrid() {
  const grid = document.querySelector(".path-grid");
  if (!grid) return;

  const cols = 15;
  const rows = 7;
  const waypoints = [
    [3, 0],
    [3, 7],
    [1, 7],
    [1, 11],
    [5, 11],
    [5, 14]
  ];
  const route = [];
  const push = (row, col) => {
    const last = route[route.length - 1];
    if (!last || last[0] !== row || last[1] !== col) route.push([row, col]);
  };

  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const [fromRow, fromCol] = waypoints[i];
    const [toRow, toCol] = waypoints[i + 1];
    const steps = Math.abs(toRow - fromRow) + Math.abs(toCol - fromCol);

    for (let step = 0; step <= steps; step += 1) {
      const ratio = steps === 0 ? 0 : step / steps;
      push(
        Math.round(fromRow + (toRow - fromRow) * ratio),
        Math.round(fromCol + (toCol - fromCol) * ratio)
      );
    }
  }

  const order = new Map(route.map(([row, col], index) => [`${row}:${col}`, index]));
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cell = document.createElement("div");
      cell.className = "path-cell";
      const step = order.get(`${row}:${col}`);

      if (step === undefined) {
        // Deterministic scatter so the map looks like a real grid every reload.
        if ((row * 31 + col * 17) % 13 === 0) cell.classList.add("wall");
      } else {
        cell.classList.add("on");
        cell.style.setProperty("--d", step);
      }

      grid.appendChild(cell);
    }
  }
}

function typeInto(target, lines, reduceMotion) {
  if (!target) return;

  if (reduceMotion) {
    lines.forEach(([text, classes]) => {
      const line = document.createElement("div");
      line.className = `term-line ${classes || ""}`.trim();
      line.textContent = text;
      target.appendChild(line);
    });
    return;
  }

  let index = 0;
  let char = 0;
  let line = null;
  let hold = 0;

  setInterval(() => {
    // Only type while the panel is on screen.
    const panel = target.closest(".anim");
    if (panel && !panel.classList.contains("in")) return;
    if (hold > 0) {
      hold -= 1;
      return;
    }

    if (index >= lines.length) {
      // Keep the finished log readable for a moment, then replay it.
      hold = 110;
      index = 0;
      char = 0;
      line = null;
      target.textContent = "";
      return;
    }

    const [text, classes] = lines[index];

    if (!line) {
      line = document.createElement("div");
      line.className = `term-line active ${classes || ""}`.trim();
      target.appendChild(line);
      char = 0;
    }

    char += 1;
    line.textContent = text.slice(0, char);

    if (char >= text.length) {
      line.classList.remove("active");
      line = null;
      index += 1;
      hold = 16;
    }
  }, 26);
}

function watchStory() {
  const panels = Array.from(document.querySelectorAll(".anim"));
  if (!panels.length) return;

  if (!("IntersectionObserver" in window)) {
    panels.forEach((panel) => panel.classList.add("in"));
    return;
  }

  // Animations stay paused until their panel scrolls into view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  panels.forEach((panel) => observer.observe(panel));
}

function watchSections() {
  const items = Array.from(document.querySelectorAll(".side-item[data-target]"));
  if (!items.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        items.forEach((item) =>
          item.classList.toggle("active", item.dataset.target === entry.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  document.querySelectorAll(".section").forEach((section) => observer.observe(section));
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
buildPathGrid();
typeInto(document.querySelector(".anim-term"), TYPED_LINES, reduceMotion);
watchStory();
watchSections();
