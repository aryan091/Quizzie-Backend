const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config()
const userRoute = require('./src/routes/user.routes')
const quizRoute = require('./src/routes/quiz.routes')
const pollRoute = require('./src/routes/poll.routes')

const app = express()

const port = process.env.PORT || 3000

app.use(cors(
    { origin: "*", credentials: true }
));
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user",userRoute)
app.use("/api/v1/quiz",quizRoute)
app.use("/api/v1/poll",pollRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/health', (req, res) => {
    console.log(`Server is up... ${process.env.PORT} :)`)
    res.json({ 
        service:'Quizzie Backend Server',
        status:'ACTIVE',
        time:new Date() 
})
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'path/to/index.html'));
  });
  


app.listen(port, () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log(`Server is up on ${process.env.PORT} :)`))
        .catch((error) => console.log(error));
    });

