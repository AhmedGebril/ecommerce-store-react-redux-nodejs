const {MongoClient} = require('mongodb')
const schedule = require('node-schedule');
let dbcollection


// Define the job function
// gets the revenue for the current month
const calculateRevenue = async () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const cursor = await dbcollection.collection('sales').find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      },
      status:'not delivered yet' 
    }).toArray();
  
    let totalRevenue = 0;

    await cursor.map((doc) => {
      totalRevenue += doc.totalOrderPrice;
    });
    await dbcollection.collection('revenu').insertOne({Month:month,totalOfMonth:totalRevenue})
}



module.exports = {
    ConnectDb:(cb)=>{
        MongoClient.connect('mongodb://127.0.0.1:27017/shopping').then(client=>{
            console.log('Connected to MongoDB')
            dbcollection=client.db()
            const rule = '0 0 1 * *'; // Runs at midnight on the first day of every month
            const job = schedule.scheduleJob(rule, calculateRevenue);
            return cb()
        }).catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    getDb:()=>dbcollection
}