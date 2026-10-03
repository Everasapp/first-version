import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

import GoogleConsentDefaults from "./GoogleConsentDefaults";
import GooglePublisherTags from "./GooglePublisherTags";

const { route } = vi.hoisted(() => ({ route: { pathname: "/" } }));

vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
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
    expect(renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: true,
    }))).toBe("");
  });

  it("keeps AdSense and a single production GA source on content pages", () => {
    route.pathname = "/cultura-sarda/centro-sardegna/orgosolo";
    const html = renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: true,
    }));
    expect(html).toContain("adsbygoogle.js?client=ca-pub-5513319548780658");
    expect(html.match(/data-ga-id=/g)).toHaveLength(1);
    const developmentHtml = renderToStaticMarkup(React.createElement(GooglePublisherTags, {
      gaMeasurementId: "G-TEST", analyticsEnabled: false,
    }));
    expect(developmentHtml).not.toContain("data-ga-id");
  });
});
