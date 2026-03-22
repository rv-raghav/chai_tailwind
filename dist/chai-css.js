(function (root, factory) {
  const ChaiCSS = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = ChaiCSS;
  }

  if (root && typeof root === "object" && typeof root.window !== "undefined") {
    root.ChaiCSS = ChaiCSS;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const theme = {
    colors: {
      chai: "#8f5c3d",
      spice: "#b96a3b",
      cream: "#f7efe2",
      foam: "#fffaf2",
      cocoa: "#3b261c",
      roast: "#5d3a2a",
      ember: "#d97745",
      gold: "#d6a04c",
      sage: "#6c8b74",
      slate: "#6a6864",
      mist: "#d8c9b7",
      sand: "#eadcc8",
      card: "#fff7ef",
      ink: "#1c1715",
      red: "#d9485f",
      blue: "#4f7cff",
      green: "#3ca66b",
      yellow: "#d9a441",
      purple: "#8e63ce",
      pink: "#cf6c9d",
      orange: "#e3884f",
      gray: "#6b7280",
      white: "#ffffff",
      black: "#000000"
    },
    fontSizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "20px",
      xl: "24px",
      "2xl": "32px",
      "3xl": "clamp(32px, 4vw, 40px)",
      "4xl": "clamp(40px, 5.5vw, 52px)",
      "5xl": "clamp(44px, 7vw, 64px)"
    },
    fontWeights: {
      medium: "500",
      semibold: "600",
      bold: "700",
      black: "900"
    },
    lineHeights: {
      tight: "1.08",
      snug: "1.25",
      normal: "1.5",
      relaxed: "1.75"
    },
    letterSpacings: {
      tight: "-0.02em",
      normal: "0",
      wide: "0.08em",
      wider: "0.14em"
    },
    radii: {
      sm: "10px",
      DEFAULT: "18px",
      lg: "26px",
      xl: "34px",
      "2xl": "42px",
      full: "999px"
    },
    shadows: {
      sm: "0 14px 30px rgba(84, 48, 31, 0.08)",
      md: "0 18px 45px rgba(84, 48, 31, 0.12)",
      lg: "0 26px 80px rgba(84, 48, 31, 0.18)"
    },
    maxWidths: {
      copy: "680px",
      content: "960px",
      wide: "1200px"
    }
  };

  const referenceGroups = [
    {
      title: "Spacing",
      blurb: "Arbitrary spacing values keep the system simple while still giving you room to compose.",
      utilities: ["chai-p-24", "chai-px-32", "chai-py-16", "chai-mx-auto", "chai-gap-20"]
    },
    {
      title: "Layout",
      blurb: "Small layout primitives handle row, column, grid, and alignment work without any setup.",
      utilities: ["chai-flex", "chai-flex-col", "chai-grid", "chai-cols-3", "chai-items-center", "chai-justify-between"]
    },
    {
      title: "Typography",
      blurb: "Tailwind-like text sizing and font helpers are paired with alignment, leading, and tracking.",
      utilities: ["chai-text-sm", "chai-text-2xl", "chai-font-bold", "chai-leading-relaxed", "chai-tracking-wide", "chai-uppercase"]
    },
    {
      title: "Sizing",
      blurb: "Width and height helpers cover raw numbers as well as useful tokens like full, fit, and screen.",
      utilities: ["chai-w-full", "chai-w-fit", "chai-maxw-680", "chai-minh-280", "chai-h-64"]
    },
    {
      title: "Surface",
      blurb: "Color, border, shadow, and radius helpers make it easy to build actual components with the same vocabulary.",
      utilities: ["chai-bg-chai", "chai-text-cream", "chai-border-mist", "chai-rounded-xl", "chai-shadow-md", "chai-opacity-80"]
    }
  ];

  const spacingMap = {
    p: ["padding"],
    px: ["padding-left", "padding-right"],
    py: ["padding-top", "padding-bottom"],
    pt: ["padding-top"],
    pr: ["padding-right"],
    pb: ["padding-bottom"],
    pl: ["padding-left"],
    m: ["margin"],
    mx: ["margin-left", "margin-right"],
    my: ["margin-top", "margin-bottom"],
    mt: ["margin-top"],
    mr: ["margin-right"],
    mb: ["margin-bottom"],
    ml: ["margin-left"]
  };

  const gapMap = {
    gap: ["gap"],
    gapx: ["column-gap"],
    gapy: ["row-gap"]
  };

  const displayMap = {
    block: "block",
    inline: "inline",
    "inline-block": "inline-block",
    flex: "flex",
    grid: "grid",
    hidden: "none"
  };

  const itemAlignments = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline"
  };

  const justifyAlignments = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  };

  const textAlignments = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify"
  };

  const generatedUtilities = new Map();
  let styleTag = null;

  function getDocument(root) {
    if (root && root.ownerDocument) {
      return root.ownerDocument;
    }

    if (typeof document !== "undefined") {
      return document;
    }

    return null;
  }

  function isNumericToken(token) {
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  function resolveLength(token, axis, options) {
    const config = options || {};

    if (!token) {
      return null;
    }

    if (config.allowAuto && token === "auto") {
      return "auto";
    }

    if (token === "full") {
      return "100%";
    }

    if (token === "fit") {
      return "fit-content";
    }

    if (token === "screen") {
      return axis === "height" ? "100vh" : "100vw";
    }

    if (config.named && config.named[token]) {
      return config.named[token];
    }

    if (isNumericToken(token)) {
      return token === "0" ? "0" : token + "px";
    }

    return null;
  }

  function createDeclarationBlock(properties) {
    return Object.keys(properties)
      .map(function (property) {
        return property + ": " + properties[property] + ";";
      })
      .join(" ");
  }

  function resolveSpacing(parts) {
    const group = spacingMap[parts[0]];
    if (!group || parts.length < 2) {
      return null;
    }

    const token = parts.slice(1).join("-");
    const value = resolveLength(token, "width", {
      allowAuto: parts[0].indexOf("m") === 0
    });

    if (!value) {
      return null;
    }

    const properties = {};
    group.forEach(function (property) {
      properties[property] = value;
    });
    return properties;
  }

  function resolveGap(parts) {
    const group = gapMap[parts[0]];
    if (!group || parts.length < 2) {
      return null;
    }

    const value = resolveLength(parts.slice(1).join("-"), "width");
    if (!value) {
      return null;
    }

    const properties = {};
    group.forEach(function (property) {
      properties[property] = value;
    });
    return properties;
  }

  function resolveDisplay(utility, parts) {
    if (displayMap[utility]) {
      return { display: displayMap[utility] };
    }

    if (utility === "flex-col") {
      return { display: "flex", "flex-direction": "column" };
    }

    if (utility === "flex-row") {
      return { display: "flex", "flex-direction": "row" };
    }

    if (utility === "wrap") {
      return { "flex-wrap": "wrap" };
    }

    if (utility === "nowrap") {
      return { "flex-wrap": "nowrap" };
    }

    if (parts[0] === "items" && itemAlignments[parts[1]]) {
      return { "align-items": itemAlignments[parts[1]] };
    }

    if (parts[0] === "justify" && justifyAlignments[parts[1]]) {
      return { "justify-content": justifyAlignments[parts[1]] };
    }

    if (parts[0] === "cols" && parts.length === 2 && isNumericToken(parts[1])) {
      return {
        display: "grid",
        "grid-template-columns": "repeat(" + parts[1] + ", minmax(0, 1fr))"
      };
    }

    return null;
  }

  function resolveSizing(parts) {
    const sizeMap = {
      w: { property: "width", axis: "width", named: theme.maxWidths },
      h: { property: "height", axis: "height" },
      minw: { property: "min-width", axis: "width", named: theme.maxWidths },
      maxw: { property: "max-width", axis: "width", named: theme.maxWidths },
      minh: { property: "min-height", axis: "height" },
      maxh: { property: "max-height", axis: "height" }
    };

    const config = sizeMap[parts[0]];
    if (!config || parts.length < 2) {
      return null;
    }

    const value = resolveLength(parts.slice(1).join("-"), config.axis, {
      allowAuto: true,
      named: config.named
    });

    if (!value) {
      return null;
    }

    const properties = {};
    properties[config.property] = value;
    return properties;
  }

  function resolveText(parts) {
    if (parts[0] !== "text" || parts.length < 2) {
      return null;
    }

    const token = parts.slice(1).join("-");

    if (textAlignments[token]) {
      return { "text-align": textAlignments[token] };
    }

    if (theme.colors[token]) {
      return { color: theme.colors[token] };
    }

    if (theme.fontSizes[token]) {
      return { "font-size": theme.fontSizes[token] };
    }

    return null;
  }

  function resolveFont(parts, utility) {
    if (parts[0] === "font" && theme.fontWeights[parts[1]]) {
      return { "font-weight": theme.fontWeights[parts[1]] };
    }

    if (parts[0] === "leading" && theme.lineHeights[parts[1]]) {
      return { "line-height": theme.lineHeights[parts[1]] };
    }

    if (parts[0] === "tracking" && theme.letterSpacings[parts[1]]) {
      return { "letter-spacing": theme.letterSpacings[parts[1]] };
    }

    if (utility === "uppercase") {
      return { "text-transform": "uppercase" };
    }

    if (utility === "capitalize") {
      return { "text-transform": "capitalize" };
    }

    if (utility === "italic") {
      return { "font-style": "italic" };
    }

    return null;
  }

  function resolveColors(parts) {
    if (parts[0] === "bg" && parts.length >= 2) {
      const token = parts.slice(1).join("-");
      if (theme.colors[token]) {
        return { "background-color": theme.colors[token] };
      }
    }

    if (parts[0] === "opacity" && parts.length === 2 && isNumericToken(parts[1])) {
      const value = Math.max(0, Math.min(100, Number(parts[1])));
      return { opacity: String(value / 100) };
    }

    return null;
  }

  function resolveBorder(parts, utility) {
    if (utility === "border") {
      return {
        "border-width": "1px",
        "border-style": "solid",
        "border-color": theme.colors.mist
      };
    }

    if (parts[0] === "border" && parts.length >= 2) {
      const token = parts.slice(1).join("-");

      if (theme.colors[token]) {
        return {
          "border-width": "1px",
          "border-style": "solid",
          "border-color": theme.colors[token]
        };
      }

      if (isNumericToken(token)) {
        return {
          "border-width": token === "0" ? "0" : token + "px",
          "border-style": "solid",
          "border-color": theme.colors.mist
        };
      }
    }

    if (utility === "rounded") {
      return { "border-radius": theme.radii.DEFAULT };
    }

    if (parts[0] === "rounded" && parts.length >= 2) {
      const token = parts.slice(1).join("-");

      if (theme.radii[token]) {
        return { "border-radius": theme.radii[token] };
      }

      if (isNumericToken(token)) {
        return { "border-radius": token === "0" ? "0" : token + "px" };
      }
    }

    if (utility === "shadow") {
      return { "box-shadow": theme.shadows.md };
    }

    if (parts[0] === "shadow" && theme.shadows[parts[1]]) {
      return { "box-shadow": theme.shadows[parts[1]] };
    }

    return null;
  }

  function resolveMisc(utility, parts) {
    if (utility === "overflow-hidden") {
      return { overflow: "hidden" };
    }

    if (parts[0] === "d" && parts.length === 2) {
      return { display: parts[1] };
    }

    if (parts[0] === "fw" && parts.length === 2) {
      return { "font-weight": parts[1] };
    }

    if (parts[0] === "fs" && parts.length === 2 && isNumericToken(parts[1])) {
      return { "font-size": parts[1] + "px" };
    }

    if (parts[0] === "br" && parts.length === 2) {
      const radius = resolveLength(parts[1], "width");
      if (radius) {
        return { "border-radius": radius };
      }
    }

    return null;
  }

  function resolveUtility(className) {
    const utility = className.slice(5);
    const parts = utility.split("-").filter(Boolean);

    if (!parts.length) {
      return null;
    }

    const resolvers = [
      function () {
        return resolveSpacing(parts);
      },
      function () {
        return resolveGap(parts);
      },
      function () {
        return resolveDisplay(utility, parts);
      },
      function () {
        return resolveSizing(parts);
      },
      function () {
        return resolveText(parts);
      },
      function () {
        return resolveFont(parts, utility);
      },
      function () {
        return resolveColors(parts);
      },
      function () {
        return resolveBorder(parts, utility);
      },
      function () {
        return resolveMisc(utility, parts);
      }
    ];

    for (let index = 0; index < resolvers.length; index += 1) {
      const properties = resolvers[index]();
      if (properties) {
        return createDeclarationBlock(properties);
      }
    }

    return null;
  }

  function ensureStyleTag(doc) {
    if (!doc || !doc.head) {
      return null;
    }

    if (!styleTag || styleTag.ownerDocument !== doc) {
      styleTag = doc.createElement("style");
      styleTag.id = "chai-runtime";
      doc.head.appendChild(styleTag);
    }

    return styleTag;
  }

  function escapeClassName(className) {
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      return CSS.escape(className);
    }

    return className.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
  }

  function getClassNodes(root) {
    const nodes = [];

    if (root && root.nodeType === 1 && root.classList) {
      nodes.push(root);
    }

    if (root && typeof root.querySelectorAll === "function") {
      root.querySelectorAll("[class]").forEach(function (node) {
        nodes.push(node);
      });
    }

    return nodes;
  }

  function getCssText() {
    return Array.from(generatedUtilities.entries())
      .map(function (entry) {
        return "." + escapeClassName(entry[0]) + " { " + entry[1] + " }";
      })
      .join("\n");
  }

  function refresh(root) {
    const target = root || getDocument();
    const doc = getDocument(target);

    if (!target || !doc) {
      return generatedUtilities.size;
    }

    let shouldRender = false;

    getClassNodes(target).forEach(function (node) {
      node.classList.forEach(function (className) {
        if (!className.startsWith("chai-") || generatedUtilities.has(className)) {
          return;
        }

        const declarations = resolveUtility(className);
        if (!declarations) {
          return;
        }

        generatedUtilities.set(className, declarations);
        shouldRender = true;
      });
    });

    if (shouldRender) {
      const tag = ensureStyleTag(doc);
      if (tag) {
        tag.textContent = getCssText();
      }
    }

    return generatedUtilities.size;
  }

  return {
    refresh: refresh,
    theme: theme,
    referenceGroups: referenceGroups,
    getCssText: getCssText
  };
});

