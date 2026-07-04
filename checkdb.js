const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mail2vinay2004_db_user:PB2OhTGaHdvblJXm@cluster0.g7zfap3.mongodb.net/JobPrep?retryWrites=true&w=majority').then(async () => {
  const user = await mongoose.connection.collection('users').findOne({ email: 'vinay@gmail.com' });
  console.log('--- USER ---');
  console.log(user);
  
  if (user) {
    const roadmap = await mongoose.connection.collection('roadmaps').findOne({ userId: user._id, status: 'active' });
    console.log('--- ROADMAP ---');
    if (roadmap) {
      console.log('Has months?', !!roadmap.months, 'Months len:', roadmap.months?.length);
      if (roadmap.months?.length > 0) {
        console.log('Has weeks?', !!roadmap.months[0].weeks, 'Weeks len:', roadmap.months[0].weeks?.length);
        if (roadmap.months[0].weeks?.length > 0) {
          console.log('Has days?', !!roadmap.months[0].weeks[0].days, 'Days len:', roadmap.months[0].weeks[0].days?.length);
        }
      }
    } else {
      console.log('No active roadmap found');
    }
  }
  process.exit();
});
