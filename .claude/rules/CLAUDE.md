# Staff Engineer Interview Prep - Project Guidelines

## Project Overview

This is an interactive GitHub Pages site for staff engineer interview preparation, covering seven domains:
1. **Coding Rounds** - Algorithms, data structures, problem-solving patterns
2. **System Design** - Scalability, distributed systems, architectural patterns
3. **Low-Level Design** - OOP principles, design patterns, object-oriented design problems
4. **Company-Specific** - Interview processes for top tech companies
5. **Behavioral** - STAR method, leadership stories, communication
6. **Generative AI Engineering** - LLMs, RAG, Agents, and Production AI Systems
7. **Metrics & Tradeoffs** - Measuring success, cost efficiency, critical thinking, business impact

**Live Site**: Served from repository root via GitHub Pages

## Current Project Structure

```
/ (repository root - GitHub Pages served from here)
├── index.html                 # Main landing page
├── assets/
│   ├── css/style.css         # Global styles (includes sidebar CSS)
│   └── js/app.js             # Collapsible sections, Mermaid init
├── coding-rounds/
│   ├── index.html            # Course overview (9 modules)
│   └── module-01.html - module-09.html
├── system-design/
│   ├── index.html            # Course overview with left sidebar
│   ├── module-01.html - module-12.html  # Core modules
│   ├── problems/             # Detailed problem breakdowns
│   │   ├── url-shortener.html
│   │   ├── news-feed.html
│   │   ├── chat-system.html
│   │   └── video-streaming.html
│   └── papers/               # Seminal paper deep dives
│       ├── gfs.html          # Google File System
│       ├── bigtable.html     # Google BigTable
│       ├── dynamo.html       # Amazon Dynamo
│       ├── memcache.html     # Facebook Memcache
│       ├── mapreduce.html    # Google MapReduce
│       ├── kafka.html        # Apache Kafka
│       ├── spanner.html      # Google Spanner
│       ├── flink.html        # Apache Flink (stream processing)
│       └── flashblade.html   # Pure Storage FlashBlade
├── low-level-design/
│   ├── index.html            # Course overview (12 modules + problems)
│   ├── module-01.html        # Design Principles (SOLID, DRY, KISS)
│   ├── module-02.html        # Creational Patterns
│   ├── module-03.html        # Structural Patterns
│   ├── module-04.html        # Behavioral Patterns
│   ├── module-05.html        # UML & Class Diagrams
│   ├── module-06.html        # Interview Delivery Framework
│   ├── module-07.html        # Concurrency Patterns
│   ├── module-08.html        # Code Quality & Refactoring
│   ├── module-09.html        # Testing & TDD
│   ├── module-10.html        # Advanced OOP Concepts
│   ├── module-11.html        # Real-World Architecture
│   ├── module-12.html        # Mock Interviews
│   └── problems/             # Classic LLD problems
│       ├── parking-lot.html
│       ├── elevator-system.html
│       ├── vending-machine.html
│       ├── library-system.html
│       ├── chess-game.html
│       └── amazon-locker.html
├── company-specific/
│   ├── index.html            # Course overview (6 modules)
│   └── module-01.html - module-06.html
├── behavioral/
│   ├── index.html            # Course overview (6 modules)
│   └── module-01.html - module-06.html
├── generative-ai/
│   ├── index.html            # Course overview (16 modules)
│   └── module-01.html - module-16.html
├── metrics-tradeoffs/
│   ├── index.html            # Course overview (15 modules)
│   └── module-01.html - module-15.html
```

## Technology Stack

- **Framework**: Vanilla HTML/CSS/JS (no build step required)
- **Diagrams**: Mermaid.js (loaded via CDN)
- **Styling**: Custom CSS with CSS variables for theming

## Key Features

### 1. Left Sidebar Navigation (HelloInterview-style)
- Sticky sidebar on desktop (280px width)
- Collapsible on mobile with toggle button
- Organized by category sections

### 2. Interactive Components
- **Collapsibles**: Expandable content sections
- **Clickable Cards**: All cards must link to relevant modules/resources

### 3. Visual Learning
- Mermaid diagrams for architecture, flowcharts, sequences
- Comparison tables for trade-offs
- Code blocks with syntax highlighting

