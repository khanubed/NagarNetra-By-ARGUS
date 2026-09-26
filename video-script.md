# NagarNetra - 2:30 Minute Pitch & Walkthrough Script (Version 1)

**Target Duration:** ~2:30 Minutes (approx. 350 - 400 words)
**Tone:** Urgent, authoritative, visionary, and heavily focused on governance and accountability.

---

### [0:00 - 0:40] The Problem & The Edge Network
**(Visuals: B-roll of severe traffic, massive potholes, hit-and-run news. Cut to a BMTC Bus with a camera overlay. Quick flash of Edge AI bounding boxes and 99.9% bandwidth reduction metric.)**

**Speaker:**
"Every year, India loses over 150,000 lives to road accidents. Authorities are blinded by incomplete data—relying on static CCTVs and slow, reactive manual surveys. 

**NagarNetra** changes this by transforming existing public transport fleets, like BMTC buses, into a continuous, mobile urban-sensing network. Edge AI on the bus detects road defects, traffic density, and safety incidents. But detection isn't enough. The real breakthrough of NagarNetra is how we use that data to enforce municipal accountability through our two core platforms: The Authority Dashboard and the Public Portal."

### [0:40 - 1:35] The Authority Dashboard (Solving the Triage & Accountability Problem)
**(Visuals: Screen recording of the Authority Dashboard. Show the main dashboard KPI cards. Pan to the Black Spots Map, then the Department Performance SLA tables. Briefly show the restricted Road Crimes section with ANPR evidence.)**

**Speaker:**
"For city officials, the **Authority Dashboard** acts as the ultimate governance engine. A major problem today is that thousands of scattered complaints overwhelm departments. NagarNetra solves this with the **Black Spot Intelligence Engine**. It spatially clusters recurring detections into ranked, high-risk road segments with clear causal profiles. 

Instead of manual triage, our Governance Engine automatically routes tickets to the correct department—like PWD or Drainage—and starts a strict SLA timer. If an issue isn't resolved in time, it automatically escalates up the chain of command. 

We also address public safety directly. The **Road Crimes Command Center** uses ANPR to generate tamper-evident evidence packets for hit-and-runs and rash driving. This restricted view routes actionable, hash-signed evidence exclusively to the Traffic Police, drastically speeding up investigations."

### [1:35 - 2:20] The Public Portal (Solving the Transparency & Citizen Trust Problem)
**(Visuals: Screen recording of the Public Portal. Show the Smart Route Planner choosing 'Safest Route'. Zoom in on the Ward Intelligence scores and the AI Verification Center.)**

**Speaker:**
"But true governance requires public trust. That's why we built the radically transparent **Public Portal**. 

For citizens, the portal fundamentally changes how they interact with the city. Instead of just finding the fastest way home, our **Smart Route Planner** allows citizens to choose the *safest* or *best road quality* route based on live bus telemetry. 

Citizens can view the **City Road Health Map** and access **Ward Intelligence** to see exactly how their local department is performing against SLA targets. We also close the loop with the **AI Verification Center**. Citizens can confirm or reject AI detections, acting as human-in-the-loop verifiers. This compounds into a final trust score that guarantees the system reflects ground truth."

### [2:20 - 2:30] The Closing
**(Visuals: NagarNetra logo. Split screen showing a Field Officer resolving a ticket on their mobile app, and a Citizen viewing the updated Public Scorecard.)**

**Speaker:**
"NagarNetra isn't just an object detector. It is a complete ecosystem—from edge detection to public transparency—designed to make our cities objectively safer and undeniably accountable. NagarNetra: City Intelligence, in motion."

---

