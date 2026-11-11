import sys, json, os, asyncio
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)

async def main(keys, png=True, pdf=True):
    results = {}
    async with async_playwright() as pw:
        br = await pw.chromium.launch()
        ctx = await br.new_context(viewport={'width': 2600, 'height': 1500}, device_scale_factor=1)
        page = await ctx.new_page()
        msgs = []
        page.on('console', lambda m: msgs.append(m.text))
        page.on('pageerror', lambda e: msgs.append('PAGEERROR ' + str(e)))
        await page.goto('file://' + os.path.join(HERE, 'index.html'))
        await page.evaluate("Promise.all([400,500,600,700].map(w => document.fonts.load(w + ' 16px \"Inter TT\"')))")
        await page.evaluate('document.fonts.ready')
        print('fonts ok:', await page.evaluate("[400,500,600,700].map(w => document.fonts.check(w + ' 16px \"Inter TT\"'))"))
        for key in keys:
            try:
                info = await page.evaluate(f'window.buildOne("{key}")')
            except Exception as ex:
                print('BUILD ERROR', key, str(ex)[:1500]); continue
            await page.evaluate('document.fonts.ready')
            links = await page.evaluate("""(key) => { const root = document.getElementById('pg-' + key); if (!root) return []; const r0 = root.getBoundingClientRect(); return [...root.querySelectorAll('[data-goto]')].map(e => { const r = e.getBoundingClientRect(); return {goto: +e.dataset.goto, x: r.left - r0.left, y: r.top - r0.top, w: r.width, h: r.height}; }); }""", key)
            info['links'] = links
            results[key] = info
            print(f"== {key}: {info['w']}x{info['h']}  tasks={len(info['tasks'])}  warns={len(info['warns'])}")
            for w in info['warns']:
                print('   WARN', w)
            if png:
                await page.set_viewport_size({'width': info['w'], 'height': info['h']})
                await page.evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))')
                await page.wait_for_timeout(250)
                el = await page.query_selector('#pg-' + key)
                await el.screenshot(path=os.path.join(OUT, key + '.png'))
            if pdf:
                await page.add_style_tag(content=f"@page{{size:{info['w']}px {info['h']}px;margin:0}} html,body{{width:{info['w']}px;height:{info['h']}px;overflow:hidden}}")
                await page.pdf(path=os.path.join(OUT, key + '.pdf'), width=f"{info['w']}px", height=f"{info['h']}px", print_background=True, margin={'top':'0','right':'0','bottom':'0','left':'0'}, prefer_css_page_size=True)
        for m in msgs:
            print('CONSOLE', m[:300])
        await br.close()
    json.dump(results, open(os.path.join(OUT, 'results.json'), 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    keys = [a for a in sys.argv[1:] if not a.startswith('--')]
    asyncio.run(main(keys, png='--nopng' not in sys.argv, pdf='--pdf' in sys.argv))
