# Interview Prep — Common Questions & Talking Points

## "Walk me through your NTPC project."
Structure the answer as: problem → approach → result → what I'd improve.
- Problem: unplanned power plant equipment failure is costly; wanted to predict issues early
  from sensor telemetry.
- Approach: built a 2-layer LSTM classifier on sequential sensor data, served via Flask +
  Socket.IO, visualized on a React SCADA-style dashboard, stored in MongoDB Atlas, deployed on
  Render/Vercel.
- Result: 99.27–99.28% accuracy, 0.9997 AUC, fully deployed live system.
- Improvement: with more time, would add model monitoring/drift detection in production, and
  a proper alerting escalation policy instead of a simple dashboard banner.

## "What was the hardest technical problem you solved?"
The Render free-tier memory constraint during UNIT-CTRL deployment. The Flask + TensorFlow app
kept crashing under load due to limited RAM. Solved by pinning the TensorFlow version, trimming
unnecessary dependencies, and being deliberate about how many concurrent inference requests the
service handled — a good example of production constraints shaping engineering decisions beyond
just "does the model work."

## "Tell me about a time you worked in a team." (EduSkills Foundation)
Worked across the stack (Python, Flask, React, MySQL, Node.js) in an Agile environment,
contributing to feature development and testing with Jest. Emphasize collaboration, code review
habits, and adapting to existing codebase conventions rather than imposing personal preferences.

## "Why should we hire you for an SDE / AI-ML role?"
Point to the fact that projects aren't just notebooks — UNIT-CTRL is a deployed, real-time
system spanning IoT, ML, backend, frontend, and database layers. This demonstrates end-to-end
ownership, not just model-building in isolation.

## "What's a weakness / area you're improving?"
Be honest and specific: e.g., still building depth in distributed systems / scaling
considerations beyond what personal projects require, and actively working through DSA and
system design fundamentals as part of placement prep.

## Behavioral Framework Reminder (STAR)
Situation → Task → Action → Result. Keep answers concrete: name the actual tools, the actual
metric, and the actual outcome rather than speaking in generalities.
