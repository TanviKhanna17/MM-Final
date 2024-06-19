import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number // this value is optional ho bhi sakti hai aur nahi bhi lekin aagr ayegi toh number format me hi
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> { // yeh connection method kuch return karega, yeh hoga promise

    if (connection.isConnected)
    {
        console.log("Already connected to databse");
        return
    }

    // in case connection nahi huya to
    try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || '', {}) // agar connection nahi hai toh empty string
        connection.isConnected = db.connections[0].readyState // kya database connection fully ready hain?
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("DB Connection failed", error);
        process.exit(1)
        
    }
}

export default dbConnect;
