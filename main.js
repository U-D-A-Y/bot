const puppeteer = require('puppeteer');
const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => {
  res.json('end point is correct')
})

app.post('/api/send', (req, res) => {
  console.log(req.body)
  res.json('send')
})

app.listen(3000, () => {
  console.log('Server is running')
  runPuppeteer();
})



async function runPuppeteer() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.653228.com');
  await page.waitFor(1000)
  await page.evaluate(() => {
    window.addEventListener('click', async (e) => {
      console.log(e)
      data={
        type:e.type,
        class:e.target.className,
        id:e.target.id,
        element:e.target.localName
      }
      await fetch('http://localhost:3000/api/send', {
        method: 'POST', 
        // mode: 'no-cors',
        headers: {
          "Content-Type": "application/json"
      },
        body: JSON.stringify(data),
      });
    });
  });
}