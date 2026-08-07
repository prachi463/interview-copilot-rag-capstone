# Project: UNIT-CTRL — AI-Powered Predictive Maintenance System

## Elevator Pitch
UNIT-CTRL is an end-to-end predictive maintenance system that predicts equipment failure risk
from sensor telemetry using an LSTM neural network, and surfaces the results through a real-time
SCADA-style monitoring dashboard. Built during an NTPC internship, it demonstrates the full
pipeline from raw IoT sensor data to a deployed, production-style monitoring tool.

## Architecture
- **Data layer:** ESP32 microcontroller streams sensor telemetry (temperature, vibration).
- **Model layer:** 2-layer LSTM network trained on sequential sensor windows, classifying
  equipment health state. 99.27–99.28% accuracy, 0.9997 AUC.
- **Backend:** Flask + Socket.IO server for real-time bidirectional communication between the
  model inference service and connected dashboard clients.
- **Database:** MongoDB Atlas for storing historical telemetry and alert logs.
- **Frontend:** React-based dashboard styled like an industrial SCADA control panel — live
  gauges, historical trend charts, and alert banners.
- **Deployment:** Backend on Render, frontend on Vercel — fully public, live system.

## Why This Project Matters
Most academic ML projects stop at a Jupyter notebook with an accuracy score. UNIT-CTRL goes
further: it's a deployed, real-time system that handles live data streaming, database
persistence, and a production dashboard — closer to what an actual industrial monitoring tool
looks like.

## Technical Deep-Dive Topics (for interviews)
1. **Why LSTM over a simple feedforward network?** Equipment failure often shows up as a
   *pattern over time* (e.g., gradually rising vibration), not a single-point anomaly. LSTM's
   ability to model sequential dependencies made it a natural fit over stateless models.
2. **Real-time architecture:** Socket.IO was chosen over plain REST polling because the
   dashboard needs push-based updates — polling would add latency and unnecessary load.
3. **Handling ObjectId serialization:** MongoDB documents include a BSON ObjectId field that
   isn't natively JSON-serializable; a custom JSON encoder converts it to string before sending
   over the API.
4. **Deployment under memory constraints:** Render's free tier has limited RAM. The model and
   Flask app had to be kept lightweight, and TensorFlow's version was pinned to avoid
   inconsistent behavior between local training and the deployed inference environment.
5. **IoT-to-cloud bridge:** The ESP32 demonstrates that the pipeline isn't just simulated data —
   it can ingest telemetry from real hardware, which is a meaningfully different engineering
   problem than working with a static CSV.

## Links
- GitHub: github.com/prachi463 (see pinned UNIT-CTRL repository)
- Live demo: deployed on Render (backend) and Vercel (frontend)
