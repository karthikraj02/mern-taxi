const mongoose =require('mongoose');
const cors =require('cors');
//routes aut
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
//last momemt
const rideRoutes = require('./routes/rideRoutes');
app.use('/api/rides', rideRoutes);


//
//const rideRoutes = require('./routes/rideRoutes');
//app.use('/api/rides', rideRoutes);
//
const express = require('express');
const app = express();   // <--- THIS LINE IS MISSING

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/taxiapp',
    {
        useNewUrlParser:true,useUnifiedTopology:true
    }).then(() => console.log('Server running on 5000')
);

