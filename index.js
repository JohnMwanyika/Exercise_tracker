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
    res.json({ error: `${username} already exists` });

  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id, description, duration, date } = req.params;

  const newExercise = await new Exercise({ username })
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
