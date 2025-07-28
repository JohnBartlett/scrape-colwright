const chromium = require('@sparticuz/chromium');
const { chromium: playwrightChromium } = require('playwright-core');

module.exports = async (req, res) => {
  // For manual debugging of serverless timeout (remove later)
  // setTimeout(() => { throw new Error("Manual timeout"); }, 55000);

  console.log('Launching browser');
  const browser = await playwrightChromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  // ------------ LOGIN ------------
  console.log('Navigating to login page');
  await page.goto('https://www.colwright.com/login', { waitUntil: 'networkidle' });

  // Take a screenshot for debugging
  await page.screenshot({ path: '/tmp/login-page.png' });
  console.log('Screenshot taken: /tmp/login-page.png');

  console.log('Waiting for username input');
  await page.waitForSelector('input[name="username"]', { timeout: 60000 }); // Increase timeout

  console.log('Filling in credentials');
  await page.fill('input[name="username"]', process.env.COLWRIGHT_USERNAME);
  await page.fill('input[name="password"]', process.env.COLWRIGHT_PASSWORD);
  console.log('Submitting login and waiting for navigation');
  // Use Promise.all to guard against missed navigation events.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);
  console.log('Login completed / redirected');

  // ------------ INVENTORY PAGE ------------
  console.log('Loading inventory');
  await page.goto('https://www.colwright.com/inventory', { waitUntil: 'networkidle' });

  await page.waitForSelector('table', { timeout: 8000 }); // Adjust selector if needed
  console.log('Table loaded');

  const results = [];
  const rows = await page.$$('table tr[data-id]'); // Adjust selector to match your table rows

  if (!rows.length) {
    console.log('No data rows found!');
  }

  // ------------- LIMIT TO FIRST ROW FOR TESTING TIMEOUTS -------------
  // Remove or increase this for production!
  for (let r = 0; r < Math.min(1, rows.length); r++) {
    const row = rows[r];
    console.log(`Processing row ${r}`);

    // Extract just cell text for now, you can add more fields as needed
    const fields = await row.$$eval('td', tds => tds.map(td => td.textContent.trim()));
    const rowId = await row.getAttribute('data-id');
    let images = [];

    // Try paperclip/modal (adjust selector as needed)
    const paperclip = await row.$('.fa-paperclip'); // Update this if your page uses a different class!
    if (paperclip) {
      console.log('Found paperclip, clicking...');
      await paperclip.click();
      await page.waitForSelector('.modal.show', { timeout: 4000 }).catch(() => console.log('Modal did not open in time'));

      // Try "Images" or "Photos" tab
      let tabClicked = false;
      try {
        await page.click('.modal .nav-link:has-text("Images")');
        tabClicked = true;
      } catch (e) {
        try {
          await page.click('.modal .nav-link:has-text("Photos")');
          tabClicked = true;
        } catch (e2) {
          console.log('Images/Photos tab not found');
        }
      }
      if (tabClicked) {
        await page.waitForSelector('.modal .tab-pane.active img', { timeout: 1500 }).catch(() => {});
        const imgThumbs = await page.$$('.modal .tab-pane.active img');
        for (let i = 0; i < imgThumbs.length; i++) {
          await imgThumbs[i].click();
          await page.waitForTimeout(200);
          // Grab the largest image (adjust selector for your modal)
          const largeImg = await page.$('.modal img.full-size, .modal .image-preview img, .modal img');
          if (largeImg) {
            const src = await largeImg.getAttribute('src');
            if (src && !images.includes(src)) images.push(src);
          }
        }
      }
      // Close modal (adjust selector as needed)
      const closeBtn = await page.$('.modal .close, .modal [aria-label="Close"]');
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(200);
    } else {
      console.log('No paperclip found in row');
    }

    // Add to results, one row only for now
    results.push({
      id: rowId,
      fields,
      images,
    });
    // REMOVE this next line if you want more than the first row:
    break;
  }

  await browser.close();
  console.log('Browser closed, returning results');
  res.status(200).json({ records: results });
};
