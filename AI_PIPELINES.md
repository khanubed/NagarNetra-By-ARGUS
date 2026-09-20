# AI + Edge Intelligence Guide — NagarNetra

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) §3, §9–11 · [`BACKEND.md`](./BACKEND.md) §Event Schema

---

## 1. Detection Pipeline

```
CAMERA FRAME (sampled at N fps)
      ▼
PRE-PROCESS         resize, normalise, ROI mask (exclude bus bonnet/sky)
      ▼
YOLOv11 DETECTOR    multi-class: road defects, vehicles, persons, signage
      ▼
TRACKER (ByteTrack) persistent track IDs across frames
      ▼
CLASS ROUTER
  ├─ defect track      → multi-frame confirmation → severity estimator
  ├─ vehicle track     → counting / density / trajectory analysis
  ├─ person track      → proximity + school-zone risk evaluation
  └─ incident trigger  → ANPR (plate detect → OCR → confidence)
      ▼
EVENT GENERATOR     dedup, GPS/time tag, keyframe annotate, package
      ▼
TRANSMIT → RISK ENGINE → GOVERNANCE ENGINE
```

## 2. Tracking Pipeline

- **ByteTrack** assigns persistent track IDs across frames for both vehicles and pedestrians, running on CPU alongside the GPU/NPU detector.
- Vehicle counting uses track identities, not raw per-frame detections, to avoid double-counting the same vehicle across frames.
- Trajectory instability (sudden heading change, abrupt deceleration) on a tracked vehicle, corroborated by relative speed to nearby pedestrian tracks, is the basis for near-miss and rash-driving detection.
- Hit-and-run detection combines an abrupt trajectory change on a vehicle track, an impact-like IMU signature (see §15), and rapid departure from the scene.

## 3. ANPR Pipeline

```
Incident-flagged vehicle track
      ▼
PLATE DETECTOR (YOLOv11n, plate-specific)   localise plate region
      ▼
CROP & UPSCALE                               sufficient resolution for OCR
      ▼
OCR (PaddleOCR / EasyOCR)                    extract text, per-character confidence
      ▼
NORMALISE                                    Indian plate format validation
      ▼
CONFIDENCE GATE                              accept only above threshold; else "unverified"
      ▼
EVIDENCE PACKET                              keyframes + plate + confidence + GPS + timestamp
                                              + device ID + SHA-256 hash (see BACKEND.md §Evidence)
```

**Privacy rule:** ANPR runs only on incident-flagged tracks, never as a continuous surveillance sweep of all passing vehicles. This is both a privacy safeguard and a compute optimisation, and the architecture deliberately makes continuous plate logging unavailable rather than merely disabled.

## 4. Event Generation

| Step | Detail |
|---|---|
| Multi-frame confirmation | An event is emitted only after N consecutive/near-consecutive confirmations, N configurable per class — reduces false positives from single-frame noise |
| Deduplication | Detections of the same class within a configurable radius + time window collapse into one event with incremented `observationCount` |
| GPS/time tagging | Position interpolated to frame timestamp (not transmission time); device clock skew tracked and corrected server-side |
| Keyframe packaging | One annotated keyframe per event, compressed below a configurable size ceiling |
| Local buffering | Durable local buffer (SQLite-class) surviving process restart; syncs oldest-first on reconnect with exponential backoff and at-least-once delivery |

## 5. Model Training

```
RAW FOOTAGE → FRAME EXTRACTION → ANNOTATION (CVAT/Roboflow)
      ▼
DATASET VERSIONING (immutable snapshots, frozen train/val/test split)
      ▼
AUGMENTATION   low-light, rain, motion blur, glare, JPEG artefacts,
               horizontal flip, random scale/crop
      ▼
TRAIN (Ultralytics) → VALIDATE → ERROR ANALYSIS BY SLICE
      ▼
QUANTISE (INT8, calibration set) → EXPORT (ONNX/TensorRT)
      ▼
EDGE BENCHMARK (FPS, latency, thermal) → ACCEPT / REJECT
      ▼
OTA MODEL RELEASE (versioned, staged rollout, rollback capable)
```

