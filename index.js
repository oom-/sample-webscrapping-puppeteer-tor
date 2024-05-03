/* -------------------------------------------------------------------------- */
/* --------------------------------- OPTIONS -------------------------------- */
/* -------------------------------------------------------------------------- */

const TORProxy = "127.0.0.1:9050";
const TORControlHost = "127.0.0.1";
const TORControlPort = 9051;
const TORControlPasswd = "giraffe";

/* -------------------------------------------------------------------------- */
/* ---------------------------- TOR Renew session --------------------------- */
/* -------------------------------------------------------------------------- */
const net = require("net");
const { PuppeteerNode } = require("puppeteer");

async function renewTorSession() {
  return new Promise((res) => {
    console.log("Renewing Tor session...");
    let client = new net.Socket();
    client.connect(TORControlPort, TORControlHost, () => {
      client.write(`authenticate "${TORControlPasswd}"\nsignal newnym\nquit\n`);
    });
    //need to consume else socket blocks
    client.on("data", (data) => {
      console.log(data.toString().trim());
    });
    client.on("close", () => {
      console.log("Renewing Tor session OK");
      res();
    });
  });
}

/* -------------------------------------------------------------------------- */
/* --------------------------------- SCRIPT --------------------------------- */
/* -------------------------------------------------------------------------- */
/** @type PuppeteerNode */
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

puppeteer.launch({ args: ["--proxy-server=socks5://" + TORProxy], headless: false }).then(async (browser) => {
  console.log("Running tests..");
  const page = await browser.newPage();
  await page.goto("https://api.ipify.org");
  await page.waitForSelector("pre");
  await page.screenshot({ path: "testresult.png", fullPage: true });
  await renewTorSession();
  await page.goto("http://monip.org/");
  await page.waitForNetworkIdle();
  await page.screenshot({ path: "testresult2.png", fullPage: true });
  await browser.close();
  console.log(`All done, check the screenshot. ✨`);
});
