# Local Jaeger + Tempo one-click

This stack lets `code/open-telemetry.ts` export telemetry to both **Jaeger** and **Tempo** via an OpenTelemetry Collector.

## 1) Start stack

```bash
docker compose -f code/otel-local/docker-compose.yml up -d
```

## 2) Run Deno demo app with OTLP export

```bash
OTEL_DENO=true \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
deno run --allow-net code/open-telemetry.ts
```

## 3) Generate traffic

```bash
curl "http://localhost:8000/work?name=deno"
curl "http://localhost:8000/work?name=tempo"
curl "http://localhost:8000/work?name=jaeger"
```

## 4) Verify in UI

- Jaeger UI: http://localhost:16686
- Grafana UI: http://localhost:3001
  - Explore -> Tempo data source
  - You can search by service name `demo.telemetry`

## 5) Stop stack

```bash
docker compose -f code/otel-local/docker-compose.yml down
```

## Troubleshooting

- If no traces appear, verify app env:
  - `OTEL_DENO=true`
  - `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318`
  - `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`
- Check collector logs:
  ```bash
  docker compose -f code/otel-local/docker-compose.yml logs -f otel-collector
  ```
