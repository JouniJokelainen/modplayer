import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const ctx = await browser.newContext()
const page = await ctx.newPage()

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(err.message))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 })

await mkdir('scripts/screenshots', { recursive: true })

await page.screenshot({ path: 'scripts/screenshots/01-initial.png', fullPage: false })
console.log('Screenshot 1: initial load')

try {
  await page.waitForSelector('aside ul li button', { timeout: 15000 })
  console.log('Creators loaded')
  await page.screenshot({ path: 'scripts/screenshots/02-creators-loaded.png', fullPage: false })

  // Search for a small creator folder
  await page.fill('input[placeholder="FILTER ARTISTS..."]', '4-mat')
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'scripts/screenshots/03-search.png', fullPage: false })

  const firstCreator = await page.locator('aside ul li button').first()
  const creatorName = await firstCreator.textContent()
  console.log('Clicking creator:', creatorName?.trim())
  await firstCreator.click()

  await page.waitForSelector('main ul li button', { timeout: 15000 })
  await page.screenshot({ path: 'scripts/screenshots/04-tracks.png', fullPage: false })
  console.log('Tracks loaded')

  const firstTrack = await page.locator('main ul li button').first()
  const trackName = await firstTrack.textContent()
  console.log('Clicking track:', trackName?.trim())
  await firstTrack.click()

  // Give audio engine time to init + load
  await page.waitForTimeout(4000)
  await page.screenshot({ path: 'scripts/screenshots/05-playing.png', fullPage: false })
  console.log('Screenshot 5: after play click')

  // Test spacebar pause
  await page.keyboard.press('Space')
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'scripts/screenshots/06-paused.png', fullPage: false })
  console.log('Screenshot 6: after spacebar pause')

} catch (e) {
  console.error('Interaction error:', e.message)
  await page.screenshot({ path: 'scripts/screenshots/error.png', fullPage: false })
}

if (errors.length) {
  console.log('\nConsole errors:')
  errors.forEach((e) => console.log(' -', e))
} else {
  console.log('\nNo console errors')
}

await browser.close()
