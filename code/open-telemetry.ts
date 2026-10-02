/**
 * Deno OpenTelemetry complete example.
 *
 * Run:
 *   OTEL_DENO=true deno run --allow-net code/open-telemetry.ts
 *
 * Optional OTLP target:
 *   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
 *   OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
 *
 * With local Jaeger/Tempo stack:
 *   docker compose -f code/otel-local/docker-compose.yml up -d
 *   OTEL_DENO=true OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 \
 *   OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
 *   deno run --allow-net code/open-telemetry.ts
 *
 * Test:
 *   curl "http://localhost:8000/work?name=deno"
 */

import {
  context,
  metrics,
  SpanStatusCode,
  trace,
} from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("demo.telemetry", "1.0.0");
const meter = metrics.getMeter("demo.telemetry", "1.0.0");

// ---- Metrics instruments ----
const requestCounter = meter.createCounter("demo_http_requests_total", {
  description: "Total number of handled HTTP requests",
});

const requestDuration = meter.createHistogram("demo_http_request_duration_ms", {
  description: "HTTP request duration in milliseconds",
  unit: "ms",
});

const activeRequests = meter.createUpDownCounter("demo_http_requests_active", {
  description: "Number of currently in-flight HTTP requests",
});

/**
 * Simulate business logic and create an internal span.
 */
async function doBusinessWork(name: string): Promise<string> {
  return await tracer.startActiveSpan("business.work", async (span) => {
    const start = performance.now();
    try {
      span.setAttribute("app.user_name", name);

      // Simulate asynchronous work.
      await new Promise((resolve) => setTimeout(resolve, 80));

      const greeting = `hello ${name}`;
      span.setAttribute("app.greeting.length", greeting.length);
      span.setStatus({ code: SpanStatusCode.OK });
      return greeting;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      span.setAttribute("app.business.duration_ms", performance.now() - start);
      span.end();
    }
  });
}

/**
 * Outbound call wrapped in a child span.
 * Deno runtime also auto-instruments fetch; this demonstrates custom attributes.
 */
async function callUpstream(): Promise<number> {
  return await tracer.startActiveSpan("upstream.fetch", async (span) => {
    const url = "https://httpbin.org/status/200";
    try {
      span.setAttribute("http.url", url);
      const res = await fetch(url);
      span.setAttribute("http.status_code", res.status);
      span.setStatus({ code: SpanStatusCode.OK });
      return res.status;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      span.end();
    }
  });
}

Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url);
  const route = url.pathname;
  const method = req.method;
  const start = performance.now();

  activeRequests.add(1, { route, method });

  return await tracer.startActiveSpan("http.request", async (span) => {
    try {
      span.setAttribute("http.method", method);
      span.setAttribute("http.route", route);
      span.setAttribute("http.target", url.pathname + url.search);

      const name = url.searchParams.get("name") ?? "world";
      const greeting = await doBusinessWork(name);
      const upstreamStatus = await callUpstream();

      // Context propagation demo:
      // the active span context is available across async boundaries.
      await context.with(trace.setSpan(context.active(), span), async () => {
        console.log("request handled", {
          traceId: span.spanContext().traceId,
          route,
          method,
        });
      });

      const body = {
        ok: true,
        greeting,
        upstreamStatus,
        traceId: span.spanContext().traceId,
      };

      requestCounter.add(1, { route, method, status: "200" });
      span.setStatus({ code: SpanStatusCode.OK });
      return Response.json(body, { status: 200 });
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      requestCounter.add(1, { route, method, status: "500" });
      return Response.json(
        {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
          traceId: span.spanContext().traceId,
        },
        { status: 500 },
      );
    } finally {
      const durationMs = performance.now() - start;
      requestDuration.record(durationMs, { route, method });
      activeRequests.add(-1, { route, method });
      span.setAttribute("http.server_duration_ms", durationMs);
      span.end();
    }
  });
});
