import express from "express"

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

async function createServer() {
    const app = express()

    try {
        const { router } = await import("./dist/backend/index.js")
        app.use("/api",router)
    } catch (error) {
        console.error(error)
    }

    app.get("/",(_,res) => {
        res.send("Hello world!")
    })

    app.listen(port, () => {
        console.log(`The application is running at http://localhost:${port}`)
    })
}

createServer()