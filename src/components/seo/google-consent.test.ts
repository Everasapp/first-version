import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

import GoogleConsentDefaults from "./GoogleConsentDefaults";
import GooglePublisherTags from "./GooglePublisherTags";

const { route } = vi.hoisted(() => ({ route: { pathname: "/", consent: "pending" as string | null } }));

vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("./useAnalyticsConsent", () => ({ useAnalyticsConsent: () => route.consent }));
vi.mock("next/script", () => ({
  default: ({ children, ...props }: React.ComponentProps<"script">) =>
    React.createElement("script", props, children),
}));
vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) =>
    React.createElement("script", { "data-ga-id": gaId }),
}));

// Vitest's JSX transform uses the classic runtime for these Next.js files.
vi.stubGlobal("React", React);

describe("Google consent and publisher tags", () => {
  it("queues denied defaults before measurement without accessing storage", () => {
    const element = GoogleConsentDefaults();
    expect(element.props.strategy).toBe("beforeInteractive");
    const sandbox: Record<string, unknown> = {};
    sandbox.window = sandbox;
    vm.runInNewContext(element.props.children, sandbox);
    const commands = (sandbox.dataLayer as IArguments[]).map((command) =>
      Array.from(command),
    );
    expect(commands[0]).toEqual([
      "consent",
      "default",
      {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      },
    ]);
    expect(commands).toContainEqual(["set", "ads_data_redaction", true]);
    expect(commands).toContainEqual(["set", "url_passthrough", false]);
    expect(commands.some((command) => command[0] === "config")).toBe(false);

    // The CMP can use the same queue to update the visitor's actual choice.
    vm.runInNewContext(
      "gtag('consent', 'update', { analytics_storage: 'granted' });",
      sandbox,
    );
    expect(Array.from((sandbox.dataLayer as IArguments[]).at(-1)!)).toEqual([
      "consent", "update", { analytics_storage: "granted" },
    ]);
  });

  it.each(["/privacy", "/cookie"])("loads no Google tags on %s", (pathname) => {
    route.pathname = pathname;
    route.consent = "granted";
    expect(renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: true,
    }))).toBe("");
  });

  it.each(["pending", null, "denied"])("does not load GA without accepted consent (%s)", (consent) => {
    route.pathname = "/";
    route.consent = consent;
    expect(renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: true,
    }))).toBe("");
  });

  it.each(["granted", "denied", "accepted", "invalid"])("restores only a valid saved acceptance (%s)", (choice) => {
    const element = GoogleConsentDefaults();
    const sandbox: Record<string, unknown> = {
      document: { cookie: `other=1; everas_analytics_consent_v1=${choice}` },
    };
    sandbox.window = sandbox;
    vm.runInNewContext(element.props.children, sandbox);
    const updates = (sandbox.dataLayer as IArguments[]).map((c) => Array.from(c))
      .filter((c) => c[0] === "consent" && c[1] === "update");
    expect(updates).toEqual(choice === "granted" ? [
      ["consent", "update", { analytics_storage: "granted" }],
    ] : []);
  });

  it("keeps a single production GA source on content pages", () => {
    route.pathname = "/cultura-sarda/centro-sardegna/orgosolo";
    route.consent = "granted";
    const html = renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: true,
    }));
    expect(html.match(/data-ga-id=/g)).toHaveLength(1);
    const developmentHtml = renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: false,
    }));
    expect(developmentHtml).not.toContain("data-ga-id");
  });
});
