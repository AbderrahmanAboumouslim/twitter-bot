import { puppeteer } from 'puppeteer';

const username = 'test_name';
const password = 'abd.dkd.dk';

let browser = null;
let page = null;

(async () => {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 800,
    isMobile: false,
  });

  await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });

  await page.type('input[name="text"]', username, { delay: 25 });
  await page.type('input[name="password"]', password, { delay: 25 });
})();
