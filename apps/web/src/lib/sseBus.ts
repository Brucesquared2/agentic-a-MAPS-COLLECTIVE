export type AssignmentEvent = {
  timestamp: string;
  agent: string;
  action: "task_assigned" | "task_completed" | "rotation";
  notes: string;
};

type Subscriber = (event: AssignmentEvent) => void;
const subscribers = new Set<Subscriber>();
let activeAssignments: string[] = [];

import { incrementCompleted, incrementRotation } from "./metricsStore";

export function publishAssignment(event: AssignmentEvent) {
  if (event.action === "task_assigned") {
    if (!activeAssignments.includes(event.agent)) activeAssignments.push(event.agent);
  } else if (event.action === "task_completed") {
    activeAssignments = activeAssignments.filter((a) => a !== event.agent);
    // increment completed counter for metrics
    try {
      incrementCompleted();
    } catch (e) {}
  } else if (event.action === "rotation") {
    activeAssignments = [];
    // increment rotation counter for metrics
    try {
      incrementRotation();
    } catch (e) {}
  }

  for (const sub of subscribers) sub(event);
}

export function getActiveAssignments() {
  return activeAssignments.slice();
}

export function subscribeAssignments(sub: Subscriber) {
  subscribers.add(sub);
  return () => subscribers.delete(sub);
}