## Content Quality Requirements (CRITICAL)

### Depth Standards
Every module MUST include:

1. **Conceptual Foundation** (not just bullet points)
   - Explain WHY, not just WHAT
   - Include the reasoning behind design decisions
   - Discuss trade-offs in depth

2. **Real-World Examples**
   - How Netflix/Google/Amazon implements this
   - Actual numbers and scale (e.g., "Twitter handles 500M tweets/day")
   - Case studies of failures and successes

3. **Code Samples** (where applicable)
   - Working code snippets, not pseudocode
   - Multiple language examples (Python, Java, Go)
   - Comments explaining key decisions

4. **Visual Diagrams**
   - Architecture diagrams using Mermaid
   - Sequence diagrams for complex flows
   - Comparison tables for trade-offs

5. **Interview Tips**
   - Common follow-up questions
   - What interviewers look for
   - Red flags to avoid

6. **Deep Dive Sections**
   - Advanced topics for senior candidates
   - Edge cases and failure scenarios
   - Performance optimization techniques

### Content Anti-Patterns (AVOID)
- ❌ Superficial bullet point lists without explanation
- ❌ Cards/sections without clickable links
- ❌ Generic descriptions without specific examples
- ❌ Missing "why" behind concepts
- ❌ No code samples in technical modules
- ❌ Placeholder or empty sections

### Clickable Elements
- ALL cards in card-grid MUST link to relevant content
- Use `onclick="window.location.href='...'"` or wrap in `<a>` tags
- Never have non-functional UI elements

## Style Guidelines

### CSS Classes
```css
.layout-with-sidebar    /* Flex container for sidebar + content */
.sidebar               /* Left navigation sidebar */
.sidebar-link          /* Navigation links */
.sidebar-link.active   /* Currently active page */
.main-content          /* Main content area (max-width: 900px) */
.main-content-wide     /* Full-width main content */
.collapsible           /* Expandable section */
.collapsible.open      /* Expanded state */
.card                  /* Content card - MUST be clickable */
.card-grid             /* Grid of cards */
.diagram-container     /* Mermaid diagram wrapper */
.code-block            /* Code snippet */
```

### Displaying Code Blocks (Markdown & HTML)

- **Markdown pages:** Use fenced code blocks with a language hint so syntax highlighters work. Example:

```markdown
```html
<div class="example">Hello</div>
```
```

- **Raw HTML pages:** Wrap code in a `<pre><code>` block and HTML-escape special characters (`<`, `>`, `&`) so the browser renders the code instead of interpreting it. Example:

```html
<pre><code class="language-html">&lt;div class="example"&gt;Hello&lt;/div&gt;</code></pre>
```

- **Avoid executing code:** If inserting snippets via `<script>` or templates, ensure they are treated as text (e.g., `text/template`) or inserted via `textContent`/`innerText` so they are not executed.

- **Syntax highlighting:** Include a client-side highlighter (Prism.js, highlight.js) and style `.code-block` to make snippets readable.


### Card Template (Clickable)
```html
<div class="card" onclick="window.location.href='module-01.html'" style="cursor: pointer;">
    <h3>Card Title</h3>
    <p>Description of what this covers</p>
</div>
```

### Interactivity & Animations

- **Make content interactive:** Wherever it aids understanding, include interactive examples (live, step-through, or adjustable demos). Examples: collapsible walkthroughs, small runnable code panes, sliders to change input sizes, or embedded sandboxes (CodePen/Gist/StackBlitz) for larger snippets.

- **Use animations to teach flows:** Animations and micro-interactions can make complex concepts tangible — e.g., animating request flows, buffer fill/drain, or stepwise state machines. Prefer declarative approaches (CSS transitions, SVG animations, Lottie) and keep sequences short and focused.

- **Accessibility & user preferences:** Respect `prefers-reduced-motion` and provide controls to pause/step animations. Ensure interactive controls are keyboard accessible and use semantic HTML + ARIA where needed.

- **Performance considerations:** Avoid layout-thrashing animations; animate `transform` and `opacity` where possible. Throttle expensive updates and provide static snapshots as a fallback for low-end devices.

- **Progressive enhancement & fallbacks:** Ensure content remains understandable without JS. Provide static images or textual step descriptions when dynamic content cannot run.