## 🎬 Direction Notes for Recording (Version 1)
- **Pacing (0:40 - 1:35):** When explaining the Black Spot Engine and auto-routing, speak with emphasis. This is the core differentiator of the product (we don't just detect; we govern).
- **Screen Captures (1:35 - 2:20):** Make sure the visual clearly demonstrates the Smart Route Planner highlighting a safe route versus a fast route. This is a highly relatable feature for the judges.
- **Tone:** Maintain a "problem-solved" tone when introducing the specific features of the Authority Dashboard and Public Portal.

<br/><br/><br/>

---

# NagarNetra - Version 2: View-by-View Prototype Demo Script

**Target Duration:** ~3 Minutes
**Goal:** Explicitly guide the judge/viewer through the actual React prototypes (Authority Dashboard + Public Portal), pointing out specific UI elements we built.

### [0:00 - 0:30] Intro & The Executive View
**(Action: Start on the Authority Dashboard Home screen. Slowly scroll to show the City Pulse Score, KPI row, and the live map.)**

**Voiceover:**
"Welcome to NagarNetra. What you're seeing is the **Authority Dashboard**, the command center for city officials. The data you see is not from static sensors—it's flowing in continuously from Edge AI modules mounted on the city's bus fleet. 

At the top right, notice the **City Pulse Score**—a single, executive KPI combining Road Health, Traffic, and Safety. Below that, we process the live data feed to categorize anomalies instantly. But we don't just show dots on a map."

### [0:30 - 1:00] Black Spots & Automated Governance
**(Action: Click on 'Black Spots' in the left sidebar. Open one of the Black Spot detail cards to show the causal profile. Then navigate to 'Departments' to show the SLA tracker.)**

**Voiceover:**
"If you navigate to the **Black Spots Intelligence** tab, you'll see our spatial clustering engine in action. Instead of burying departments in thousands of isolated pothole alerts, NagarNetra automatically groups them into prioritized high-risk segments—like this one, which factors in road damage *and* school proximity.

From here, the system's **Governance Engine** automatically generates a ticket, routes it to the specific department—like the PWD—and starts an SLA timer. You can see on the **Departments** page exactly which agencies are meeting their targets and which are facing automatic escalations."

### [1:00 - 1:30] Restricted ANPR & Road Crimes
**(Action: Navigate to 'Road Crimes'. Open the specific 'Case Evidence' detail page we built, highlighting the green and red bounding boxes, and the cryptographic hash.)**

**Voiceover:**
"Safety is paramount. Under the heavily restricted **Road Crimes** module, Traffic Police get actionable intelligence. When the Edge AI detects a hit-and-run or rash driving, it extracts the license plate via ANPR and packages the keyframes. 

Here in the Case Detail view, you can see the exact trajectory anomaly and the plate read. More importantly, notice the **Cryptographic Integrity** section on the right. Every packet is hash-chained and signed on the edge device itself, producing tamper-evident evidence ready for law enforcement."

### [1:30 - 2:15] The Public Portal & Smart Route Planner
**(Action: Switch browser tabs to the Public Portal (`localhost:5174`). Show the sidebar navigation. Click on 'Route Planner'.)**

**Voiceover:**
"Accountability requires transparency, so we also built the **NagarNetra Public Portal**. 

For citizens, the most powerful tool is our **Smart Route Planner**. Traditional apps route you based purely on speed. Our planner uses the live bus telemetry to give you choices: you can take the fastest route, but you can also explicitly choose the *safest* route, or the one with the *best road health*, avoiding known severe black spots entirely."

### [2:15 - 2:45] Ward Intel & Citizen Verification
**(Action: Navigate to 'Ward Intel' showing department scorecards. Then click on 'AI Verification'.)**

**Voiceover:**
"Under **Ward Intelligence**, citizens can hold their local officials accountable by viewing the same SLA compliance metrics the authorities see. 

Finally, under the **AI Verification Center**, we close the loop. Citizens can review recent AI detections in their area and verify them. This gamified, human-in-the-loop feedback acts as a secondary filter, compounding with the AI's confidence score to guarantee that the system reflects absolute ground truth."

### [2:45 - 3:00] Closing
**(Action: Return to the Authority Dashboard home screen. Zoom out on the map.)**

**Voiceover:**
"By pairing existing public transport fleets with Edge AI and an automated governance engine, NagarNetra doesn't just detect problems—it ensures they get solved. Thank you."
