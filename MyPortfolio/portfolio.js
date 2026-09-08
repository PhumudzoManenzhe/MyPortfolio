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

    // Start About typing
    typeAboutSection();
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
  modal.classList.add("open");
  setTimeout(() => input.focus(), 100);
}
function closeTerminal() {
  modal.classList.remove("open");
}
const commands = {
  help: "help | about | projects | skills | contact | github | clear | date",
  about: "Phumudzo Manenzhe — BSc Computer Science student at Wits.",
  projects: "Opportunet | StokvelSA | AI Snake Agent",
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
document.addEventListener("keydown", (e) => {
  if (["1", "2", "3", "4"].includes(e.key) && !modal.classList.contains("open"))
    go(["about", "projects", "skills", "contact"][+e.key - 1]);
  if (e.key.toLowerCase() === "t") openTerminal();
  if (e.key === "Escape") closeTerminal();
});
