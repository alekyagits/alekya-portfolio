# alekya-portfolio

My personal portfolio website: an elegant, responsive single page built with plain
HTML, CSS and JavaScript (no frameworks). It has light and dark themes, works on
phones, and can be used with the keyboard alone. It is also my most recent project.

**Preview locally** (from the `HTML projects` folder):

```bash
node .claude/scripts/serve.mjs alekya-portfolio 5503
```

Then open http://localhost:5503.

---

## Step-by-step plan

Every `STEP N` comment in the code points to the step below that touches it.

### Step 1 — Plan the content (done ✅)
A recruiter spends about 30 seconds on a portfolio. With a Master's (Dec 2024) and no
job experience yet, the page leads with **projects and skills**, not job history:

| Section | Its job |
|---|---|
| Hero | Your name, the role you want, "Open to work", and a resume button |
| About | Your story in 3 short paragraphs: degree → why web dev → what you're doing now |
| Skills | Only skills you can explain in an interview |
| Projects | **The most important section.** It proves you can build things |
| Education | Your degrees, plus "2025 – Present: self-directed learning" to cover the gap since graduating |
| Contact | Email, LinkedIn, GitHub, resume |

### Step 2 — Build the structure (done ✅)
`index.html` uses semantic HTML: `header`, `nav`, `main`, `section`, `footer`.

### Step 3 — Design (done ✅)
`style.css`: ivory and ink with a muted gold accent, a serif display font (Cormorant
Garamond) paired with Inter for body text, and lots of white space. To change the
look, edit the `:root` variables at the top. `script.js` handles the dark mode,
the mobile menu, the scroll animations and the active nav link.

### Step 4 — Make it yours (mostly done ✅)
- [x] Degrees, university, location and skills (from the resume)
- [x] Experience: Research Assistant at KSU
- [x] Projects: Blockchain Voting, Intrusion Detection, Managing Traffic System
- [x] Publication and certifications
- [x] LinkedIn and GitHub links
- [x] Contact form instead of a public email. Messages reach your inbox through Formspree, and your address never appears on the site
- [x] No public resume download. Recruiters pick "Resume request" in the form and you reply with your PDF
- [ ] Paste your Formspree form URL into `data-endpoint` on `<form id="contact-form">` in `index.html`
- [ ] Check that the LinkedIn link opens your profile
- [ ] `asserts/profile.jpg`: your photo
- [ ] Read the About text and adjust it so it sounds like you

> Privacy: `.gitignore` blocks every `*.pdf`, so a resume with your phone number or email can't be pushed by accident.

### Step 5 — Link your real projects
For each project card, replace the `#` links with:
- the **GitHub repo** link (push each practice project to GitHub first), and
- a **live demo** link (deploy each one, see Step 7).

Projects with a live demo get clicked far more often than code-only links.

### Step 6 — Put it on GitHub
```bash
cd alekya-portfolio
```
```bash
git init -b main
```
```bash
git add .
```
```bash
git commit -m "Initial portfolio"
```
Then create a repo called `alekya-portfolio` on GitHub and push to it (Claude Code can
do this for you through the GitHub connection in this workspace if you ask).

### Step 7 — Deploy it (free)
Choose **one**:
- **GitHub Pages:** Repo → Settings → Pages → Branch `main` / root. Your URL will be `https://<username>.github.io/alekya-portfolio/`
- **Vercel / Netlify:** import the repo and click deploy. This gives you a cleaner URL, and you can add a custom domain later (for example `alekya.dev`, about $10/year)

### Step 8 — Polish and test
- [ ] Open it on your phone
- [ ] Use only the Tab key: can you reach every link?
- [ ] Run Chrome DevTools → **Lighthouse** and aim for 90+ in every category
- [ ] Ask a friend to read it for 30 seconds, then ask them what you do

### Step 9 — Use it in your job search
- Add the link to your **resume header**, **LinkedIn** (Featured section + Contact info),
  **GitHub profile README**, and email signature
- Mention it in applications: *"You can see my recent work at …"*
- Write a LinkedIn post about building it. That shows initiative and skill with AI tools
- Keep it alive: add every new project you build. A portfolio updated in 2026 tells
  recruiters that you are actively improving

### Step 10 — Grow it (later)
- A small **contact form** (Formspree, no backend needed)
- A **blog / notes** section about what you're learning
- Rebuild it in **React** as a learning exercise, and list that as another project
