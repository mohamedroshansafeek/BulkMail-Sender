const express = require("express")
const cors = require("cors")
const app = express()
//Install NODEMAILER
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "https://bulk-mail-sender-gamma.vercel.app"
}))
app.use(express.json())

mongoose.connect("mongodb+srv://safeek:safeek2004@cluster0.mhpx8vn.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
  console.log("Connected to DB")
}).catch(function(){
  console.log("Failed to connect")
})

const credential = mongoose.model("credential",{},"bulkmail")

app.post("/sendemail",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){
  
  const transport = nodemailer.createTransport({
    service:"gmail",
    auth: {
      //TODO: replace 'user' and 'pass' values from <https://forwardemail.net>
      user: data[0].toJSON().user,
      pass: data[0].toJSON().pass,
    }
  })

    new Promise(async function(resolve,reject){
         try{
     for(var i=0;i<emailList.length;i++)
    {
        await transport.sendMail(
    {
        from:"mohamedroshansafeeky@gmail.com",
        to:emailList[i],
        subject:"A message from Bulk Mail App",
        text:msg
    }
    )

    console.log("Email send to :"+emailList[i])
    }

    resolve("Success")
  }

  catch(error)
  {
    reject("Failed")
  }
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })
 
}).catch(function(error){
  console.log(error)
})
//   if(data.length > 0){
//     console.log(data[0])
//   }else{
//     console.log("No documents found in bulkmail collection")
//   }
// }).catch(function(error){
//     console.log(error)
// })
 
})


app.listen(PORT,function(){
    console.log(`Server running on port ${PORT}`)
})