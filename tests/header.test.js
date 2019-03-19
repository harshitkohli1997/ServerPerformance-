
const puppeteer = require('puppeteer');

test('Adds two numbers', () => {
    const sum = 1+2;

    expect(sum).toEqual(3);

});

test('we can launch a browser', async () => {
    const browser = await puppeteer.launch({
        headless:false
    });
    const page = await browser.newPage();
});
//chromium is instance of web browser and puppeteer starts up chromium