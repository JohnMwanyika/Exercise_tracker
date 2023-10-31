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
    username: newExercise.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString()
  });
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
