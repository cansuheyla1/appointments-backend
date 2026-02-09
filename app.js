
const express = require("express")
const cors = require("cors")
const appointmentsRoutes = require("./routes/appointments")

const app = express()

app.use(cors()) // başka porttan gelen isteklere izin ver
app.use(express.json())

app.get("/" , (req,res) => {
    res.send("backend is running")
})

app.get("/api/health", (req,res) => {
    res.json({status: "ok"})
})

app.use("/api/appointments", appointmentsRoutes)



app.listen(3000, () => {
    console.log("Listening for requests on port 3000")
})
