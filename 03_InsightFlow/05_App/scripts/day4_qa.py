from pathlib import Path
from playwright.sync_api import sync_playwright

base = "http://127.0.0.1:3000"
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1080})
    page.on("console", lambda msg: errors.append(f"console:{msg.type}:{msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(f"pageerror:{exc}"))

    page.goto(base + "/dashboard", wait_until="networkidle")
    assert page.get_by_role("heading", name="Dashboard").is_visible()
    assert page.get_by_text("1,248", exact=True).first.is_visible()
    page.screenshot(path="artifacts/dashboard.png", full_page=True)

    page.get_by_role("link", name="New Analysis").click()
    page.wait_for_url("**/projects/new")
    assert page.get_by_role("heading", name="Create Project").is_visible()
    page.get_by_role("button", name="Continue").click()
    page.wait_for_url("**/projects/new/upload")
    page.locator('input[type="file"]').set_input_files(str(Path("../04_Data/demo_feedback.csv").resolve()))
    assert page.get_by_text("120 rows detected").is_visible()
    page.get_by_role("button", name="Continue to Mapping").click()
    page.wait_for_url("**/projects/new/mapping")
    assert page.get_by_role("button", name="Start AI Analysis").is_enabled()
    page.get_by_role("button", name="Start AI Analysis").click()
    page.wait_for_url("**/processing")
    page.wait_for_timeout(4500)
    assert page.get_by_role("heading", name="Analysis Complete").is_visible()
    page.get_by_role("link", name="View Analysis").click()
    page.wait_for_url("**/projects/nova-v32/analysis")
    page.get_by_role("button", name="Feedback").click()
    page.get_by_text("Search can't find pages", exact=False).first.click()
    assert page.get_by_text("AI Structured Output").is_visible()

    page.goto(base + "/pain-points/search-experience", wait_until="networkidle")
    assert page.get_by_text("Supporting Evidence").is_visible()
    page.get_by_role("link", name="View all 186 evidence").click()
    assert page.get_by_role("heading", name="Supporting Evidence").is_visible()

    page.goto(base + "/requirements/search-optimization", wait_until="networkidle")
    slider = page.locator('input[type="range"]')
    slider.fill("30")
    assert page.get_by_text("Business Value: 30").is_visible()
    page.locator("select").select_option("P0")
    assert page.get_by_text("P0 · Manual Override").is_visible()

    page.goto(base + "/prd/search-optimization", wait_until="networkidle")
    assert page.get_by_role("heading", name="Source Context").is_visible()
    assert page.get_by_role("button", name="Regenerate").is_disabled()
    page.screenshot(path="artifacts/prd.png", full_page=True)

    browser.close()

print({"status": "ok", "console_errors": errors})
assert not errors, errors
