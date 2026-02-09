#  High-Scale Energy Ingestion Engine

**Target Role:** Backend Developer (Node.js / NestJS)  
**Domain:** EV Fleet & Smart Meter Telemetry  
**Database:** PostgreSQL  
**Scale:** 10,000+ devices, ~14.4M records/day  

---

##  Overview

This service is a **high-throughput telemetry ingestion and analytics engine** designed for EV fleets and smart meters.

It ingests **two independent telemetry streams** every 60 seconds:
- **Smart Meters (Grid side)** → AC energy consumption
- **EVs / Chargers (Vehicle side)** → DC energy delivered to batteries

The system correlates these streams to provide **power efficiency insights** while maintaining **low-latency dashboards** and **scalable historical analytics**.

---

##  Core Problem Statement

In real-world charging systems:

AC Energy Consumed (Grid)  >  DC Energy Delivered (Battery)

The difference represents:
- Conversion loss
- Heat loss
- Hardware inefficiencies

An efficiency drop below **85%** indicates:
- Faulty charger
- Energy leakage
- Infrastructure issues

---

##  High-Level Architecture

Smart Meters / EVs  
↓  
Polymorphic Ingestion API (NestJS)  
↓  

 Cold Store (Historical Telemetry)  
- Append-only writes  
- Billions of rows  
- Optimized for analytics  

 Hot Store (Live Operational State)  
- One row per device  
- UPSERT-based updates  
- Constant-time reads  

↓  
Analytics API (24h time window, indexed)

---

##  Telemetry Streams

### Smart Meter (Grid Side)
```json
{
  "meterId": "MTR123",
  "kwhConsumedAc": 120.5,
  "voltage": 230,
  "timestamp": "2026-02-08T10:01:00Z"
}
```

### Vehicle / Charger (Vehicle Side)
```json
{
  "vehicleId": "EV456",
  "soc": 72,
  "kwhDeliveredDc": 98.2,
  "batteryTemp": 38,
  "timestamp": "2026-02-08T10:01:00Z"
}
```

---

##  Polymorphic Ingestion

**Endpoint**
```
POST /v1/ingest
```

The ingestion layer automatically detects the telemetry type and routes it to the correct persistence path.

---

##  Hot vs Cold Data Strategy

### Cold Store (Historical)
- INSERT only (append-only)
- Used for analytics & reporting
- Indexed by device ID and timestamp

### Hot Store (Live State)
- UPSERT on every heartbeat
- Stores latest device state
- Used for dashboards & monitoring

---

##  Insert vs Upsert Strategy

| Data Type | Operation | Reason |
|---------|----------|-------|
| Historical telemetry | INSERT | Immutable & audit-safe |
| Live device status | UPSERT | Always reflects latest state |

---

##  Analytics API

**Endpoint**
```
GET /v1/analytics/performance/:vehicleId
```

**Returns**
- Total AC energy consumed
- Total DC energy delivered
- Charging efficiency
- Average battery temperature (last 24h)

Queries are time-bounded and indexed — **no full table scans**.

---

##  Efficiency Formula

```
efficiency = totalDcDelivered / totalAcConsumed
```

---

##  Scalability Considerations

- Write-heavy ingestion via append-only tables
- Constant-size live tables
- Analytics queries scale by time window, not data size
- Ready for partitioning & read replicas

---

##  Running the Project

```bash
docker-compose up --build
```

API Base URL:
```
http://localhost:3000/v1
```

---

##  Tech Stack

- NestJS (TypeScript)
- PostgreSQL
- TypeORM
- Docker & Docker Compose

---

##  Conclusion

This project demonstrates a **production-grade ingestion architecture** capable of handling **high-frequency telemetry**, optimized for **scalability, performance, and analytical insight**.
