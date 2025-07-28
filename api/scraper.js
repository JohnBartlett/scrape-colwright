const chromium = require('@sparticuz/chromium');
const { chromium: playwrightChromium } = require('playwright-core');

module.exports = async (req, res) => {
  const browser = await playwrightChromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();

  // (Uncomment/adapt if login required)
  
  await page.goto('https://www.colwright.com/login');
  await page.type('input[name="username"]', process.env.COLWRIGHT_USERNAME);
  await page.type('input[name="password"]', process.env.COLWRIGHT_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  

  await page.goto('https://www.colwright.com/inventory', { waitUntil: 'networkidle' });

  const results = [];
  let hasNextPage = true;
  let pageNum = 1;

  while (hasNextPage) {
    await page.waitForSelector('table'); // adjust selector if needed

    // ==== MAIN EXTRACTION LOGIC FOR ONE PAGE ====
    const rows = await page.$$('table tr[data-id]'); // Adjust selector!

    for (const row of rows) {
      // Extract fields for this row
      const fields = await row.$$eval('td', tds => tds.map(td => td.textContent.trim()));
      const rowId = await row.getAttribute('data-id');
      let images = [];

      // ---- Find and click the paperclip (attachment) icon to open modal (adjust selector!)
      const paperclip = await row.$('.fa-paperclip'); // Adjust if needed
      if (paperclip) {
        await paperclip.click();
        await page.waitForSelector('.modal.show', { timeout: 2000 }).catch(() => {});

        // ---- Click on "Images" or "Photos" tab in modal...
        // Try both text variations! Adjust selector for your modal tabs.
        let tabClicked = false;
        try {
          await page.click('.modal .nav-link:has-text("Images")');
          tabClicked = true;
        } catch {
          try {
            await page.click('.modal .nav-link:has-text("Photos")');
            tabClicked = true;
          } catch {}
        }

        if (tabClicked) {
          await page.waitForSelector('.modal .tab-pane.active img', { timeout: 1000 }).catch(() => {});
          // Get all thumbnails in the active tab
          const imgThumbs = await page.$$('.modal .tab-pane.active img');
          for (let i = 0; i < imgThumbs.length; i++) {
            await imgThumbs[i].click();
            await page.waitForTimeout(300);

            // Try to get the large image (adjust selector as needed)
            const largeImg = await page.$('.modal img.full-size, .modal .image-preview img, .modal img');
            if (largeImg) {
              const src = await largeImg.getAttribute('src');
              if (src && !images.includes(src)) images.push(src);
            }
          }
        }

        // ---- Close modal
        const closeBtn = await page.$('.modal .close, .modal [aria-label="Close"]');
        if (closeBtn) await closeBtn.click();
        await page.waitForTimeout(200); // wait for modal to close
      }

      results.push({
        id: rowId,
        fields,
        images,
      });
    }

    // ==== PAGINATE IF POSSIBLE ====
    const nextBtn = await page.$('ul.pagination li.next:not(.disabled) a');
    if (nextBtn) {
      await nextBtn.click();
      pageNum++;
      await page.waitForTimeout(800);
    } else {
      hasNextPage = false;
    }
  }

  await browser.close();

  res.status(200).json({ records: results });
};