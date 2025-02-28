const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")

const app = express()

app.use(cors())
app.use(cors({ origin: "*" })); 
app.use(express.json())

mongoose.connect("mongodb+srv://harshini20:123890@cluster0.163pz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("DB Connected")
}).catch(() => {
    console.log("DB Not Connected")
})

const bulkmail = mongoose.model("bulkmail", {}, "bulkmail")

app.post("/sendemail", (req, res) => {
    var msg = req.body.msg
    var sub = req.body.sub
    var emailData = req.body.emailData


    bulkmail.find().then((item) => {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: item[0].toJSON().user,
                pass: item[0].toJSON().pass
            }
        })
    
        new Promise(async (resolve, reject) => {
    
            try {
                for (var i = 0; i < emailData.length; i++) {
                    await transport.sendMail(
                        {
                            from: "harshiniganesan20@gmail.com",
                            to: emailData[i],
                            subject: sub,
                            text: msg
                        },
    
                    )
                }
                resolve("Success")
    
            }
            catch (error) {
                reject("Failed")
    
            }
    
        }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    
    
        
    }).catch(() => {
        console.log("Error")
    })
    
  
})

app.get("/", (req, res) => {
    res.send("Server Started")
})

app.listen(5001, () => {
    console.log("Server Started")

})