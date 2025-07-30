import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import fetch from 'node-fetch';


if (!fs.existsSync('images')) fs.mkdirSync('images');

const db = new Database('inventory.db');
db.exec(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  item_id TEXT,
  qty TEXT,
  description TEXT,
  shipper TEXT,
  client TEXT,
  client_url TEXT,
  item_num TEXT,
  po_num TEXT,
  image_url TEXT,
  image_file TEXT
)`);
const insertStmt = db.prepare(`INSERT INTO items
  (date, item_id, qty, description, shipper, client, client_url, item_num, po_num, image_url, image_file)
  VALUES (@date, @item_id, @qty, @description, @shipper, @client, @client_url, @item_num, @po_num, @image_url, @image_file)`);

async function ensureModalClosed(page, i) {
  const modalPresent = await page.evaluate(
    () => !!document.querySelector('.modal.fade.in') || !!document.querySelector('#mdModal.in')
  );
  if (modalPresent) {
    console.warn(`Warning: Modal still present before clicking row ${i + 1}. Forcing Escape...`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () =>
        !document.querySelector('.modal.fade.in') &&
        !document.querySelector('#mdModal.in'),
      {}
    );
  }
}

async function extraAggressiveModalClose(page, i, pageNum) {
  let modalStillOpen = true;

  // 1. Wait for modal to close by any soft method (after click/Escape)
  if (modalStillOpen) console.log("[STAGE 1] Waiting for modal close after click/Escape...");
  try {
    await page.waitForFunction(
      () =>
        !document.querySelector('.modal.fade.in') &&
        !document.querySelector('#mdModal.in'),
      { timeout: 3000 }
    );
    modalStillOpen = false;
  } catch { modalStillOpen = true; }

  // 2. Try clicking body/backdrop
  if (modalStillOpen) {
    console.warn(`[STAGE 2] Modal didn't close for row ${i + 1} (page ${pageNum}). Trying backdrop click...`);
    await page.click('body', { clickCount: 1 });
    try {
      await page.waitForFunction(
        () =>
          !document.querySelector('.modal.fade.in') &&
          !document.querySelector('#mdModal.in'),
        { timeout: 3500 }
      );
      modalStillOpen = false;
    } catch { modalStillOpen = true; }
  }

  // 3. Try a "real" mouse hover/click on the close button
  if (modalStillOpen) {
    console.warn(`[STAGE 3] Modal didn't close after backdrop click for row ${i + 1} (page ${pageNum}). Trying mouse move/click...`);
    const closeBtn = await page.$('.modal.fade.in .close, #mdModal.in .close');
    if (closeBtn) {
      try {
        const box = await closeBtn.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { delay: 150 });
          await new Promise(res => setTimeout(res, 1000));
        }
      } catch (e) {
        console.warn('Mouse move+click on close button failed:', e.message);
      }
    }
    try {
      await page.waitForFunction(
        () =>
          !document.querySelector('.modal.fade.in') &&
          !document.querySelector('#mdModal.in'),
        { timeout: 3000 }
      );
      modalStillOpen = false;
    } catch { modalStillOpen = true; }
  }

  // 4. Last resort: forcibly remove modal from DOM
  if (modalStillOpen) {
    console.error(
      `[STAGE 4] Modal for row ${i + 1} (page ${pageNum}) still stuck after all attempts. Force-removing from DOM.`
    );
    const modalHtml = await page.evaluate(() => {
      const m = document.querySelector('.modal.fade.in,#mdModal.in');
      if (m) {
        const html = m.outerHTML;
        m.remove();
        return html;
      } else {
        return '(none)';
      }
    });
    console.error(`[RESULT] Force-removed modal HTML:`, modalHtml);
    return false;
  }
  return true;
}

