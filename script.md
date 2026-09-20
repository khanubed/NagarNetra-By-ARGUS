# NAGARNETRA — 2-MINUTE FILM SCRIPT (v2, Problem-Statement-Aligned)
### "The City Is Already Watching"

**Format:** 16:9, 2:00 runtime · Same directorial world as v1 (THE STREET / THE SIGNAL / THE PRODUCT — see Director's Note below), rebuilt so **every line of the official problem statement has a visible, timestamped beat.** A judge re-reading the PS while watching this film should be able to tick off each requirement as it appears.

---

## REQUIREMENT → SCENE TRACEABILITY (check this before final cut)

| Problem statement line | Covered in | Timecode |
|---|---|---|
| Fixed CCTV, manual inspection, citizen complaints → delayed response | Scene 2 | 0:10–0:22 |
| Buses traverse almost every road, daily | Scene 3 | 0:22–0:32 |
| Multiple cameras — front, rear, side, cabin | Scene 4 open | 0:32–0:36 |
| Potholes, damaged roads | Scene 4 | 0:36–0:43 |
| Missing road dividers | Scene 4 | 0:36–0:43 |
| Missing zebra crossings | Scene 4 | 0:36–0:43 |
| Damaged/missing traffic signboards | Scene 4 | 0:36–0:43 |
| Waterlogging / other road hazards | Scene 4 | 0:36–0:43 |
| Vehicle detection, classification, counting → density | Scene 4b | 0:43–0:50 |
| Traffic bottleneck identification | Scene 4b | 0:43–0:50 |
| Vulnerable pedestrians — school children crossing | Scene 4c | 0:50–1:00 |
| Hit-and-run / rash driving — detect & track offending vehicle | Scene 5 | 1:00–1:18 |
| Registration number + confidence score + timestamp + GPS | Scene 5 | 1:00–1:18 |
| Secure alert to central command system | Scene 5 | 1:00–1:18 |
| Fleet-wide aggregation + GIS map visualization | Scene 6 | 1:18–1:30 |
| Congestion heat maps | Scene 6 | 1:18–1:30 |
| Infrastructure deficiency identification | Scene 6 | 1:18–1:30 |
| Origin–destination traffic pattern analysis | Scene 6 | 1:30–1:36 |
| Route delay estimation | Scene 6 | 1:30–1:36 |
| Actionable insights for transport authorities | Scene 7 | 1:36–1:48 |
| Bandwidth minimization via edge processing | Scene 4 (callback) + Scene 8 | 0:32–0:36, 1:48–1:56 |
| Proactive maintenance / improved traffic mgmt / public safety / evidence-based decisions | Scene 7 + Scene 9 | 1:36–2:00 |

*(USPs — Urban Risk Index™, Black Spot Intelligence, City Pulse™, SLA Engine — are compressed into Scene 7 as the "beyond the brief" differentiation beat, not the spine of the film. The PS is the spine this time; the USPs are the payoff.)*

---

## LEGEND

VIS = visual · VO = voiceover · TXT = on-screen text/UI · SFX = sound effect · MX = music

---

## SCENE-BY-SCENE SCRIPT

### SCENE 1 — COLD OPEN `[0:00–0:10]`

| | |
|---|---|
| **VIS** | Fast handheld fragments (0.6–1s each): wheel drops into a pothole → cracked road surface → a faded, barely-visible zebra crossing → rain pooling at a junction → a bent, unreadable signboard. No wide shots — stay inside the street. |
| **SFX** | Tyre splash, a short horn cut off, rain on glass |
| **MX** | Sub-bass drone, no melody |
| **Cut to black, 0.3s silence.** | |
| **TXT** (hard stamp) | **"India recorded 155,622 road deaths last year. Highest since 2014."** — small caption: *Source: NCRB* |
| **SFX** | Single low thud on impact |

---

### SCENE 2 — THE PROBLEM, AS WRITTEN `[0:10–0:22]`

| | |
|---|---|
| **VIS** | A fixed CCTV pole, camera slowly panning away from the actual road surface → a municipal inspector's clipboard, half-filled, dated months ago → a citizen complaint portal, spinning loader, no resolution |
| **VO** | *"Cities depend on fixed cameras that watch a handful of junctions. Inspections that happen once a season. Complaints that arrive after the damage is already done."* |
| **TXT** (small, corner) | *"Delayed response. Incomplete visibility. Reactive maintenance."* |
| **SFX** | Camera servo whir · paper shuffle · an unresolved loading tone trailing off |
| **MX** | Drone continues, slow pulse enters |

---

### SCENE 3 — THE TURN `[0:22–0:32]`

| | |
|---|---|
| **VIS** | Hard cut to a wide, slow, composed shot of a city bus — the first calm frame in the film. Street noise **cuts to near-silence.** |
| **VO** | *"But one fleet already covers almost every road in this city. Every day. Multiple times a day."* (beat) *"The public bus."* |
| **MX** | Drone resolves into a driving, rhythmic pulse — tone shift begins here |

---

### SCENE 4 — ONBOARD DETECTION, AS SPECIFIED `[0:32–1:00]`

*This scene exists to visually check off the PS's own defect list — treat it as a fast, confident tag-montage, not a slow explainer.*

**4a — Multi-camera + defect classes `[0:32–0:43]`**
| | |
|---|---|
| **VIS** | Quick match-cut: the bus's four camera positions flash as small labelled thumbnails (Front · Rear · Side · Cabin) assembling around the bus silhouette — then straight into a rapid-fire tag sequence, one clip per defect, each 1–1.2s, each with a live-feeling bounding box + label snapping onto the footage: **Pothole (91%)** → **Road Damage** → **Missing Divider** → **Missing Zebra Crossing** → **Damaged Signboard** → **Waterlogging** |
| **VO** | *"Front, rear, side, cabin — the cameras were already there. Now they read the road: potholes, damaged surfaces, missing dividers, faded crossings, broken signboards, waterlogging."* |
| **SFX** | A soft, distinct "detection tick" sound on every bounding-box snap — six ticks, evenly spaced, almost rhythmic with the music |

**4b — Vehicle density + bottlenecks `[0:43–0:50]`**
| | |
|---|---|
| **VIS** | Same street, now every vehicle gets a classification box (Car / Bus / Two-wheeler / Truck) as they're counted; cut to a top-down density overlay where the road glows from green to amber to red as vehicles accumulate at a junction |
| **VO** | *"Every vehicle, counted and classified. Every bottleneck, flagged before it becomes gridlock."* |
| **SFX** | A soft counter-tick accumulating rapidly, then a low warning tone as the overlay hits red |

**4c — Vulnerable pedestrians / school zones `[0:50–1:00]`**
| | |
|---|---|
| **VIS** | Tone softens: a school-zone geofence boundary glows faintly on the road ahead; a child steps toward a crossing; the detection box around them is a calmer blue, not an alert red — deliberately protective, not alarming |
| **VO** | *"And near a school gate, it watches differently — for a child stepping into traffic, not just a car passing through."* |
| **SFX** | Music softens here — pull back the pulse for 3–4 seconds |
| **MX** | Brief melodic, gentler motif — the one moment of warmth before the next scene's tension |

---

### SCENE 5 — THE INCIDENT: HIT-AND-RUN & EVIDENCE `[1:00–1:18]`

*This is the dramatic centerpiece — the PS asks for this explicitly (tracking, plate, confidence, timestamp, GPS, secure alert) and it is also the most cinematic beat available. Give it real space.*

| | |
|---|---|
| **VIS 1** | A vehicle swerves sharply and accelerates away — slightly desaturated, tense handheld framing, cut faster than surrounding scenes |
| **SFX** | Engine rev, tyre screech, a sharp intake of ambient noise |
| **VIS 2** | Hard cut to THE SIGNAL world: a tracking box locks onto the fleeing vehicle and **follows it** across two more quick-cut angles — the system doesn't lose it |
| **VO** | *"When a vehicle flees, the system doesn't just record it. It tracks it."* |
| **VIS 3** | Rapid zoom into the plate; an OCR scan-line sweeps across it once, left to right |
| **TXT** | **"KA 01 AB 1234 — Confidence: 94%"** ticks up digit by digit, not instantly |
| **SFX** | A precise mechanical scan sound, then a soft confirming beep on the confidence lock |
| **VIS 4** | Quick flash: a timestamp stamps on screen, then a GPS pin drops onto a dark mini-map |
| **TXT** | **"14:32:11 · 12.9716°N, 77.5946°E"** |
| **VIS 5** | A sealed, glowing packet icon transmits outward with a signal-wave ripple toward a small "Command Center" node |
| **VO** | *"Plate. Timestamp. Location. Sealed, and sent straight to command — before anyone has the chance to tamper with it."* |
| **SFX** | A firm transmission whoosh, then silence for half a beat |
| **MX** | Pulse intensifies through this scene, then drops out sharply on the transmission — let the silence land |

---

### SCENE 6 — THE CENTRALIZED PLATFORM `[1:18–1:36]`

| | |
|---|---|
| **VIS 1** | Cut wide: a dark, minimal GIS map of the city fills the frame; event pins scatter across it in real time as if the whole fleet is reporting simultaneously |
| **VO** | *"Every bus feeds one map."* |
| **VIS 2** | A congestion heatmap blooms outward from a junction, red at the core fading to amber at the edges |
| **TXT** | *"Congestion heat maps"* (small label, understated) |
| **VIS 3** | A cluster of defect pins pulses and merges into a single labelled marker — *"Infrastructure Deficiency — AB Road"* |
| **VO** | *"Where the road is failing. Where traffic is failing. All in one place."* |
| **VIS 4** | A curved, glowing line animates from one point on the map to another — an origin–destination flow trail — followed by a small bar-pair sliding in: **Scheduled 35 min / Actual 51 min** |
| **VO** | *"And how the city actually moves — where people are going, and how late they're getting there."* |
| **SFX** | Soft ambient map-ping sounds under VO1; a rising bloom sound on the heatmap; a clean "connect" tone on the OD line drawing |
| **MX** | Pulse steady, layering a second rhythmic element — building toward the next beat |

---

### SCENE 7 — BEYOND DETECTION: ACTIONABLE INSIGHT `[1:36–1:48]`

*Compressed callback to the USP system — three fast flashes, 3–4s each, not full treatments. This is where the film earns the right to say "we went further than the brief."*

| | |
|---|---|
| **VIS 1** | Six small factor-chips collide into a single glowing ward score |
| **TXT** | **"Ward 12 — Risk Score: 94"** |
| **VIS 2** | A thin pipeline ticks left to right: **Detect → Assign → Ticket → Escalate** |
| **VIS 3** | A circular gauge sweeps to a final number |
| **TXT** | **"City Pulse Score: 78/100"** |
| **VO** | *"A map tells you where the problem is. We built the part that gets it fixed — scored, assigned, and tracked, automatically."* |
| **SFX** | Three quick, distinct "snap" sounds, one per flash |
| **MX** | Peak energy of the film — fullest instrumentation here |

---

### SCENE 8 — IMPACT `[1:48–1:56]`

| | |
|---|---|
| **VIS** | Return to THE STREET world, but warmer, brighter — morning light, not the grey opening. A repair crew actually working a road. A child crossing safely at a clearly marked crossing. |
| **TXT** (silent flashes, 1s each) | **"90% less bandwidth."** → **"Minutes, not weeks."** → **"One dashboard. Whole city."** |
| **SFX** | Three clean impact ticks | |
| **MX** | Instruments pull out one at a time, heading toward resolution |

---

### SCENE 9 — CLOSE `[1:56–2:00]`

| | |
|---|---|
| **VIS** | Hard cut to black, then the bus from Scene 3 returns — same slow composed shot, now with a faint HUD overlay blending both visual worlds together for the only time in the film |
| **VO** | *"Every bus was already watching the road. Now, so is the city."* |
| **TXT** | **NAGARNETRA** wordmark, then small beneath: *"Smart India Hackathon · Problem Statement: Bharat Electronics Limited"* |
| **MX** | Resolves to a single sustained note, rings half a second past the logo, then silence |

---

## FULL VOICEOVER TRANSCRIPT

> *[Scene 2]* Cities depend on fixed cameras that watch a handful of junctions. Inspections that happen once a season. Complaints that arrive after the damage is already done.
>
> *[Scene 3]* But one fleet already covers almost every road in this city. Every day. Multiple times a day. *(beat)* The public bus.
>
> *[Scene 4a]* Front, rear, side, cabin — the cameras were already there. Now they read the road: potholes, damaged surfaces, missing dividers, faded crossings, broken signboards, waterlogging.
>
> *[Scene 4b]* Every vehicle, counted and classified. Every bottleneck, flagged before it becomes gridlock.
>
> *[Scene 4c]* And near a school gate, it watches differently — for a child stepping into traffic, not just a car passing through.
>
> *[Scene 5]* When a vehicle flees, the system doesn't just record it. It tracks it. Plate. Timestamp. Location. Sealed, and sent straight to command — before anyone has the chance to tamper with it.
>
> *[Scene 6]* Every bus feeds one map. Where the road is failing. Where traffic is failing. All in one place. And how the city actually moves — where people are going, and how late they're getting there.
>
> *[Scene 7]* A map tells you where the problem is. We built the part that gets it fixed — scored, assigned, and tracked, automatically.
>
> *[Scene 9]* Every bus was already watching the road. Now, so is the city.

**Word count: ~215 words.** Tighter pacing than v1 because this cut carries more required technical ground — keep delivery brisk and declarative in Scenes 4–6 (short clauses, hard stops), and only let the pace breathe in Scenes 3, 4c, and 9.

---

## WHAT CHANGED FROM V1, AND WHY

- **Scene 4 is new** — the previous cut never actually showed the specific defect classes, vehicle counting, or school-zone detection the PS names explicitly. A judge scoring against the PS text needs to see these, not infer them.
- **Scene 5 (hit-and-run/ANPR) is new** — this was the single biggest gap in v1. It's also arguably your best dramatic material: a vehicle fleeing, a lock-on track, a plate resolving under an OCR scan-line, a sealed evidence packet transmitting. Judges will remember this beat.
- **Scene 6 now explicitly shows heatmaps, infrastructure clustering, OD flow lines, and route delay** — all four were named in the PS and absent from v1.
- **The USP material (Urban Risk Index, City Pulse, SLA engine) is compressed from three full scenes to one fifteen-second beat.** It's now positioned as "we went beyond the brief" rather than the spine of the film — correct emphasis for a video whose job is to demonstrate PS compliance first and differentiation second.
- **Runtime discipline:** this version has less silence than v1 because there is more mandatory ground to cover in the same two minutes. If you have any flexibility on runtime, 2:20–2:30 would let Scenes 4 and 6 breathe slightly more — worth checking whether your submission portal enforces a hard 2:00 cap before locking the edit.

All Director's Note guidance from v1 (the two visual worlds, sound design discipline, screen-recording technique, music direction, shot sourcing table) still applies unchanged — this document only replaces the scene content, not the production approach.