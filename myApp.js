require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env['MONGO_URI']

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const personSchema = new Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function(done) {
  const person = new Person({
    name: "Lutero",
    age: 50,
    favoriteFoods: [
      "Hot-dog",
      "Apple",
      "Pineapple"
    ]
  });

  person.save(function(err, data) {
    if (err)
      return console.error(err);

    done(null, data)
  });
};

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function(err, people) {
    if (err)
      return console.log(err);

    done(null, people);
  });
};

const findPeopleByName = async (personName, done) => {
  console.log(`Looking for ${personName}...`);

  const data = await Person.find({
    name: personName
  });

  console.log(`${personName} may have been found`);

  done(null, data);
};

const findOneByFood = async (food, done) => {
  await Person.findOne({
    favoriteFoods: food
  }, function(err, data) {
    if (err)
      return console.log(err);

    console.log(data);
    done(null, data);
  });

};

const findPersonById = async (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err)
      return console.log(err);

    done(null, data);
  });
};

const findEditThenSave = async (personId, done) => {

  console.log(`Id: ${personId}`)
  const foodToAdd = "hamburger";

  await Person.findById(personId, async (err, person) => {
    if (err)
      throw new Exception(err);

    console.log(`Name: ${person.name}`);

    person.favoriteFoods = [...person.favoriteFoods, foodToAdd];
    await person.save((err, updatedPerson) => {
      if (err)
        throw new Exception(err);

      console.log(`FavoriteFoods: ${person.favoriteFoods.join(", ")}`);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = async (personName, done) => {
  const ageToSet = 20;
  const data = await Person.findOneAndUpdate(
    { name: personName }, 
    { age: ageToSet }, 
    { new: true }
  )
  done(null, data);
};

const removeById = async (personId, done) => {
  const data = await Person.findByIdAndRemove(personId);
  done(null, data);
};

const removeManyPeople = async (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err)
      throw new Exception(err);

    done(null, data)
  });
};

const queryChain = async (done) => {
  const foodToSearch = "burrito";

  Person
    .find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select('-age')
    .exec(done)
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
