import { Property, PropertyStatus } from "../types/property";

export function getPropertyStatus(
    property: Property
): PropertyStatus {
    const steps = property.steps;

    if (steps.length === 0) {
        return "not_started";
    }

    const allComplete = steps.every(step => step.status === "complete");

    if (allComplete) {
        return "live";
    }

    const hasActionRequired = steps.some(step => step.status === "action_required");

    if (hasActionRequired) { 
        return "attention_required";
    }

    return "in_progress";
}

export function getPropertyProgress(
    property: Property
): number {
    if (property.steps.length === 0) { 
        return 0;
    }
    const completeSteps = property.steps.filter(step => step.status === "complete").length;

    return Math.round((completeSteps / property.steps.length) * 100);
}

export function getActionRequiredCount(
    property: Property
): number {
    return property.steps.filter(step => step.status === "action_required").length;
}