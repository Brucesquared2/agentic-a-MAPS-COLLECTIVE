import { incrementCompleted, incrementRotation, getMetrics } from "../apps/web/src/lib/metricsStore";

console.log("Initial metrics:", getMetrics());

incrementCompleted();
incrementRotation();
incrementCompleted();

setTimeout(() => {
  console.log("After increments:", getMetrics());
}, 500);
