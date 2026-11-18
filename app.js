(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);

  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
      collector: "Kabir Sen",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
      collector: "Tara Shah",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
      collector: "Dev Menon",
    },
  ];

  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];

  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];

  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time →",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning →",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];

  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];

  const original = () => ({
    version: 1,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    searchQuery: "",
    selectedReqInForm: "RQ-214",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    activityLog: [
      { time: "Friday · 3:30 pm", text: "Tara Shah checked out MI-09 (Wireless microphone) for Debate Union (Slip L-401)." }
    ],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift initialized · Ready at the desk.",
  });

  let s = original();

  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);

  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");

  const btn = (label, act, val = "", style = "", id = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '"' +
    (id ? ' id="' + esc(id) + '"' : "") +
    ">" +
    esc(label) +
    "</button>";

  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";

  const row = (label, sub, right, iconBadge = "", rowId = "") =>
    '<div class="row"' +
    (rowId ? ' id="' + esc(rowId) + '" tabindex="-1"' : "") +
    ">" +
    '<div class="row-left">' +
    (iconBadge ? '<div class="row-icon-box">' + iconBadge + "</div>" : "") +
    '<div class="row-text"><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div></div><div>" +
    right +
    "</div></div>";

  const badge = (t, type = "default") => {
    let cls = "tag";
    let dotColor = "";
    if (type === "good" || type === "On shelf" || type === "Returned") {
      cls += " good";
      dotColor = "#057a55";
    } else if (type === "On loan") {
      cls += " tag-on-loan";
      dotColor = "#0071e3";
    } else if (type === "In repair") {
      cls += " tag-repair";
      dotColor = "#dc2626";
    } else if (type === "club") {
      cls += " tag-club";
    }

    const dot = dotColor
      ? '<span style="width:6px;height:6px;border-radius:50%;background-color:' +
        dotColor +
        ';display:inline-block;margin-right:2px;flex-shrink:0;"></span>'
      : "";

    return '<span class="' + cls + '">' + dot + esc(t) + "</span>";
  };

  function showToast(message, isWarning = false) {
    const container = document.getElementById("toast-container");
    if (!container || !message) return;
    const toast = document.createElement("div");
    toast.className = "toast" + (isWarning ? " toast-warn" : "");
    const icon = isWarning
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    toast.innerHTML = icon + "<span>" + esc(message) + "</span>";
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // --- Workflow Gating Evaluation ---
  function getShiftWorkflowStatus() {
    // Film Society request items: Projector, Speaker, Adapter
    const filmReq = getReq("RQ-214");
    const filmLoans = s.loans.filter((l) => l.req === "RQ-214");

    const filmProjectorLoan = filmLoans.find((l) => getAsset(l.asset)?.type === "HDMI projector");
    const filmSpeakerLoan = filmLoans.find((l) => getAsset(l.asset)?.type === "Portable speaker");
    const filmAdapterLoan = filmLoans.find((l) => getAsset(l.asset)?.type === "USB-C → HDMI adapter");

    const projectorIssued = !!filmProjectorLoan;
    const speakerIssued = !!filmSpeakerLoan;
    const adapterIssued = !!filmAdapterLoan;
    const allIssued = projectorIssued && speakerIssued && adapterIssued;

    const projectorReturned = filmProjectorLoan ? filmProjectorLoan.back : false;
    const speakerReturned = filmSpeakerLoan ? filmSpeakerLoan.back : false;
    const adapterReturned = filmAdapterLoan ? filmAdapterLoan.back : false;
    const phase1NoteLogged = s.notes.some((n) => n.phase >= 1);

    return {
      phase: s.phase,
      projectorLoan: filmProjectorLoan,
      speakerLoan: filmSpeakerLoan,
      adapterLoan: filmAdapterLoan,
      projectorIssued,
      speakerIssued,
      adapterIssued,
      allIssued,
      projectorReturned,
      speakerReturned,
      adapterReturned,
      phase1NoteLogged,
      // Phase 0 gate: must issue all 3 items to advance to return time
      phase0Ready: allIssued,
      // Phase 1 gate: projector & speaker must be returned and note logged
      phase1Ready: projectorReturned && speakerReturned && phase1NoteLogged,
      // Phase 2: complete when adapter is returned
      phase2Complete: adapterReturned,
    };
  }

  function renderShiftWorkflowChecklist() {
    const status = getShiftWorkflowStatus();
    let html = "";
    let hint = "";
    const advanceBtn = q('[data-action="advance"]');

    if (s.phase === 0) {
      // Phase 0 checklist
      const itemBadge = (label, done) =>
        '<span class="workflow-check-pill' +
        (done ? " done" : " pending") +
        '">' +
        (done ? "✓ " : "○ ") +
        esc(label) +
        "</span>";

      html =
        '<div class="workflow-checklist-inner">' +
        '<span class="workflow-checklist-label">Required for Friday Pickup:</span>' +
        '<div class="workflow-check-group">' +
        itemBadge("HDMI Projector", status.projectorIssued) +
        itemBadge("Portable Speaker", status.speakerIssued) +
        itemBadge("USB-C Adapter", status.adapterIssued) +
        "</div>" +
        "</div>";

      if (status.phase0Ready) {
        hint = '<span class="hint-ready">✓ All kit items issued to Kabir. Ready to advance to return time.</span>';
        if (advanceBtn) advanceBtn.classList.remove("btn-disabled");
      } else {
        const remaining = [
          !status.projectorIssued && "Projector",
          !status.speakerIssued && "Speaker",
          !status.adapterIssued && "Adapter",
        ]
          .filter(Boolean)
          .join(", ");
        hint =
          '<span class="hint-pending">⚠️ Issue remaining kit items (' +
          esc(remaining) +
          ") before moving to return time.</span>";
        if (advanceBtn) advanceBtn.classList.add("btn-disabled");
      }
    } else if (s.phase === 1) {
      // Phase 1 checklist
      const itemBadge = (label, done) =>
        '<span class="workflow-check-pill' +
        (done ? " done" : " pending") +
        '">' +
        (done ? "✓ " : "○ ") +
        esc(label) +
        "</span>";

      html =
        '<div class="workflow-checklist-inner">' +
        '<span class="workflow-checklist-label">Required for Return &amp; Handover:</span>' +
        '<div class="workflow-check-group">' +
        itemBadge("Check in Projector", status.projectorReturned) +
        itemBadge("Check in Speaker", status.speakerReturned) +
        itemBadge("Post Handover Note", status.phase1NoteLogged) +
        "</div>" +
        "</div>";

      if (status.phase1Ready) {
        hint = '<span class="hint-ready">✓ Projector &amp; speaker checked in; note logged. Ready for morning shift.</span>';
        if (advanceBtn) advanceBtn.classList.remove("btn-disabled");
      } else {
        const missing = [
          !status.projectorReturned && "Projector return",
          !status.speakerReturned && "Speaker return",
          !status.phase1NoteLogged && "Handover note in Desk Book",
        ]
          .filter(Boolean)
          .join(", ");
        hint =
          '<span class="hint-pending">⚠️ Complete outstanding return steps (' +
          esc(missing) +
          ") to advance.</span>";
        if (advanceBtn) advanceBtn.classList.add("btn-disabled");
      }
    } else if (s.phase === 2) {
      // Phase 2 summary & closing
      if (status.adapterReturned) {
        html =
          '<div class="workflow-checklist-inner">' +
          '<span class="workflow-check-pill done">✓ Shift Complete · All Film Society equipment returned</span>' +
          "</div>";
        hint = '<span class="hint-ready">✓ Everything has been reconciled and returned to stock. Well done!</span>';
        if (advanceBtn) advanceBtn.hidden = true;
      } else {
        const adapterSlipNum = status.adapterLoan ? "L-" + status.adapterLoan.num : "L-404";
        html =
          '<div class="workflow-checklist-inner">' +
          '<span class="workflow-checklist-label">Awaiting Return:</span>' +
          '<span class="workflow-check-pill pending" style="cursor:pointer;" data-action="return" data-val="' + (status.adapterLoan?.num || 404) + '">○ Close Slip ' +
          adapterSlipNum +
          " (USB-C Adapter from Leela Das) &nbsp;<b>Click to Return</b></span>" +
          "</div>";
        hint = '<span class="hint-pending">Leela is at the desk with the adapter. Close Slip ' + adapterSlipNum + ' in the Loan register to finish the shift.</span>';
        if (advanceBtn) {
          advanceBtn.hidden = false;
          advanceBtn.classList.remove("btn-disabled");
          advanceBtn.textContent = "✓ Complete Shift";
          advanceBtn.dataset.action = "return";
          advanceBtn.dataset.val = String(status.adapterLoan?.num || 404);
        }
      }
    }

    const checklistEl = q("[data-shift-checklist]");
    if (checklistEl) checklistEl.innerHTML = html;
    const hintEl = q("[data-shift-hint]");
    if (hintEl) hintEl.innerHTML = hint;
  }

  // --- Register 1: Requests ---
  function requestPage() {
    let html = head(
      "Approved Requests",
      "Student Activities Office · 3 verified club event reservations",
    );

    if (s.selected) {
      const r = getReq(s.selected);
      const itemStatus = r.items.map((itemType) => {
        const availableUnit = assets.find(
          (a) => a.type === itemType && !a.repair && !out(a.id),
        );
        const loanedUnit = s.loans.find(
          (l) => l.req === r.id && !l.back && getAsset(l.asset)?.type === itemType,
        );
        return { type: itemType, availableUnit, loanedUnit };
      });

      const canQuickIssue = itemStatus.some((x) => x.availableUnit && !x.loanedUnit);

      html +=
        '<div style="margin-bottom:14px;">' +
        btn("← Back to all requests", "close", "", "btn-restart-top") +
        "</div>" +
        '<div class="record"><small>' +
        r.id +
        " · Verified Reservation</small><h3>" +
        r.event +
        "</h3><p>" +
        badge(r.club, "club") +
        " &nbsp;Filed by <strong>" +
        esc(r.owner) +
        "</strong> · Scheduled Return by <strong>" +
        esc(r.due) +
        "</strong></p>" +
        "<p><b>Approved Equipment Checklist:</b></p><ul>" +
        itemStatus
          .map((item) => {
            if (item.loanedUnit) {
              return (
                "<li>" +
                esc(item.type) +
                " &mdash; " +
                badge("Issued (Slip L-" + item.loanedUnit.num + ")", "On loan") +
                "</li>"
              );
            } else if (item.availableUnit) {
              return (
                "<li>" +
                esc(item.type) +
                " &mdash; " +
                badge("Available: " + item.availableUnit.id + " (" + item.availableUnit.bin + ")", "On shelf") +
                "</li>"
              );
            } else {
              return (
                "<li>" +
                esc(item.type) +
                " &mdash; " +
                badge("Unavailable in inventory", "In repair") +
                "</li>"
              );
            }
          })
          .join("") +
        "</ul><p style='background:#ffffff;padding:10px 14px;border-radius:8px;border:1px solid var(--border-light);'><strong>Organizer Note:</strong> " +
        esc(r.note) +
        "</p></div>";

      // Enhanced Kit Issue Form: Streamlined Multi-Item Checkout
      if (canQuickIssue) {
        html +=
          '<div class="quick-kit-banner">' +
          '<div class="quick-kit-info">' +
          '<span class="quick-kit-title">⚡ Express Kit Checkout</span>' +
          '<span class="quick-kit-desc">Issue all remaining approved equipment units to the counter collector in 1 click. Creates individual tracking slips.</span>' +
          "</div>" +
          btn("Review & Issue Complete Kit", "quick_issue", r.id, "primary") +
          "</div>";
      }

      return html;
    }

    html += requests
      .map((r) => {
        const itemPills = r.items
          .map((i) => '<span class="tag" style="margin-right:4px;">' + esc(i) + "</span>")
          .join("");
        return (
          '<div class="row">' +
          '<div class="row-left">' +
          '<div class="row-icon-box">📋</div>' +
          '<div class="row-text">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap;">' +
          badge(r.club, "club") +
          "<strong>" +
          esc(r.event) +
          "</strong>" +
          "</div>" +
          "<small>" +
          r.id +
          " · Filed by " +
          esc(r.owner) +
          " · Return by " +
          esc(r.due) +
          "</small>" +
          '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">' +
          itemPills +
          "</div>" +
          "</div></div>" +
          "<div>" +
          btn("Review & Issue", "request", r.id, "primary") +
          "</div>" +
          "</div>"
        );
      })
      .join("");
    return html;
  }

  // --- Register 2: Inventory ---
  function inventory() {
    let html = head(
      "Hardware Inventory",
      "Physical units · Shelf location and real-time operational status",
    );

    // Search bar
    html +=
      '<div class="search-wrapper">' +
      '<svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input type="text" class="search-input" data-search placeholder="Search equipment by model, tag, type, or shelf bin..." value="' +
      esc(s.searchQuery || "") +
      '" />' +
      "</div>";

    const filterCounts = {
      "All items": assets.length,
      "On shelf": assets.filter((a) => !a.repair && !out(a.id)).length,
      "On loan": assets.filter((a) => !a.repair && out(a.id)).length,
      "In repair": assets.filter((a) => a.repair).length,
    };

    html +=
      '<div class="buttons">' +
      Object.keys(filterCounts)
        .map(
          (f) =>
            '<button type="button" data-action="filter" data-val="' +
            f +
            '" aria-pressed="' +
            (s.filter === f) +
            '">' +
            f +
            " (" +
            filterCounts[f] +
            ")</button>",
        )
        .join("") +
      "</div>";

    const query = (s.searchQuery || "").toLowerCase();
    let matchedCount = 0;

    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";

      if (s.filter !== "All items" && s.filter !== status) continue;

      if (
        query &&
        !a.id.toLowerCase().includes(query) &&
        !a.type.toLowerCase().includes(query) &&
        !a.model.toLowerCase().includes(query) &&
        !a.bin.toLowerCase().includes(query)
      ) {
        continue;
      }

      matchedCount++;
      const currentLoan = out(a.id);
      const subInfo =
        a.model +
        " · Shelf Bin " +
        a.bin +
        (currentLoan
          ? " · Held by " + currentLoan.who + " (Slip L-" + currentLoan.num + ")"
          : "");

      const icon = a.type.includes("projector")
        ? "📽️"
        : a.type.includes("speaker")
          ? "🔊"
          : a.type.includes("adapter")
            ? "🔌"
            : a.type.includes("camera")
              ? "📷"
              : "🎤";

      html += row(
        a.id + " · " + a.type,
        subInfo,
        badge(status, status),
        icon,
      );
    }

    if (matchedCount === 0) {
      html += '<p style="color:var(--quiet);padding:24px 0;text-align:center;">No hardware units match your search query.</p>';
    }

    return html;
  }

  // --- Register 3: Loan Register ---
  function register() {
    let html = head(
      "Loan Register",
      "Individual issue slips · Active custody and historical returns",
      s.editing
        ? btn("Cancel", "cancel", "", "btn-restart-top")
        : btn("+ Issue New Slip", "new", "", "primary"),
    );

    if (s.editing) {
      const selectedReqObj = getReq(s.selectedReqInForm) || requests[0];
      // Filter available units to ONLY those approved for this request
      const approvedTypes = selectedReqObj.items;
      const matchingAvailableAssets = assets.filter(
        (a) => !a.repair && !out(a.id) && approvedTypes.includes(a.type),
      );

      const select = (label, key, options, extraAttrs = "") =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" ' +
        extraAttrs +
        ' required><option value="">Select option…</option>' +
        opts(options) +
        "</select></label>";

      return (
        html +
        '<form data-issue class="issue-slip-card"><div class="form">' +
        select(
          "1. Approved Request",
          "req",
          requests.map((r) => [
            r.id,
            r.id + " · " + r.club + " (" + r.event + ")",
          ]),
          'data-action="form-req-change"',
        ) +
        select(
          "2. Unit Leaving Desk (Filtered to Approved Types)",
          "asset",
          matchingAvailableAssets.map((a) => [
            a.id,
            a.id + " · " + a.type + " (" + a.model + " - Bin " + a.bin + ")",
          ]),
        ) +
        select(
          "3. Collected by (Student)",
          "who",
          people.map((p) => [p, p]),
        ) +
        '<label><span>4. Return Due Time (Auto-derived)</span><input type="text" name="due" value="' +
        esc(selectedReqObj.due) +
        '" readonly style="background:#f8fafc;font-weight:600;" /></label>' +
        '</div><div style="display:flex;gap:10px;margin-top:14px;"><button type="submit" class="primary">Save &amp; Issue Slip</button>' +
        btn("Cancel", "cancel", "", "btn-restart-top") +
        "</div></form>"
      );
    }

    const outstandingCount = s.loans.filter((l) => !l.back).length;
    html +=
      '<div class="buttons">' +
      [
        ["Outstanding (" + outstandingCount + ")", "0"],
        ["All Slips (" + s.loans.length + ")", "1"],
      ]
        .map(
          ([label, val], i) =>
            '<button type="button" data-action="scope" data-val="' +
            val +
            '" aria-pressed="' +
            (s.onlyOpen === (val === "0")) +
            '">' +
            label +
            "</button>",
        )
        .join("") +
      "</div>";

    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();

    // Group active loans by request for Kit-Level overview & partial return
    const activeFilmLoans = s.loans.filter((l) => l.req === "RQ-214" && !l.back);
    const filmTotal = s.loans.filter((l) => l.req === "RQ-214");
    if (filmTotal.length > 0) {
      const activeCount = activeFilmLoans.length;
      const returnedCount = filmTotal.length - activeCount;
      html +=
        '<div class="quick-kit-banner" style="margin-bottom:16px;">' +
        '<div class="quick-kit-info">' +
        '<span class="quick-kit-title">📦 Film Society Screening Kit (RQ-214)</span>' +
        '<span class="quick-kit-desc">' +
        returnedCount + " of " + filmTotal.length + " items returned · " +
        (activeCount > 0 ? activeCount + " items still on loan" : "Kit fully reconciled") +
        "</span>" +
        "</div>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        (activeCount > 0
          ? btn("✓ Partial Return: Projector + Speaker", "partial_return_screening", "RQ-214", "primary") +
            (activeFilmLoans.some((l) => getAsset(l.asset)?.type.includes("adapter"))
              ? btn("✓ Return Adapter (Slip L-" + (activeFilmLoans.find((l) => getAsset(l.asset)?.type.includes("adapter"))?.num || "404") + ")", "return", String(activeFilmLoans.find((l) => getAsset(l.asset)?.type.includes("adapter"))?.num), "btn-restart-top")
              : "")
          : '<span class="workflow-check-pill done">✓ Complete Kit Returned</span>') +
        "</div>" +
        "</div>";
    }

    if (!shown.length) {
      html +=
        '<div class="empty-state">' +
        "<p><strong>No outstanding slips.</strong> All checked-out hardware is currently returned to stock.</p>" +
        '<div style="display:flex;gap:10px;margin-top:12px;">' +
        btn("View All Slips History", "scope", "1") +
        btn("+ Issue New Slip", "new", "", "primary") +
        "</div>" +
        "</div>";
      return html;
    }

    for (const l of shown) {
      const assetObj = getAsset(l.asset);
      const reqObj = getReq(l.req);
      const icon = assetObj?.type.includes("projector")
        ? "📽️"
        : assetObj?.type.includes("speaker")
          ? "🔊"
          : assetObj?.type.includes("adapter")
            ? "🔌"
            : assetObj?.type.includes("camera")
              ? "📷"
              : "🎤";

      const details =
        (reqObj?.club || l.req) +
        " · Issued to " +
        l.who +
        " · Due " +
        l.due +
        " (" +
        (assetObj?.model || "") +
        ")";

      html += row(
        "Slip L-" + l.num + " · " + l.asset + " (" + (assetObj?.type || "") + ")",
        details,
        l.back
          ? badge("Returned", "Returned")
          : btn("✓ Record Return", "return", String(l.num), "primary"),
        icon,
        "loan-row-" + l.num,
      );
    }

    return html;
  }

  // --- Register 4: Desk Book ---
  function deskbook() {
    let html = head(
      "Desk Book &amp; Counter Log",
      "Messages from student clubs, authorization records, and shift handovers",
    );

    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
        "club",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
        "club",
      ],
    ];

    if (s.phase >= 1) {
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
        "club",
      ]);
    }

    for (const n of s.notes) {
      entries.push([shifts[n.phase].time, "Shift Handover Note", n.text, "internal"]);
    }

    for (const [t, author, body, kind] of entries.slice().reverse()) {
      const isInternal = kind === "internal";
      html +=
        '<article class="record" style="' +
        (isInternal
          ? "border-left-color:#10b981;background:#f0fdf4;"
          : "border-left-color:#1f2937;background:#f9fafb;") +
        '"><small>' +
        esc(t) +
        " &nbsp;•&nbsp; " +
        (isInternal ? "Internal Desk Handover" : "Club Authorization") +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    }

    // Handover Auto-Summary Generator Recommendation
    const wf = getShiftWorkflowStatus();
    let suggestedNote = "";
    if (s.phase === 1) {
      if (wf.projectorReturned && wf.speakerReturned && !wf.adapterReturned) {
        suggestedNote = "Kabir returned the projector & portable speaker at 7:30 pm. Adapter remains out with Leela Das (due 9:00 am Saturday).";
      } else if (!wf.adapterReturned) {
        suggestedNote = "Screening concluded. Film Society equipment return in progress. Note Leela Das has USB-C adapter.";
      }
    } else if (s.phase === 2 && !wf.adapterReturned) {
      suggestedNote = "Morning handover: Awaiting Slip L-404 return from Leela Das (USB-C -> HDMI adapter).";
    }

    html +=
      '<form data-note style="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px;">' +
      '<strong style="font-size:13.5px;color:var(--ink);">Log Shift Handover Note</strong>' +
      (suggestedNote
        ? '<button type="button" class="btn-restart-top" data-action="auto-summary" style="font-size:12px;padding:5px 12px;min-height:30px;">⚡ Auto-generate Handover Summary</button>'
        : '') +
      '</div>' +
      '<div class="form" style="margin-top:6px;">' +
      '<label class="full">' +
      '<textarea name="note" id="handover-note-input" rows="2" maxlength="400" placeholder="e.g. Note pending returns, equipment status, or agreements with borrowers..." required>' +
      esc(suggestedNote) +
      '</textarea>' +
      "</label></div>" +
      '<button type="submit" class="primary">+ Post Handover Note</button>' +
      "</form>";

    // Activity Timeline (Audit trail of counter events)
    if (s.activityLog && s.activityLog.length > 0) {
      html +=
        '<div style="margin-top:24px;border-top:1px solid var(--border-light);padding-top:18px;">' +
        '<strong style="font-size:13.5px;display:flex;align-items:center;gap:6px;margin-bottom:12px;color:var(--ink);">' +
        '<span>🕒 Shift Activity Timeline</span>' +
        '</strong>' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
        s.activityLog.slice().reverse().map((act) =>
          '<div class="row" style="padding:10px 14px;margin-bottom:4px;cursor:default;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span class="badge-pill" style="font-size:10.5px;padding:2px 8px;background:#f3f4f6;border-color:#d1d5db;color:#374151;">' + esc(act.time) + '</span>' +
          '<span style="font-size:12.5px;color:var(--ink);">' + esc(act.text) + '</span>' +
          '</div></div>'
        ).join("") +
        '</div></div>';
    }

    return html;
  }

  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };

  function updateStepper() {
    for (let i = 0; i < 3; i++) {
      const pill = document.getElementById("stage-" + i);
      if (!pill) continue;
      pill.classList.remove("active", "completed");
      if (i < s.phase) {
        pill.classList.add("completed");
      } else if (i === s.phase) {
        pill.classList.add("active");
      }
    }
  }

  function updateQuickStats() {
    const onShelf = assets.filter((a) => !a.repair && !out(a.id)).length;
    const onLoan = s.loans.filter((l) => !l.back).length;
    const inRepair = assets.filter((a) => a.repair).length;

    const elAvail = document.getElementById("stat-available");
    const elLoan = document.getElementById("stat-loaned");
    const elRepair = document.getElementById("stat-repair");

    if (elAvail) elAvail.textContent = onShelf;
    if (elLoan) elLoan.textContent = onLoan;
    if (elRepair) elRepair.textContent = inRepair;
  }

  function paint() {
    const phase = shifts[s.phase];
    const clockEl = q("[data-clock]");
    if (clockEl) clockEl.textContent = phase.time;

    const titleEl = q("[data-shift-title]");
    if (titleEl) titleEl.textContent = phase.title;

    const shiftTextEl = q("[data-shift]");
    if (shiftTextEl) shiftTextEl.textContent = phase.text;

    const advance = q('[data-action="advance"]');
    if (advance) {
      advance.hidden = !phase.next;
      advance.textContent = phase.next || "";
    }

    updateStepper();
    renderShiftWorkflowChecklist();
    updateQuickStats();

    // Nav tabs with real accessible tab semantics
    const navEl = q("[data-nav]");
    if (navEl) {
      const loanCount = s.loans.filter((l) => !l.back).length;
      const counts = {
        Requests: requests.length,
        Inventory: assets.length,
        "Loan register": loanCount ? loanCount + " open" : "0",
        "Desk book": 2 + (s.phase >= 1 ? 1 : 0) + s.notes.length,
      };

      navEl.innerHTML = pages
        .map(([n, icon]) => {
          const isPressed = s.tab === n;
          const tabId = "tab-" + n.toLowerCase().replace(/\s+/g, "-");
          return (
            '<button type="button" role="tab" id="' +
            tabId +
            '" aria-selected="' +
            isPressed +
            '" aria-controls="page-panel" tabindex="' +
            (isPressed ? "0" : "-1") +
            '" data-action="tab" data-val="' +
            n +
            '">' +
            '<svg aria-hidden="true" class="store-icon"><use href="#icon-' +
            icon +
            '"></use></svg>' +
            "<span>" +
            n +
            "</span>" +
            '<span class="nav-count-badge">' +
            counts[n] +
            "</span>" +
            "</button>"
          );
        })
        .join("");
    }

    const pageEl = q("[data-page]");
    if (pageEl) {
      pageEl.innerHTML = screens[s.tab]();
      const activeTabId = "tab-" + s.tab.toLowerCase().replace(/\s+/g, "-");
      pageEl.setAttribute("aria-labelledby", activeTabId);
    }

    const statusEl = q("[data-status]");
    if (statusEl) {
      statusEl.textContent = s.notice;
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function commit(msg, focusTargetId = "") {
    if (msg) {
      s.notice = msg;
      showToast(msg);
    }
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      const statusEl = q("[data-status]");
      if (statusEl) {
        statusEl.textContent += " Storage unavailable; shift state is in-memory.";
      }
    }

    // Accessible Focus Management
    if (focusTargetId) {
      setTimeout(() => {
        const target = document.getElementById(focusTargetId);
        if (target) {
          target.focus();
        } else {
          const statusEl = q("[data-status]");
          if (statusEl) statusEl.focus();
        }
      }, 50);
    }
  }

  // --- Change Event Delegation ---
  root.addEventListener("change", (e) => {
    // Dynamic Form Filtering: Filter available unit dropdown to selected request's approved items
    if (e.target.matches('[data-action="form-req-change"]')) {
      s.selectedReqInForm = e.target.value;
      const pageEl = q("[data-page]");
      if (pageEl && s.tab === "Loan register") {
        pageEl.innerHTML = screens["Loan register"]();
        const reqSelect = q('select[name="req"]');
        if (reqSelect) reqSelect.value = s.selectedReqInForm;
      }
    }
  });

  // --- Click Event Delegation ---
  root.addEventListener("click", (e) => {
    // Backdrop click to close candidate brief modal
    if (e.target.id === "brief-backdrop") {
      e.target.hidden = true;
      return;
    }

    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;

    switch (b.dataset.action) {
      case "brief": {
        const modal = document.getElementById("brief-backdrop");
        if (modal) modal.hidden = !modal.hidden;
        break;
      }

      case "close-brief": {
        const modal = document.getElementById("brief-backdrop");
        if (modal) modal.hidden = true;
        break;
      }

      case "restart":
        if (
          !window.confirm(
            "Restart sample shift? This will reset all active loans, notes, and shift progress back to Friday afternoon.",
          )
        ) {
          return;
        }
        s = original();
        commit("Sample shift restarted · Records restored.");
        break;

      case "advance": {
        const wf = getShiftWorkflowStatus();

        // Gating Check: Phase 0
        if (s.phase === 0) {
          if (!wf.phase0Ready) {
            showToast(
              "Cannot advance shift: Kabir still needs the full kit. Issue the projector, speaker, and adapter first.",
              true,
            );
            return;
          }
          s.phase = 1;
          commit(
            "Advanced shift time to Friday 7:30 pm. Film screening has ended.",
          );
          return;
        }

        // Gating Check: Phase 1
        if (s.phase === 1) {
          if (!wf.phase1Ready) {
            const missing = [
              !wf.projectorReturned && "projector return",
              !wf.speakerReturned && "speaker return",
              !wf.phase1NoteLogged && "handover note in Desk Book",
            ]
              .filter(Boolean)
              .join(", ");
            showToast(
              "Cannot advance shift: Please complete " +
                missing +
                " before leaving for the night.",
              true,
            );
            return;
          }
          s.phase = 2;
          commit(
            "Advanced shift time to Saturday 9:00 am. Morning handover begun.",
          );
          return;
        }
        break;
      }

      case "tab":
        s.tab = v;
        s.editing = false;
        commit();
        break;

      case "close":
        s.selected = "";
        commit();
        break;

      case "request":
        s.selected = v;
        commit();
        break;

      case "new":
        s.editing = true;
        commit();
        break;

      case "cancel":
        s.editing = false;
        commit();
        break;

      case "scope":
        s.onlyOpen = v === "0";
        commit();
        break;

      case "filter":
        s.filter = v;
        commit();
        break;

      case "auto-summary": {
        const wf = getShiftWorkflowStatus();
        let note = "Kabir returned the projector & portable speaker at 7:30 pm. Adapter remains out with Leela Das (due 9:00 am Saturday).";
        if (s.phase === 2) {
          note = "Morning handover: Awaiting Slip L-404 return from Leela Das (USB-C -> HDMI adapter).";
        }
        const input = document.getElementById("handover-note-input");
        if (input) {
          input.value = note;
          input.focus();
        }
        break;
      }

      case "partial_return_screening": {
        const wf = getShiftWorkflowStatus();
        let returnedNames = [];
        if (wf.projectorLoan && !wf.projectorLoan.back) {
          wf.projectorLoan.back = true;
          returnedNames.push(wf.projectorLoan.asset + " (Projector)");
        }
        if (wf.speakerLoan && !wf.speakerLoan.back) {
          wf.speakerLoan.back = true;
          returnedNames.push(wf.speakerLoan.asset + " (Speaker)");
        }
        if (returnedNames.length > 0) {
          if (!s.activityLog) s.activityLog = [];
          s.activityLog.push({
            time: shifts[s.phase].time,
            text: "Partial return recorded: " + returnedNames.join(" and ") + " checked in by Kabir. Adapter remains with Leela Das.",
          });
          commit("Partial return logged: " + returnedNames.join(" & ") + " checked in to stock.");
        } else {
          showToast("Projector and speaker are already checked in.", true);
        }
        break;
      }

      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        if (!s.activityLog) s.activityLog = [];
        s.activityLog.push({
          time: shifts[s.phase].time,
          text: l.who + " returned " + l.asset + " (" + (getAsset(l.asset)?.type || "") + "). Slip L-" + l.num + " closed.",
        });
        commit(
          l.asset + " returned to stock. Slip L-" + l.num + " closed.",
          "loan-row-" + l.num,
        );
        break;
      }

      // Multi-Item Express Kit Checkout (1-click kit issue)
      case "quick_issue": {
        const r = getReq(v);
        if (!r) return;
        const collector = r.collector || "Kabir Sen";
        let issuedSlips = [];
        let firstSlipNum = null;

        r.items.forEach((itemType) => {
          const alreadyOut = s.loans.some(
            (l) => l.req === r.id && !l.back && getAsset(l.asset)?.type === itemType,
          );
          if (alreadyOut) return;

          const unit = assets.find(
            (a) => a.type === itemType && !a.repair && !out(a.id),
          );
          if (unit) {
            const nextNum = Math.max(...s.loans.map((l) => l.num)) + 1;
            if (!firstSlipNum) firstSlipNum = nextNum;
            s.loans.push({
              num: nextNum,
              req: r.id,
              asset: unit.id,
              who: collector,
              due: r.due,
              back: false,
            });
            issuedSlips.push(unit.id + " (" + unit.type + ")");
          }
        });

        if (issuedSlips.length > 0) {
          if (!s.activityLog) s.activityLog = [];
          s.activityLog.push({
            time: shifts[s.phase].time,
            text: "Express Kit Issued: " + issuedSlips.join(", ") + " to " + collector + " for " + r.club + ".",
          });
          s.tab = "Loan register";
          commit(
            "Issued complete kit [" +
              issuedSlips.join(", ") +
              "] to " +
              collector +
              " for " +
              r.club +
              ".",
            "loan-row-" + firstSlipNum,
          );
        } else {
          showToast("All items for this request are already issued or unavailable.", true);
        }
        break;
      }
    }
  });

  // --- Realtime Input Delegation (Search) ---
  root.addEventListener("input", (e) => {
    if (e.target.matches("[data-search]")) {
      s.searchQuery = e.target.value;
      const pageEl = q("[data-page]");
      if (pageEl && s.tab === "Inventory") {
        pageEl.innerHTML = screens["Inventory"]();
        const searchInput = q("[data-search]");
        if (searchInput) {
          searchInput.focus();
          searchInput.setSelectionRange(
            searchInput.value.length,
            searchInput.value.length,
          );
        }
      }
    }
  });

  // --- Form Submissions ---
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);

    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      if (!s.activityLog) s.activityLog = [];
      s.activityLog.push({
        time: shifts[s.phase].time,
        text: "Handover note posted: \"" + (text.length > 60 ? text.substring(0, 60) + "..." : text) + "\"",
      });
      commit("Handover note added for " + shifts[s.phase].time + ".");
      return;
    }

    if (!f.matches("[data-issue]")) return;
    const [req, asset, who] = ["req", "asset", "who"].map((k) => form.get(k));
    const r = getReq(req);
    const unit = getAsset(asset);
    const due = r ? r.due : String(form.get("due") || "Fri 8 pm");

    if (!r || !unit || unit.repair || out(asset) || !people.includes(who)) {
      showToast("Invalid equipment or collector selection.", true);
      return;
    }

    if (!r.items.includes(unit.type)) {
      showToast(
        "Equipment type is outside approved request for " + r.club + ".",
        true,
      );
      return;
    }

    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      showToast(
        "The approved quantity of this type is already on loan.",
        true,
      );
      return;
    }

    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    if (!s.activityLog) s.activityLog = [];
    s.activityLog.push({
      time: shifts[s.phase].time,
      text: who + " checked out " + asset + " (" + unit.type + ") for " + r.club + " (Slip L-" + num + ").",
    });
    s.editing = false;
    commit(
      "Issued " + asset + " to " + who + " on slip L-" + num + ".",
      "loan-row-" + num,
    );
  });

  // --- State Restoration & Thorough Validation ---
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l &&
          typeof l.num === "number" &&
          l.num > 0 &&
          typeof l.who === "string" &&
          l.who.trim().length > 0 &&
          typeof l.due === "string" &&
          l.due.trim().length > 0 &&
          typeof l.back === "boolean" &&
          getReq(l.req) &&
          getAsset(l.asset),
      )
    ) {
      return;
    }
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("brief-backdrop");
      if (modal && !modal.hidden) modal.hidden = true;
    }
  });

  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep clean initial shift
  }
})();
