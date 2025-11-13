/**
 * Conditional Logic Evaluator
 * Evaluates field visibility conditions based on form state
 */

import type {
  Condition,
  ConditionRule,
  ConditionGroup,
} from "../types/schema.types";

function isConditionRule(condition: Condition): condition is ConditionRule {
  return "field" in condition && "operator" in condition;
}

function isConditionGroup(condition: Condition): condition is ConditionGroup {
  return "all" in condition || "any" in condition;
}

function evaluateRule(
  rule: ConditionRule,
  formValues: Record<string, any>,
): boolean {
  const fieldValue = formValues[rule.field];
  const compareValue = rule.value;

  switch (rule.operator) {
    case "equals":
      return fieldValue === compareValue;

    case "notEquals":
      return fieldValue !== compareValue;

    case "in":
      return Array.isArray(compareValue) && compareValue.includes(fieldValue);

    case "notIn":
      return Array.isArray(compareValue) && !compareValue.includes(fieldValue);

    case "contains":
      if (typeof fieldValue === "string" && typeof compareValue === "string") {
        return fieldValue.includes(compareValue);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(compareValue);
      }
      return false;

    case "notContains":
      if (typeof fieldValue === "string" && typeof compareValue === "string") {
        return !fieldValue.includes(compareValue);
      }
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(compareValue);
      }
      return true;

    case "gt":
      return Number(fieldValue) > Number(compareValue);

    case "gte":
      return Number(fieldValue) >= Number(compareValue);

    case "lt":
      return Number(fieldValue) < Number(compareValue);

    case "lte":
      return Number(fieldValue) <= Number(compareValue);

    case "isEmpty":
      return (
        !fieldValue ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case "isNotEmpty":
      return (
        !!fieldValue &&
        fieldValue !== "" &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );

    default:
      console.warn(`[conditions] Unknown operator: ${rule.operator}`);
      return false;
  }
}

export function evaluateCondition(
  condition: Condition,
  formValues: Record<string, any>,
): boolean {
  if (isConditionRule(condition)) {
    return evaluateRule(condition, formValues);
  }

  if (isConditionGroup(condition)) {
    if ("all" in condition && condition.all) {
      return condition.all.every((c) => evaluateCondition(c, formValues));
    }

    if ("any" in condition && condition.any) {
      return condition.any.some((c) => evaluateCondition(c, formValues));
    }
  }

  return true;
}
