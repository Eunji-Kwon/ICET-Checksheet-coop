
const fetch = require('node-fetch');
<<<<<<< HEAD
<<<<<<< HEAD
const cron = require('node-cron');
=======
>>>>>>> 9cb1631 (version 1.0)
=======
>>>>>>> 9cb1631 (version 1.0)


const Checksheet = require('../models/Checksheet');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const local = 'http://localhost:5000';
const URL = process.env.REACT_APP_API_URL || local;

<<<<<<< HEAD
<<<<<<< HEAD
// //Delete the Data (3days)
// async function deleteOldChecksheets() {
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

//     try {
//         const result = await Checksheet.deleteMany({ createdAt: { $lt: threeDaysAgo } });
//         console.log(`${result.deletedCount} checksheets deleted.`);
//     } catch (err) {
//         console.error('Error deleting old checksheets:', err);
//     }
// }

// cron.schedule('0 0 * * *', deleteOldChecksheets); // Excuting it Everyday at 00:00AM 

=======
>>>>>>> 9cb1631 (version 1.0)
=======
>>>>>>> 9cb1631 (version 1.0)
exports.getAll = async (req, res) => {
    try {
        const checksheets = await Checksheet.find();
        res.status(200).json(checksheets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const checksheet = await Checksheet.findById(req.params.id);
        if (checksheet == null) {
            return res.status(404).json({ message: 'Cannot find checksheet' });
        }
        res.status(200).json(checksheet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        // Fetch today's schedule
        const scheduleResponse = await fetch(`${URL}/api/schedule/today`);
        const schedule = await scheduleResponse.json(); // Parse the response body as JSON

        // Check if there's already a checksheet for today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00
        const existingChecksheets = await Checksheet.find({ createdAt: { $gte: today } });

        if (existingChecksheets.length > 0) {
            // Check if all checksheets are marked as checked
            const allChecked = existingChecksheets.every(sheet => sheet.isChecked);

            if (allChecked) {
                return res.status(400).json({ message: `All labs have been checked. We are done for the day.` });
            } else {
                return res.status(400).json({ message: `Today's checksheet has been started.` });
            }
        }
	
	
        // Create a checksheet for each entry
        const checksheets = schedule.map(entry => {

// Create new ObjectId 
            const id = mongoose.Types.ObjectId.isValid(entry._id) ? entry._id : new ObjectId();
            

	return new Checksheet({
            _id: id,
            day: entry.Day,
            lab: entry.Lab,
            startTime: entry['Start Time'],
            checkedBy: '',
            isChecked: false,
        });
});

        // Save all checksheets
        const newChecksheets = [];
        for (const sheet of checksheets) {
            // Check if a checksheet with the same lab and startTime already exists
            const existingChecksheet = await Checksheet.findOne({ lab: sheet.lab, startTime: sheet.startTime });
            if (!existingChecksheet) {
                // If no existing checksheet, save the new checksheet
                const savedSheet = await sheet.save();
                newChecksheets.push(savedSheet);
            }
        }
        res.status(201).json(newChecksheets);
        console.log(newChecksheets, 'Checksheet created');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body.checkedBy) {
            return res.status(400).json({ message: 'checkedBy is required.' });
        }

        const updatedChecksheet = await Checksheet.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                isChecked: true,
                actualTime: new Date(),
            },
            { new: true }
        );

        res.status(200).json(updatedChecksheet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
<<<<<<< HEAD
<<<<<<< HEAD


// // Reset every at Sunday 00:00AM
// cron.schedule('30 11 * * 4', async () => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // 이전 주의 Checksheets를 모두 History로 이동
//         const lastWeek = new Date(today);
//         lastWeek.setDate(today.getDate() - 7);

//         await Checksheet.updateMany(
//             { createdAt: { $lt: today } },
//             { $set: { isChecked: true } }
//         );

//         console.log('Checksheets have been reset for the new week.');
//     } catch (err) {
//         console.error('Error resetting checksheets: ', err.message);
//     }
// });
=======
>>>>>>> 9cb1631 (version 1.0)
=======
>>>>>>> 9cb1631 (version 1.0)
