require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors');
const { User, Exercise } = require('./models/index');


app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route("/api/users")
  .get(async (req, res) => {
    let users = await User.find({});
    console.log(users);
    res.json(users);
  })
  .post(async (req, res) => {
    const { username } = req.body;
    // check existing
    const isExist = await User.findOne({ username: username });
    console.log('Exising user is ', isExist);
    // if no existing user create one
    if (!isExist) {
      const newUser = await new User({ username });
      await newUser.save();
      return res.json({ username: newUser.username, _id: newUser._id });
    }
    res.json({ error: `${username} already exists`, _id: isExist._id });

  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params || req.body;
  console.log({ _id, description, duration, date });

  // if (!_id || !description || !duration || !date) {
  //   return res.json({ error: 'All fields are required' });
  // };
  const newDate = new Date(date).toDateString();
  console.log(newDate);
  const user = await User.findOne({ _id });
  // check if user exists
  if (!user) return res.json({ error: 'User not found!' });
  // create new user
  const newExercise = await new Exercise({
    username: user.username,
    description,
    duration,
    date: newDate
  });
  await newExercise.save();
  res.json({
    _id,
    username: newExercise.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString()
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params || req.body;
  let { from, to, limit } = req.query;
  console.log({ _id, from, to, limit })

  try {

    // find user with the specified ID
    const user = await User.findById(_id);
    console.log('user is', user)
    // check if user is valid
    if (!user) return res.json({ error: 'Invalid user Id' });

    // validate dates
    if (from) {
      from = new Date(from);
      if (from == "Invalid Date") return res.json({ error: "Invalid from date" })
    }
    if (to) {
      to = new Date(to);
      if (to == "Invalid Date") return res.json({ error: "Invalid to date" })
    }
    // validate limit
    if (limit) {
      limit = new Number(limit);
      if (limit == NaN) return res.json({ error: 'Invalid limit' });
    }


    // let results = { _id, username: user?.username, from: from?.toDateString(), to: to?.toDateString() };
    // let dateFilter = { "$gte": from, "$lt": to };

    // if (from) {
    //   results.from = from.toDateString();
    //   dateFilter.$gte = from;
    //   if (to) {
    //     results.to = to.toDateString();
    //     dateFilter.$lt = to;
    //   }
    // }
    let filter = { username: user.username, date: { $gt: from, $lt: to } };
    // get valid user exercises
    const exercise = await Exercise.find(filter).limit(limit);
    const count = await Exercise.count(filter);
    res.json({ _id, username: user.username, count, log: exercise });
  } catch (error) {
    console.warn(error)
    res.json({ error: `Oops! ${error}` })
  }


})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
