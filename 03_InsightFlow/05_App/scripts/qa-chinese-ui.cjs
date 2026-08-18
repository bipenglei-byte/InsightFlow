const { chromium } = require("playwright");

const routes = [
  "/dashboard",
  "/projects",
  "/projects/new",
  "/projects/new/upload",
  "/projects/new/mapping",
  "/processing",
  "/projects/nova-v32/analysis",
  "/pain-points/search-experience",
  "/evidence/search-experience",
  "/requirements",
  "/requirements/search-optimization",
  "/prd/search-optimization",
  "/states",
];

const forbidden = [
  "Dashboard",
  "Projects",
  "Requirements",
  "New Analysis",
  "New Project",
  "Upload Dataset",
  "Field Mapping",
  "Supporting Evidence",
  "Priority Score",
  "Business Value",
  "Manual Priority",
  "Generate Opportunity",
  "Source Context",
  "Demo Mode",
  "Live AI draft",
  "Completed with errors",
];

const screenshots = {
  "/dashboard": "01_dashboard.png",
  "/projects/new/upload": "02_upload.png",
  "/processing": "03_processing.png",
  "/projects/nova-v32/analysis": "04_analysis.png",
  "/pain-points/search-experience": "05_pain_point.png",
  "/evidence/search-experience": "06_evidence.png",
  "/requirements": "07_requirements.png",
  "/requirements/search-optimization": "08_priority.png",
  "/prd/search-optimization": "09_prd.png",
  "/states": "10_evaluation.png",
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const failures = [];

  for (const route of routes) {
    await page.goto(`http://localhost:3030${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.locator("main").waitFor({ state: "visible", timeout: 60000 });
    const text = await page.locator("body").innerText();
    const found = forbidden.filter((copy) => text.includes(copy));
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((element) => {
          const style = getComputedStyle(element);
          return (
            style.overflowX === "visible" &&
            element.scrollWidth > element.clientWidth + 4 &&
            element.clientWidth > 0
          );
        })
        .slice(0, 5)
        .map((element) => `${element.tagName}.${element.className}`),
    );
    if (found.length || overflow.length) {
      failures.push({ route, found, overflow });
    }
    if (screenshots[route]) {
      await page.screenshot({
        path: `../06_Demo/screenshots/${screenshots[route]}`,
        fullPage: true,
      });
    }
    console.log(`${route} OK`);
  }
  await browser.close();

  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }
  console.log(`CHINESE_UI_ROUTES=${routes.length}`);
  console.log("FORBIDDEN_UI_COPY=0");
  console.log("LAYOUT_OVERFLOW=0");
})();