## 6. Dataset Strategy

| Source | Contribution | Notes |
|---|---|---|
| Public pothole/road-damage datasets (Kaggle, Roboflow, RDD) | Base defect classes | Requires re-annotation to unify class taxonomy |
| Indian dashcam footage | Domain adaptation to local roads/signage/traffic mix | Critical — models trained on Western imagery transfer poorly |
| COCO subset | Vehicle/person pretraining | Fine-tuned on local data afterward |
| Plate datasets (Indian format) | Plate detection + OCR | Must cover multi-line, state-code, non-standard variants |
| Self-collected pilot footage | Final domain fine-tuning + evaluation | Becomes the authoritative evaluation set post-pilot |

## 7. Annotation Strategy

- Bounding boxes tight to visible defect extent including partial occlusions, with an explicit "occluded" attribute.
- Every annotation carries a severity attribute (low/medium/high/critical) against a written rubric with reference images — severity must be learnable, not guessed at inference.
- Waterlogging annotated as polygon/box over water extent within the road surface only, excluding roadside pooling.
- Ambiguous cases (shadow vs. pothole, patch repair vs. damage) routed to a second annotator; disagreements resolved by a written adjudication rule added back into the guideline.
- Held-out test set frozen before training begins; never used for model selection, only final reporting.

## 8. Evaluation Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| mAP@50 (road defects) | ≥ 0.85 | Primary detection quality measure |
| mAP@50 (vehicles) | ≥ 0.80 | Underpins density/congestion accuracy |
| Precision (ticket-generating classes) | ≥ 0.90 | False positives waste municipal work orders and erode trust |
| Recall | ≥ 0.80 | Missed defects are invisible failures |
| False positive rate | ≤ 0.5 confirmed FP/km | Operationally meaningful alert-fatigue measure |
| Plate OCR exact-match | ≥ 0.85 above threshold | Determines evidentiary usefulness |
| Edge inference FPS | ≥ 10 fps sustained | Must keep pace with a moving vehicle |
| Thermal sustainability | No throttling over 4-hour run | Buses operate long shifts |

**Reference benchmarks (published research, not our own measured results — cite accurately):** YOLOv8n-seg pothole detection: 91.9% precision, 85.2% recall, 91.9% mAP@50 at 121 FPS on 3.2M parameters (Yurdakul & Uslu, arXiv:2505.04207, 2025). Ensemble YOLOS+YOLOv8: 97.34% mAP@0.50 (ResearchGate, 2024). These establish the approach is viable; they are not claims about our own trained model until validated on our test set.

**Slice-based error analysis** — a model is rejected if any slice falls >15 points below overall accuracy:

| Slice Dimension | Values |
|---|---|
| Lighting | Daylight, dusk, night+streetlight, night w/o lighting |
| Weather | Clear, rain, post-rain wet surface, fog |
| Speed | Stationary, <20km/h, 20–40km/h, >40km/h |
| Road class | Arterial, sub-arterial, residential, unpaved |
| Occlusion | Unobstructed, partial, heavy |

Night-without-lighting and wet-surface are the known hard cases — this is exactly why the sensor-fusion fallback (§15) exists.

## 9. ONNX Conversion

```bash
# Ultralytics export
yolo export model=best.pt format=onnx opset=17 dynamic=False simplify=True

# Validate parity against the PyTorch model on a held-out batch before proceeding
python validate_onnx_parity.py --pt best.pt --onnx best.onnx --tolerance 1e-3
```

## 10. TensorRT Optimization

```bash
# INT8 quantisation with a representative calibration set (500-1000 images
# spanning all evaluation slices in §8 — calibration set imbalance directly
# causes accuracy loss concentrated in underrepresented slices)
trtexec --onnx=best.onnx --int8 --calib=calibration_cache.bin \
        --saveEngine=best_int8.engine --workspace=4096

# Benchmark on-device before accepting the build
trtexec --loadEngine=best_int8.engine --iterations=200 --avgRuns=50
```

Acceptance requires meeting the §8 targets on the target hardware itself, not on a development GPU.

## 11. Edge Runtime

