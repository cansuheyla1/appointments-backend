
const express = require("express")
const router = express.Router()

let appointments = [
  { date:"2026-02-10", time:"10:00", status:"booked" },
  { date:"2026-02-10", time:"10:30", status:"cancelled" },
  { date:"2026-02-10", time:"11:00", status:"booked" }
]


router.get("/test", (req,res) => {
    res.json({test: "okay"})
})

router.get("/slots", (req,res) => { 
    let startHour = 10*60
    let endHour = 17*60
    let interval = 30
    let slot = ""
    let slots = []
    for (; startHour<endHour; startHour += interval){
        const hour = Math.floor(startHour/60) 
        const minute = startHour%60
        let formattedHour = ""
        let formattedMinute = ""
        formattedHour = String(hour).padStart(2,"0")
        formattedMinute = String(minute).padStart(2,"0")
        slot = formattedHour + ":" + formattedMinute
        slots.push(slot)
    }
    const date = req.query.date
    if (!date) {return res.status(400).send("Date is required!")}
    else {
        let bookedAppointments = appointments.filter(a => a.date == date && a.status == "booked")
        let bookedTimes = bookedAppointments.map(a => a.time)
        let availableSlots = slots.filter(s => !bookedTimes.includes(s))
        return res.json(availableSlots)
    }
})

router.post("/", (req,res) => {
    let name = req.body.name
    let email = req.body.email
    let date = req.body.date
    let time = req.body.time
    let note = req.body.note
    if (!date || !time || !name || !email) { return res.status(400).send("error") } 
    let isAlreadyBooked = appointments.some(a => a.date===date && a.time===time && a.status==="booked")
    if (isAlreadyBooked) 
        { return res.status(409).send("The slot is already booked")}
    
    let newAppointment = {id: Date.now().toString(), name: name, email: email, date: date, time: time,
         note: note, status:"booked", createdAt: new Date()}  
    appointments.push(newAppointment)
    return res.json({success: "appointment created", appointment: newAppointment})  
})

router.get("/", (req,res) => {
    let list = appointments
    let email = req.query.email ? req.query.email : null
    if (email) { list = list.filter(a => a.email === email) }
    return res.json(list.sort((a,b) => b.createdAt - a.createdAt))
})

router.delete("/:id", (req,res) => {
    let id = req.params.id
    let appointment = appointments.find(a => a.id === id)
    if (appointment) {
        appointment.status = "cancelled"
        return res.json({message: "cancelled", appointment})
    }
    else { return res.status(404).send("error") }
})

module.exports = router