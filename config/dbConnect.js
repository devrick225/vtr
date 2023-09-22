const mongoose = require('mongoose')
const dbConnect = async() => {
    try {
        await mongoose.connect(
            process.env.MONGO_URL,
            { useNewUrlParser: true, useUnifiedTopology: true}
        );
        console.log('DB Connected Successfully')
    }catch (error){
        console.log('DB Connection failed : ', error.message)
    }
};

dbConnect();
