const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

const db = mongoose.createConnection('mongodb://localhost:27017/RelationBuilder', { useNewUrlParser: true, useUnifiedTopology: true });

const relationSchema = new mongoose.Schema({
    firstUser: String,
    secondUser: String,
    relation: String,
    found: Boolean
});

const relationModel = db.model('relation', relationSchema);
//remove all previous data present in db
async function resetDb() {
    await relationModel.deleteMany({});
}
resetDb();
//on referesh reset data
app.get('/resetdb', async (req, res) => {
    await relationModel.deleteMany({});
})
//helper funnction
const isNullOrUndefined = (val) => val === null || val === undefined;
//add data 
app.post('/newrelation', async (req, res) => {
    const { firstUser, secondUser, relation } = req.body;
    const existingRelation = await relationModel.findOne({ firstUser, secondUser });
    if (isNullOrUndefined(existingRelation)) {
        const newReation = new relationModel({
            firstUser,
            secondUser,
            relation,
            found: false
        });
        await newReation.save();
        res.send(newReation);
    } else {
        res.status(400).send({ error: "This relation is already exist" });
    }
});
//find all possible relations
app.post(`/getrelation`, async (req, res) => {
    const { firstUser, secondUser } = req.body;
    console.log("inside fetch", firstUser, secondUser);
    let relationArray = [];

    const getRelation = await relationModel.findOne({ firstUser, secondUser });

    if (!isNullOrUndefined(getRelation)) {
        await relationModel.updateOne({ firstUser, secondUser }, { found: true });
        relationArray.push(getRelation.firstUser + " -> " + getRelation.secondUser);
        console.log("direct search : ", await relationModel.findOne({ firstUser, secondUser }));
    }
    //search without any condition
    const userOne = await relationModel.find({ firstUser });
    const userTwo = await relationModel.findOne({ secondUser });
    if (userOne.length === 0) {
        return res.send(relationArray);
    } else {
        let relationString = userOne[0].firstUser;

        if (userOne.length === 0 || isNullOrUndefined(userTwo)) {
            res.sendStatus(404);
        } else {
            let currIndex = 0;

            while (currIndex < userOne.length) {
                relationString = userOne[currIndex].firstUser;
                // console.log("search for:", userOne[currIndex].secondUser);
                let searchArray = await relationModel.findOne({ firstUser: userOne[currIndex].secondUser, found: false });
                // console.log(searchArray);
                let notFound = false;
                second:
                while (notFound === false && !isNullOrUndefined(searchArray)) {
                    if (searchArray.secondUser === userTwo.secondUser) {
                        relationString = relationString + " -> " + searchArray.firstUser + " -> " + searchArray.secondUser;
                        relationArray.push(relationString);
                        // console.log("final Relation: ", relationString);
                        break second;
                    } else {
                        relationString = relationString + " -> " + searchArray.firstUser;
                        // console.log("relation after each itration :", relationString);
                        searchArray = await relationModel.findOne({ firstUser: searchArray.secondUser, found: false });
                        if (isNullOrUndefined(searchArray)) {
                            notFound = true;
                            break second;
                        }
                    }
                }
                currIndex++;
            }
        }
        await relationModel.updateMany({ found: true }, { found: false });
        res.send(relationArray);
    }
});
//update tag
app.put('/newtag/:Id', async (req, res) => {
    const { newTag } = req.body;
    const relationId = req.params.Id;
    console.log(newTag);

    await relationModel.updateOne({ _id: relationId }, { relation: newTag });
    const updateRelation = await relationModel.findOne({ _id: relationId });
    console.log(updateRelation);
    res.send(updateRelation);
});

app.listen(9000, () => console.log('app is listening to port 9000'));


