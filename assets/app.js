(function () {
  var page = document.body.getAttribute("data-page");
  var $ = function (id) { return document.getElementById(id); };
  function val(id) { var e = $(id); return e ? e.value.trim() : ""; }
  function lc(s) { return (s || "").toLowerCase(); }
  function fullName(p) { return p.first + " " + p.last; }

  function matchPerson(p, q) {
    if (lc(p.last) !== lc(q.lastName)) return false;
    if (q.firstName && lc(p.first) !== lc(q.firstName)) return false;
    if (q.npi && p.npis.indexOf(q.npi) < 0) return false;
    return true;
  }
  var CFG = {
    license: {
      required: [["state", "State"], ["lastName", "Last name"]],
      find: function (q) {
        var hit = null;
        window.PEOPLE.forEach(function (p) {
          if (hit || !matchPerson(p, q)) return;
          if (lc(p.licenseState) !== lc(q.state)) return;
          if (q.licenseNumber && p.licenseNumbers.indexOf(q.licenseNumber) < 0) return;
          hit = { p: p, num: q.licenseNumber || p.licenseNumbers[0] };
        });
        return hit;
      },
      rows: function (h) {
        var p = h.p;
        return [["Name", p.licName || fullName(p)], ["Date of birth", p.licDob || p.dob], ["License number", h.num], ["License type", p.licenseType], ["State", p.licenseState],
          ["Status", p.licStatus], ["Issued", p.licIssued], ["Expires", p.licExpires], ["Disciplinary action", p.discipline]];
      }
    },
    board: {
      required: [["lastName", "Last name"]],
      find: function (q) { return one(function (p) { return matchPerson(p, q); }); },
      rows: function (h) {
        var p = h.p;
        return [["Name", fullName(p)], ["Specialty", p.boardSpecialty], ["Status", "Certified"], ["Initial certification", p.boardInitial], ["Expires", p.boardExpires], ["Maintenance of certification", "Meeting requirements"]];
      }
    },
    databank: {
      required: [["lastName", "Last name"], ["npi", "NPI"]],
      find: function (q) {
        return one(function (p) {
          if (!matchPerson(p, q)) return false;
          if (q.dob && q.dob !== p.dob) return false;
          return true;
        });
      },
      rows: function (h) {
        var p = h.p;
        return [["Query response — subject", fullName(p)], ["Reports found: " + p.reports.length, ""]];
      }
    },
    dea: {
      required: [["lastName", "Last name"]],
      find: function (q) { return one(function (p) { return matchPerson(p, q); }); },
      rows: function (h) {
        var p = h.p;
        return [["Name", fullName(p)], ["Registration", p.dea], ["Schedules", "2, 2N, 3, 3N, 4, 5"], ["Status", "Active"], ["Expires", p.deaExpires]];
      }
    },
    npi: {
      required: [["npi", "NPI"]],
      find: function (q) {
        var hit = null;
        window.PEOPLE.forEach(function (p) {
          if (hit || p.npis.indexOf(q.npi) < 0) return;
          if (q.lastName && lc(p.last) !== lc(q.lastName)) return;
          hit = { p: p, npi: q.npi };
        });
        return hit;
      },
      rows: function (h) {
        var p = h.p;
        return [["NPI", h.npi], ["Name", fullName(p)], ["Credential", p.degree], ["Taxonomy", p.specialty], ["Status", "Active"], ["Enumerated", p.enumerated[h.npi]]];
      }
    }
  };
  function one(fn) {
    var hit = null;
    window.PEOPLE.forEach(function (p) { if (!hit && fn(p)) hit = { p: p }; });
    return hit;
  }
  function line(h) {
    var p = h.p, kv;
    if (page === "license") kv = [["name", p.licName || fullName(p)], ["dob", p.licDob || p.dob], ["licenseNumber", h.num], ["licenseType", p.licenseType], ["state", p.licenseState], ["status", p.licStatus], ["issued", p.licIssued], ["expires", p.licExpires], ["discipline", p.discipline]];
    else if (page === "board") kv = [["name", fullName(p)], ["specialty", p.boardSpecialty], ["status", "Certified"], ["initialCertification", p.boardInitial], ["expires", p.boardExpires], ["moc", "Meeting requirements"]];
    else if (page === "databank") {
      kv = [["name", fullName(p)], ["reports", String(p.reports.length)]];
      if (p.reports.length) kv.push(["summary", p.reports.map(function (r) { return r.type + " " + r.eventDate + ", " + r.payment + ", " + r.allegation + "; reported by " + r.entity; }).join(" | ").replace(/;/g, ",")]);
    } else if (page === "dea") kv = [["name", fullName(p)], ["registration", p.dea], ["schedules", "2, 2N, 3, 3N, 4, 5"], ["status", "Active"], ["expires", p.deaExpires]];
    else kv = [["npi", h.npi], ["name", fullName(p)], ["credential", p.degree], ["taxonomy", p.specialty], ["status", "Active"], ["enumerated", p.enumerated[h.npi]]];
    return "result=found; " + kv.map(function (x) { return x[0] + "=" + x[1]; }).join("; ");
  }
  function pill(s) { var c = s === "Expired" ? "bad" : "ok"; return '<span id="record-status" class="pill ' + c + '">' + s + "</span>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hex8() { var s = ""; for (var i = 0; i < 8; i++) s += Math.floor(Math.random() * 16).toString(16); return s.toUpperCase(); }

  function render(h) {
    var cfg = CFG[page];
    $("result-count").textContent = h ? "1 record found" : "No records found matching your criteria";
    var html = "";
    if (h) {
      var rows = cfg.rows(h);
      html = '<table id="record-table">' + rows.map(function (r) {
        var v = esc(r[1]);
        if (r[0] === "Status") v = pill(r[1]);
        return "<tr><th>" + esc(r[0]) + "</th><td>" + v + "</td></tr>";
      }).join("") + "</table>";
      if (page === "databank" && h.p.reports.length) {
        html += '<div class="cap">Reports</div><table class="grid" id="reports-table"><tr><th>Report type</th><th>Event date</th><th>Payment</th><th>Allegation</th><th>Reporting entity</th></tr>' +
          h.p.reports.map(function (r) { return "<tr><td>" + esc(r.type) + "</td><td>" + r.eventDate + "</td><td>" + esc(r.payment) + "</td><td>" + esc(r.allegation) + "</td><td>" + esc(r.entity) + "</td></tr>"; }).join("") + "</table>";
      }
    }
    $("record-wrap").innerHTML = html;
    $("record-line").textContent = h ? line(h) : "result=none";
    $("query-ref").textContent = "Q-" + hex8();
    $("searched-at").textContent = new Date().toLocaleString();
  }

  if (!CFG[page]) return;
  var form = $("search-form");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var cfg = CFG[page], q = {}, err = $("form-error");
    ["state", "lastName", "firstName", "licenseNumber", "npi", "dob"].forEach(function (k) { if ($(k)) q[k] = val(k); });
    var missing = cfg.required.filter(function (f) { return !q[f[0]]; }).map(function (f) { return f[1]; });
    if (missing.length) { err.textContent = "Required: " + missing.join(", ") + "."; $("results").style.display = "none"; return; }
    err.textContent = "";
    $("results").style.display = "none";
    $("searching").style.display = "block";
    setTimeout(function () {
      $("searching").style.display = "none";
      render(cfg.find(q));
      $("results").style.display = "block";
    }, 700);
  });
  if (typeof module !== "undefined") module.exports = { CFG: CFG };
})();
