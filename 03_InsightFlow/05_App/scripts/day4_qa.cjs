const { chromium } = require("playwright");
const path = require("node:path");
(async()=>{
 const errors=[];const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});const page=await browser.newPage({viewport:{width:1440,height:1080}});
 page.on("console",m=>{if(m.type()==="error")errors.push(`console:${m.text()}`)});page.on("pageerror",e=>errors.push(`pageerror:${e}`));
 await page.goto("http://127.0.0.1:3000/dashboard",{waitUntil:"networkidle"});
 await page.getByRole("heading",{name:"Dashboard"}).waitFor();await page.screenshot({path:"artifacts/dashboard.png",fullPage:true});
 await page.getByRole("link",{name:"New Analysis"}).click();await page.waitForURL("**/projects/new");await page.getByRole("button",{name:"Continue"}).click();await page.waitForURL("**/projects/new/upload");
 await page.locator('input[type="file"]').setInputFiles(path.resolve("../04_Data/demo_feedback.csv"));await page.getByText("120 rows detected").waitFor();await page.getByRole("button",{name:/Continue to Mapping/}).click();await page.waitForURL("**/projects/new/mapping");
 if(!(await page.getByRole("button",{name:"Start AI Analysis"}).isEnabled()))throw new Error("mapping CTA disabled");await page.getByRole("button",{name:"Start AI Analysis"}).click();await page.waitForURL("**/processing");await page.getByRole("heading",{name:"Analysis Complete"}).waitFor({timeout:10000});await page.getByRole("link",{name:"View Analysis"}).click();
 await page.waitForURL("**/projects/nova-v32/analysis");await page.getByRole("button",{name:"Feedback"}).click();await page.getByText("Search can't find pages",{exact:false}).first().click();await page.getByText("AI Structured Output").waitFor();
 await page.goto("http://127.0.0.1:3000/pain-points/search-experience",{waitUntil:"networkidle"});await page.getByRole("link",{name:/View all 186 evidence/}).click();await page.getByRole("heading",{name:"Supporting Evidence"}).waitFor();
 await page.goto("http://127.0.0.1:3000/requirements/search-optimization",{waitUntil:"networkidle"});await page.locator('input[type="range"]').fill("30");await page.getByText("Business Value: 30").waitFor();await page.locator("select").selectOption("P0");await page.getByText("P0 · Manual Override").waitFor();
 await page.goto("http://127.0.0.1:3000/prd/search-optimization",{waitUntil:"networkidle"});await page.getByRole("heading",{name:"Source Context"}).waitFor();if(!(await page.getByRole("button",{name:"Regenerate"}).isDisabled()))throw new Error("regenerate enabled");await page.screenshot({path:"artifacts/prd.png",fullPage:true});
 await browser.close();console.log(JSON.stringify({status:"ok",consoleErrors:errors}));if(errors.length)process.exit(2);
})().catch(e=>{console.error(e);process.exit(1)});
