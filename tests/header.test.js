
const puppeteer = require('puppeteer');
let browser,page;
//call automatically for all test cases

beforeEach(async () => {
     browser = await puppeteer.launch({
        headless:false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

//call automatically after all test cases
afterEach(async() => {
    await browser.close();
})
test('header has the correct test', async () => {
    

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});
//chromium is instance of web browser and puppeteer starts up chromium

test('clicking logging launch the login flow', async() => {
    await page.click('.right a');

    const url  = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});