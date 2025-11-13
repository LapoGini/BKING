/**
 * Form Schema Types
 * Based on docs/form.schema.json
 */

export type I18nString = Record<string, string>;

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "datetime"
  | "file";

export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "in"
  | "notIn"
  | "contains"
  | "notContains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "isEmpty"
  | "isNotEmpty";

export interface ConditionRule {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | any[];
}

export interface ConditionGroup {
  all?: Condition[];
  any?: Condition[];
}

export type Condition = ConditionRule | ConditionGroup;

export interface FieldOption {
  value: string | number | boolean;
  label: I18nString;
}

export type OptionsSource = "services" | "venues" | "resources";

export interface FormField {
  type: FieldType;
  name: string;
  label: I18nString;
  placeholder?: I18nString;
  helpText?: I18nString;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  options?: FieldOption[];
  options_source?: OptionsSource;
  multiple?: boolean;
  default?: string | number | boolean | any[];
  visible_when?: Condition;
  section?: string;
  order?: number;
  ariaDescriptionId?: string;
}

export interface FormSection {
  id: string;
  title?: I18nString;
  label?: I18nString;
  description?: I18nString;
  visible_when?: Condition;
  order?: number;
  fields?: string[];
}

export interface FormSchema {
  schemaVersion: string;
  title?: I18nString;
  description?: I18nString;
  sections: FormSection[];
  fields: FormField[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