- **Styling & classes:** Tag interactive pieces with `.interactive` and animated elements with `.animated` so authors can target them for styles and `prefers-reduced-motion` rules.

- **Short examples:**

Collapsible (CSS + JS):

```html
<button class="collapsible-toggle" aria-expanded="false">Show details</button>
<div class="collapsible-panel" hidden>
    <p>Step-by-step explanation...</p>
</div>

<style>
.collapsible-panel { transition: max-height 300ms ease; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .collapsible-panel { transition: none; } }
</style>

<script>
document.querySelectorAll('.collapsible-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        if (open) panel.setAttribute('hidden', ''); else panel.removeAttribute('hidden');
    });
});
</script>
```

- **Libraries:** For richer interaction/animation consider lightweight libraries only when necessary (e.g., Lottie for vector animations, anime.js for sequences, or small widgets). Document third-party dependencies in the module.


## Adding New Content

## Retention & Learning Aids

- **Spaced repetition:** Provide optional flashcard exports (CSV/Anki) or a simple built-in scheduler to surface high-value cards over time. Encourage creating 1–2 concise Q/A cards per key concept rather than verbatim notes.

- **Active recall & self-testing:** Include short module-end quizzes, in-line quick checks, and coding practice problems that force retrieval rather than passive review.

- **Interleaving & varied practice:** Mix related problem types and concepts across modules (e.g., different caching strategies, then compare their trade-offs) to strengthen transfer and discrimination.

- **Summarization & teach-back:** Ask authors to provide a 2–3 sentence "tl;dr" and a "How I'd teach this" paragraph. Encourage learners to write their own one-paragraph summary after reading.

- **Project-based checkpoints:** Provide mini-projects or guided exercises with progressive milestones to turn passive knowledge into applied skill.

- **Note-linking & progressive elaboration:** Recommend linking notes across modules (Zettelkasten style) and updating notes when deeper understanding emerges.

- **Multimodal reinforcement:** Combine diagrams, animated walkthroughs, code snippets, and short quizzes to support different memory systems.

- **Practical suggestions for authors:**
    - Add a short quiz (3–6 questions) at the end of each module.
    - Supply 5 suggested flashcard Q/A pairs for conversion to Anki or CSV.
    - Add one practical exercise or mini-project with a sample solution and test cases.

- **Human factors:** Recommend spaced study sessions, sleep between reviews, and short focused sessions (25–50 minutes) with active practice.


### Module Page Structure
```html
<main class="main-content">
    <h1>Module Title</h1>

    <!-- Learning objectives -->
    <div class="card">
        <h3>What You'll Learn</h3>
        <ul>...</ul>
    </div>

    <!-- Core content with depth -->
    <h2>Topic 1</h2>
    <div class="collapsible open">
        <div class="collapsible-header">
            <span>Detailed Explanation</span>
        </div>
        <div class="collapsible-content">
            <!-- In-depth explanation with WHY -->
            <!-- Real-world examples -->
            <!-- Code samples -->
            <!-- Diagrams -->
        </div>
    </div>

    <!-- More topics... -->

    <!-- Navigation -->
    <div class="flex flex-between mt-4">
        <a href="previous.html" class="btn btn-secondary">← Previous</a>
        <a href="next.html" class="btn btn-primary">Next →</a>
    </div>
</main>
```

## Testing Checklist

Before committing:
- [ ] All pages return HTTP 200
- [ ] All cards are clickable and navigate correctly
- [ ] Mermaid diagrams render correctly
- [ ] Collapsibles expand/collapse
- [ ] Sidebar navigation works on mobile
- [ ] No empty or placeholder sections
- [ ] Content has sufficient depth (not just bullet points)
- [ ] Check browser console for JavaScript errors

## Content References

### Authoritative Resources
- System Design: https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction
- DDIA Book: Designing Data-Intensive Applications by Martin Kleppmann
- System Design Primer: https://github.com/donnemartin/system-design-primer
- Company interviews: https://www.levels.fyi/, https://www.glassdoor.com/

## Git Workflow

1. Test locally with `python -m http.server 8080`
2. Verify all pages load and cards are clickable
3. Check browser console for JavaScript errors
4. Commit with descriptive message
5. Push to main branch (GitHub Pages auto-deploys)