- **ONNX Runtime** (CPU/GPU execution providers) or **TensorRT** (NVIDIA Jetson-class) for inference.
- **OpenCV** for frame capture, pre-processing, and annotation overlay.
- Inference scheduling is staggered across models (defect detector, vehicle detector, tracker, ANPR-on-trigger) to fit within the device's thermal and compute budget — ANPR only activates on an incident trigger, never running continuously.
- Local event buffer implemented as an embedded SQLite database for durability across power cycles.

## 12. Jetson Setup

```bash
# JetPack-provided base; install project dependencies
sudo apt-get update && sudo apt-get install -y python3-pip libopencv-dev
pip3 install -r edge/requirements-jetson.txt

# Verify TensorRT + CUDA availability
python3 -c "import tensorrt; print(tensorrt.__version__)"

# Run the edge pipeline against a connected camera or test footage
python3 edge/pipeline/run.py --device-id <uid> --model models/defect_int8.engine \
  --camera /dev/video0 --mqtt-host <broker>
```

Reference hardware: NVIDIA Jetson Orin Nano Super Developer Kit — official price $249 (~₹45,000–80,000 in Indian retail/import channels).

## 13. Raspberry Pi Setup

```bash
# Raspberry Pi 5 + AI HAT (or Coral USB accelerator) as the lower-cost option
sudo apt-get update && sudo apt-get install -y python3-pip libatlas-base-dev
pip3 install -r edge/requirements-rpi.txt

# ONNX Runtime CPU/NPU execution provider
python3 edge/pipeline/run.py --device-id <uid> --model models/defect_int8.onnx \
  --camera /dev/video0 --mqtt-host <broker> --runtime onnxruntime
```

Use Raspberry Pi-class hardware where FPS targets can be met with lighter models (e.g. YOLOv11n) — reserve Jetson-class hardware for buses on high-priority routes or where the full model set (defect + vehicle + ANPR) must run concurrently.

## 14. Risk Score Logic

Full formula and worked example: `ARCHITECTURE.md` §9 (Urban Risk Index™). Summary of inputs computed from this pipeline's outputs: Road Damage (defect density × severity per km), Traffic Density (vehicle counting/classification output), Accident Frequency (incident/near-miss event rate), Waterlogging (recurrence across distinct days), School Proximity (share of events within school-zone geofence), Citizen Complaints (external input from the portal, not the edge pipeline).

## 15. Black Spot Logic

Full clustering algorithm and scoring formula: `ARCHITECTURE.md` §10 (Black Spot Intelligence Engine). Clustering runs server-side (`ST_ClusterDBSCAN`) on aggregated event data from this pipeline, not on the edge device.

## 16. Verification Pipeline

Implements the Citizen + AI Verification USP — composite confidence model detailed in `ARCHITECTURE.md` §9:

```
Start:  C = ai_confidence                          e.g. 84

Citizen signal:  net = Σ(vote × reputation_weight)
  net > 0:  C = C + (100−C) × min(0.45, 0.15×√net)
  net < 0:  C = C − C × min(0.50, 0.15×√|net|)

Engineer signal (authoritative):
  confirmed: C = max(C, 95)
  rejected:  C = min(C, 10) → event status = REJECTED
```

**Sensor fusion fallback** (feeds the verification queue rather than direct ticketing when vision-only confidence is low):

```
IMU STREAM (accelerometer z-axis, gyroscope)
      ▼
HIGH-PASS FILTER → SPIKE DETECTION (threshold adaptive to bus speed)
      ▼
CANDIDATE IMPACT EVENT (timestamp, GPS, magnitude)
      ▼
CORRELATE with vision detections in the same time/space window
      │
      ├─ vision + IMU agree  → confidence uplift, severity from magnitude
      ├─ vision only         → standard confidence
      └─ IMU only            → low-confidence "suspected defect",
                                routed to verification queue, never a direct ticket
```

Impact magnitude, normalised by vehicle speed, feeds the severity estimate — giving a physical rather than purely visual severity measure, and providing detection coverage in exactly the conditions (night, glare, heavy rain) where the vision pipeline is weakest per the slice analysis in §8.