async function scrapePage(page, pageNum) {
  await page.waitForSelector('#activeItems table tbody tr');
  const rows = await page.$$('#activeItems table tbody tr');
  console.log(`Scraping ${rows.length} rows from page ${pageNum}.`);
  for (let i = 0; i < rows.length; i++) {
    await new Promise(res => setTimeout(res, 1200));
    await ensureModalClosed(page, i);

    const row = rows[i];
    const columns = await row.$$eval('td', tds => tds.map(td => td.innerText.trim()));
    const clientUrl = await row.$eval('td:nth-child(6) a', a => a.href).catch(() => '');

    // Click row to open modal
    await row.click();

    let modalAppeared = true;
    try {
      await page.waitForSelector('.modal.fade.in,#mdModal.in', { timeout: 10000 });
    } catch (e) {
      console.warn(`Modal did not appear for row ${i + 1} on page ${pageNum}, skipping.`);
      const modalHtml = await page.evaluate(() => {
        const m = document.querySelector('.modal.fade.in,#mdModal.in');
        return m ? m.outerHTML : '(none)';
      });
      console.warn(`Modal HTML after click row ${i + 1}:`, modalHtml);
      modalAppeared = false;
    }
    if (!modalAppeared) continue;

    // Click Images tab if exists
    const imgTabSelector = '.modal.fade.in .imagesTab, #mdModal.in .imagesTab';
    const imgTab = await page.$(imgTabSelector);
    if (imgTab) {
      await imgTab.click();
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // Click image icon if exists
    const imgIcon = await page.$('.modal.fade.in .fa-picture-o, #mdModal.in .fa-picture-o');
    if (imgIcon) {
      await imgIcon.click();
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // Get image URL and download
    let imageUrl = '';
    let imageFile = '';
    const bigImg = await page.$('.modal.fade.in img, #mdModal.in img');
    if (bigImg) {
      imageUrl = await bigImg.evaluate(img => img.src);
      console.log(`Extracted image URL for ${columns[1]} (page ${pageNum}, row ${i + 1}):`, imageUrl);

      if (imageUrl) {
        try {
          const imgRes = await fetch(imageUrl);
          imageFile = `images/item_${columns[1]}.jpg`;
          fs.writeFileSync(imageFile, Buffer.from(await imgRes.arrayBuffer()));
          if (fs.existsSync(imageFile)) {
            console.log('Image saved to:', imageFile);
          } else {
            console.error('File write failed.');
          }
        } catch (e) {
          imageFile = '';
          console.error('Image download failed:', e);
        }
      }
    } else {
      console.log('No image found in modal.');
    }

    // Try to close modal gracefully; fallback to key & aggressive strategies
    const closeBtn = await page.$('.modal.fade.in .close, #mdModal.in .close');
    if (closeBtn) {
      try {
        await closeBtn.click();
        await new Promise(resolve => setTimeout(resolve, 700));
      } catch (e) {
        console.warn('Modal close click failed, trying Escape:', e.message);
        await page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    } else {
      console.warn('No close button found, sending Escape key.');
      await page.keyboard.press('Escape');
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // Aggressive close logic
    const couldClose = await extraAggressiveModalClose(page, i, pageNum);
    if (!couldClose) continue;

    // Store into DB
    insertStmt.run({
      date: columns[0],
      item_id: columns[1],
      qty: columns[2],
      description: columns[3],
      shipper: columns[4],
      client: columns[5],
      client_url: clientUrl,
      item_num: columns[6],
      po_num: columns[7],
      image_url: imageUrl,
      image_file: imageFile
    });

    // Output for verification
    console.log({
      date: columns[0],
      item_id: columns[1],
      qty: columns[2],
      description: columns[3],
      shipper: columns[4],
      client: columns[5],
      client_url: clientUrl,
      item_num: columns[6],
      po_num: columns[7],
      image_url: imageUrl,
      image_file: imageFile,
      image_exists: imageFile && fs.existsSync(imageFile)
    });
  }
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.setViewport({ width: 3840, height: 2160 });

    // LOGIN
    await page.goto('https://www.colwright.com/login/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('iframe');
    let frameHandle = await page.$('iframe');
    let frame = frameHandle ? await frameHandle.contentFrame() : null;
    if (!frame) throw new Error("Iframe not found on initial page load");

    await frame.waitForSelector('input#username', { timeout: 5000 });
    await frame.type('input#username', process.env.EMAIL || 'YOUR_EMAIL', { delay: 120 });
    await frame.waitForSelector('input#password', { timeout: 5000 });
    await frame.type('input#password', process.env.PASSWORD || 'YOUR_PASSWORD', { delay: 160 });

    const loginButton = await frame.$('button[type="submit"], input[type="submit"]');
    if (loginButton) {
      await loginButton.click();
      console.log("Clicked login button.");
    } else {
      await frame.focus('input#password');
      await page.keyboard.press('Enter');
      console.log("Pressed Enter to submit login.");
    }
    await new Promise(resolve => setTimeout(resolve, 3500));

    // --- SCRAPE ONLY PAGE 1 WITH 500 ITEMS ---
   
    await page.goto('https://www.colwright.com/inventory?items=500&page=1', { waitUntil: 'networkidle2' });

console.log('Now at:', page.url());
if (page.url().includes('login')) {
  console.error('Login failed or session expired! Aborting script.');
  process.exit(1);
}
const pageText = await page.content();
console.log('First ~500 chars:', pageText.slice(0, 500));

await scrapePage(page, 1);
   
    /*  Scrape page 2 if needed
    
    await page.goto('https://www.colwright.com/inventory?items=500&page=2', { waitUntil: 'networkidle2' });

    console.log('Now at:', page.url());
    if (page.url().includes('login')) {
      console.error('Login failed or session expired! Aborting script.');
      process.exit(1);
    }
    const pageText = await page.content();
    console.log('First ~500 chars:', pageText.slice(0, 500));

    await scrapePage(page, 2);
  */
    await browser.close();
    db.close();
    console.log("Done.");
  } catch (error) {
    console.error("An error occurred:", error);
    db.close();
  }
})();
