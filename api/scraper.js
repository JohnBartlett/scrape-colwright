const chromium = require('@sparticuz/chromium');
const { chromium: playwrightChromium } = require('playwright-core');

module.exports = async (req, res) => {
  const browser = await playwrightChromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto('https://www.colwright.com/inventory');
  // TODO: Add login and scraping logic here

  const content = await page.content();
  await browser.close();

  res.status(200).json({ htmlContent: content });
};
