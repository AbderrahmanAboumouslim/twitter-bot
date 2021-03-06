const puppeteer = require('puppeteer');
const username = 'username_or_email';
const password = 'password_here';

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
  await page.keyboard.press('Enter');
  await page.waitFor(2000);
  await page.type('input[name="password"]', password, { delay: 25 });

  await page.click('div[data-testid="LoginForm_Login_Button"]');
  await page.waitFor(2000);

  await page.waitFor('input[data-testid="SearchBox_Search_Input"]');
  await page.type(
    'input[data-testid="SearchBox_Search_Input"]',
    '#TATGivingDays',
    { delay: 25 }
  );
  await page.keyboard.press('Enter');
  await page.waitFor(10000);

  //   await page.click(
  //     'a[class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1niwhzg r-1loqt21 r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu"]'
  //   );
  //   await page.waitFor(3000);

  //   click follow
  //   await page.click('div[data-testid="1004047982310772736-follow"]');
  //   await page.waitFor(2000);

  //SCROLL DOWN + GET AUTHORS
  let authorsSet = new Set();
  try {
    let previousHeight;
    for (let i = 0; i < 10; i++) {
      const elementHandles = await page.$$(
        'a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1loqt21.r-1pi2tsx.r-1ny4l3l.r-o7ynqc.r-6416eg.r-13qz1uu'
      );
      const propertyJsHandles = await Promise.all(
        elementHandles.map(handle => handle.getProperty('href'))
      );
      const urls = await Promise.all(
        propertyJsHandles.map(handle => handle.jsonValue())
      );

      urls.forEach(item => authorsSet.add(item));

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(4000);
    }
  } catch (e) {
    console.log(e);
  }
  //   console.log('-----');
  //   console.log(authorsSet);

  // VISIT ALL AUTHORS AND CLICK FOLLOW BUTTON
  const urls = Array.from(authorsSet);
  for (let i = 0; i < urls.length; i++) {
    try {
      const url = urls[i];
      console.log(url);
      await page.goto(`${url}`);

      await page.waitFor(4000);
      await page.click(
        'div[class="css-18t94o4 css-1dbjc4n r-42olwf r-sdzlij r-1phboty r-rs99b7 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr"]'
      );
      await page.waitFor(3000);
      await page.goBack();
    } catch (error) {
      console.error(error);
    }
  }
})();
