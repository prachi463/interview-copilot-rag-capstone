# NTPC Internship Report — Summer 2026

## Organization
NTPC Limited, Auraiya Gas Power Station.

## Role & Duration
AI/ML Intern, Summer 2026 (approx. 6–8 weeks).

## Problem Statement
Power plant equipment (turbines, generators, transformers) generates continuous sensor telemetry
(temperature, vibration, pressure, load). Unplanned equipment failure causes costly downtime.
The goal of the internship project was to build a predictive maintenance system that could flag
equipment anomalies before failure, using historical and live sensor data.

## Approach
1. **Data collection & simulation:** Since live plant data access is restricted, historical
   patterns were studied and a realistic sensor telemetry simulation was built to represent
   normal operation vs. fault conditions (temperature spikes, vibration anomalies).
2. **Feature engineering:** Rolling statistics (mean, std, rate-of-change) computed over
   sliding time windows from raw sensor streams.
3. **Modeling:** A 2-layer LSTM (Long Short-Term Memory) neural network was trained to classify
   equipment state (normal / warning / critical) from sequential sensor windows. The model
   achieved 99.27–99.28% classification accuracy and an AUC of 0.9997 on the held-out test set.
4. **Serving:** The trained model was wrapped in a Flask backend with Socket.IO for real-time
   push updates to connected clients.
5. **Dashboard:** A React-based SCADA-style dashboard was built to visualize live equipment
   status, historical trends, and alerts — mirroring the kind of control-room interface used in
   real power plant operations.
6. **Data storage:** MongoDB Atlas was used to persist telemetry history and alert logs.
7. **IoT integration:** An ESP32 microcontroller was used to demonstrate real sensor telemetry
   ingestion into the pipeline, showing the system could bridge from physical hardware to the
   cloud dashboard.
8. **Deployment:** Backend deployed on Render, frontend dashboard deployed on Vercel.

## Engineering Challenges Solved
- **PyMongo ObjectId serialization:** MongoDB's ObjectId type isn't JSON-serializable by default;
  a custom encoder was written to safely serialize documents for the API responses.
- **TensorFlow version pinning:** Model training and serving environments needed exact
  TensorFlow version alignment to avoid silent inference mismatches between dev and deployment.
- **Render memory constraints:** The free-tier deployment had limited RAM, requiring model size
  optimization and careful management of concurrent request load to avoid out-of-memory crashes.

## Results
- LSTM model: 99.27–99.28% accuracy, 0.9997 AUC on test data
- End-to-end pipeline: sensor data → feature extraction → LSTM inference → real-time dashboard
  alerting, running as a fully deployed, publicly accessible system

## Key Learnings
- Real-time systems require careful thought about backpressure and update frequency, not just
  model accuracy.
- Deployment constraints (memory, cold starts) meaningfully shape what "production-ready" ML
  looks like, beyond just notebook accuracy metrics.
- Bridging IoT hardware to a cloud pipeline surfaces integration issues that don't appear when
  working with clean, static datasets.
