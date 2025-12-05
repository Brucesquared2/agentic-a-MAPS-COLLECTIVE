import { incrementCompleted, incrementRotation, getMetrics } from "../apps/web/src/lib/metricsStoreRedis";

(async () => {
  console.log("Initial metrics:", await getMetrics());

  await incrementCompleted();
  await incrementRotation();
  await incrementCompleted();

  console.log("After increments:", await getMetrics());
})();
