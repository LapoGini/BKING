/**
 * I18nService Unit Tests
 */

import { describe, it, expect } from "vitest";
import { I18nService } from "../../src/services/I18nService";

describe("I18nService", () => {
  it("should initialize with default locale", () => {
    const i18n = new I18nService();
    expect(i18n.getLocale()).toBe("it");
  });

  it("should translate known keys", () => {
    const i18n = new I18nService("en");
    expect(i18n.t("booking.title")).toBe("Book a Table");
  });

  it("should fallback to English for unknown locale", () => {
    const i18n = new I18nService("unknown");
    expect(i18n.t("booking.title")).toBe("Book a Table");
  });

  it("should translate i18n strings", () => {
    const i18n = new I18nService("en");
    const label = { en: "Name", it: "Nome" };
    expect(i18n.translateLabel(label)).toBe("Name");
  });

  it("should fallback to first available translation", () => {
    const i18n = new I18nService("es");
    const label = { en: "Name", it: "Nome" };
    // Should fallback to English
    expect(i18n.translateLabel(label)).toBe("Name");
  });

  it("should change locale dynamically", () => {
    const i18n = new I18nService("en");
    expect(i18n.t("booking.title")).toBe("Book a Table");

    i18n.setLocale("it");
    expect(i18n.t("booking.title")).toBe("Prenota un Tavolo");
  });

  it("should add custom translations", () => {
    const i18n = new I18nService("en");
    i18n.addTranslations("en", { "custom.key": "Custom Value" });
    expect(i18n.t("custom.key")).toBe("Custom Value");
  });
});
