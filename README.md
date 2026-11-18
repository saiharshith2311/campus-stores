# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, bundled offline libraries, and icons and can run completely offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`:

```sh
python -m http.server 8000 --directory campus-stores --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

---

## Product Engineering Improvements & Fixes

### 1. Shift Workflow Gating & Actionable Checklist
- **Problem**: Shifts previously advanced unconditionally without completing necessary work. An operator could jump directly from pickup to Saturday morning without loaning anything, leading to a broken narrative asking to return an unloaned adapter.
- **Solution**:
  - **Living Banner Checklist**: Displays live status pills for each required action (e.g. `[✓/○] HDMI Projector`, `[✓/○] Portable Speaker`, `[✓/○] USB-C Adapter`).
  - **Workflow Gates**:
    - **Pickup → Return**: Prevents advancing until all 3 Film Society kit items are issued to Kabir.
    - **Return → Morning**: Requires the projector and speaker to be checked in and a handover note logged in the Desk Book.
    - **Saturday Morning**: Summarizes the outstanding adapter with Leela Das and confirms completion once returned.

### 2. Multi-Item Kit Checkout ("Express Checkout")
- **Problem**: Issuing multi-piece equipment kits required repeatedly creating single slips one by one, picking request, borrower, and due dates each time.
- **Solution**:
  - Added **Express Kit Checkout (⚡)** directly in the Request view: checks inventory availability across all approved items and issues the entire bundle in one click while creating individual internal slips (`L-402`, `L-403`, `L-404`) to preserve data integrity.
  - In the manual "New Issue Slip" form: selecting a request dynamically filters the equipment dropdown to only approved matching hardware, and auto-derives the return due date.

### 3. UX, Accessibility & Architecture Fixes
- **Button Sizing & Text Fitting**: Removed conflicting CDN preflight resets; provided generous button padding (`9px 20px`), proper height (`38px`), `white-space: nowrap`, and rounded corners so text is never clipped.
- **Single Full-Bleed Canvas**: Removed the redundant outer white card container, outer shadows, and body margins. The interface seamlessly fills the viewport on a clean `#ffffff` canvas.
- **Color Palette**: Eliminated all violet/purple tones in favor of an Apple Blue (`#0071e3`) and neutral slate hierarchy.
- **Confirmation on Reset**: Added confirmation dialog to "Restart sample shift" to prevent accidental data loss.
- **Focus Management**: Automatically moves keyboard focus to updated records and status announcements after actions.
- **Accessible Tabs**: Implemented true ARIA tab semantics (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`).
- **Empty States**: Replaced bare text with helpful empty states offering clear next actions.
- **Data Validation**: Thoroughly validates `who`, `due`, `back`, `num`, `req`, and `asset` in `restore()`.
- **Typography**: Integrated `Inter` and `Archivo` web fonts alongside native system font fallbacks.

---

## Candidate Brief Responses

### 1. Moment Handled Well
* **Frictionless Register Segregation & Verification**: The separation between approved requests, physical hardware inventory, and loan slips prevents accidental checkouts of unauthorized hardware types or double-loaning of the same physical unit.

### 2. Moment to Change & Proposed Prototype
* **The Problem**: Issuing a multi-piece kit (e.g., `RQ-214` Film Society requiring 3 items: Projector, Speaker, Adapter) previously required manually filing 3 separate issue slips one by one, picking student names and dates repeatedly while a line formed at the counter.
* **The Solution**: Implemented **Express Kit Checkout (⚡)** in the Request details view. With 1 click, the system verifies available units on shelf for each approved item type and issues the entire bundle directly to the collector.
* **Counter Observation / Metric to Measure Success**:
  - *Counter Queue Time / Issue Latency*: Average seconds taken at the counter to issue a multi-item kit (expected reduction from ~60s down to <5s).
  - *Missing Adapter Rates*: Reduction in unreturned peripheral cables and adapters during morning shift handovers.

---

## Source

- `index.html` contains the full-bleed desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records, workflow gating, express checkout, real-time search, toast notifications, and shift interactions.
- `styles.css` defines the modern Apple-inspired design system with zero violet.
- `third-party/` contains local copies of `lucide.min.js`, `tailwind.js`, and license notices.

---

## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL (`https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`).
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Enter your **roll number**, **email ID**, and **final commit link**.
