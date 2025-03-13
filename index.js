import express from "express"
import fs from "node:fs"

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const baseUrl = process.env.BASE_URL || '/'

const productionTemplate = isProduction? await fs.promises.readFile('./dist/client/index.html', 'utf-8') : ""

const app = express()

try {
    const { router } = await import("./dist/backend/index.js")
    app.use(`${baseUrl}/api`,router)
} catch (error) {
    console.error(error)
}

let vite;
if ( isProduction ) {
    const { default: compression} = await import('compression')
    const { default: sirv } = await import('sirv')
    app.use(compression())
    app.use(baseUrl, sirv('./dist/client', { extensions: [] }))
} else {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base: baseUrl,
    })
    app.use(vite.middlewares)
}

app.get(`${baseUrl}/*`, async (req,res) => {
    try {
        const url = req.originalUrl.replace(baseUrl, '')
    
        let template, render;
        if (isProduction) {
            template = productionTemplate
            render = (await import('./dist/server/entry-server.js')).render
        } else {
            template = await fs.promises.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/frontend/app/entry-server.jsx')).render
        }
    
        const rendered = await render(url)
    
        const html = template
          .replace(`<!--app-head-->`, rendered.head ?? '')
          .replace(`<!--app-html-->`, rendered.html ?? '')
    
        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
      } catch (error) {
        vite?.ssrFixStacktrace(error)
        console.error(error)
        res.status(500).end()
      }
})

app.listen(port, () => {
    console.log(`The application is running at http://localhost:${port}${baseUrl}`)
})