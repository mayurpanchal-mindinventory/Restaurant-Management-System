const { default: mongoose } = require("mongoose");
const TimeSlot = require("../models/TimeSlot");
exports.createSlot = async (data) => {
    try {
        const exists = await TimeSlot.findOne({
            timeSlot: data.timeSlot,
            date: data.date,
            restaurantId: data.restaurantId
        });
        if (exists) throw new Error("Slot Already exist");
        return await TimeSlot.create(data);
    }
    catch (error) {
        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message = MESSAGES.SERVER_ERROR;
        }
        throw error;
    }

};

exports.slotList = async (req) => {
    try {
        const { id } = req.params;
        limit = 5;
        if (!id) throw new Error("Resaurant Id Required");
        let { page, sortby, timeslot } = req.query;
        if (sortby) {
            if (sortby == "2") {
                startOfDay = new Date(new Date().toISOString().split('T')[0]);
                startOfDay.setDate(startOfDay.getDate() + 1)

                nextDay = new Date(startOfDay);
                nextDay.setDate(startOfDay.getDate() + 1);
            } else if (sortby == "1") {
                startOfDay = new Date(new Date().toISOString().split('T')[0]);
                nextDay = new Date(startOfDay);
                nextDay.setDate(startOfDay.getDate() + 1);
            } else if (sortby == "3") {
                startOfDay = new Date(new Date().toISOString().split('T')[0]);
                nextDay = new Date(startOfDay);
                nextDay.setDate(startOfDay.getDate() + 7);
            }


        }
        if (sortby, timeslot) {
            page = 1;
        }
        const skip = (page - 1) * limit;
        const restaurantObjectId = new mongoose.Types.ObjectId(id);

        const pipeline = [
            {
                $match: {
                    'restaurantId': restaurantObjectId
                }
            },
            {
                $match: sortby && sortby == "1" ? {
                    date: {
                        $gte: startOfDay,
                        $lt: nextDay
                    }
                } : {}
            },
            {
                $match: sortby && sortby == "2" ? {
                    date: {
                        $gte: startOfDay,
                        $lt: nextDay
                    }
                } : {}
            }, {
                $match: sortby && sortby == "3" ? {
                    date: {
                        $gte: startOfDay,
                        $lt: nextDay
                    }
                } : {}
            },
            {
                $match: timeslot ? {
                    timeSlot: timeslot
                } : {}
            }


        ];
        const countData = await TimeSlot.aggregate([...pipeline, { $count: 'total' }]);
        const totalDocs = countData.length > 0 ? countData[0].total : 0;

        const slots = await TimeSlot.aggregate([
            ...pipeline,
            { $skip: skip },
            { $limit: limit }
        ]);

        return {
            success: true,
            data: {
                slots,
                totalPages: Math.ceil(totalDocs / limit),
                currentPage: page * 1,
                totalDocs
            }
        }
    }
    catch (error) {

        return error;
    }
};

exports.deleteSlot = async (req) => {
    try {
        const { id } = req.params;
        const exists = await TimeSlot.findOne();
        if (!exists) throw new Error("Slot ID must required");
        return await TimeSlot.findByIdAndDelete(id);
    } catch (error) {
        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message = MESSAGES.SERVER_ERROR;
        }
        throw error;
    }
};

exports.updateSlot = async (req) => {
    try {
        const { id } = req.params;
        await TimeSlot.findByIdAndUpdate(id, req.body);
    } catch (error) {
        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message = MESSAGES.SERVER_ERROR;
        }
        throw error;
    }
};

exports.getSlotDetails = async (req) => {
    try {
        const { id } = req.params;

        if (!id) throw new Error("Slot Id Required");
        return await TimeSlot.findById(id);
    } catch (error) {
        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message = MESSAGES.SERVER_ERROR;
        }
        throw error;
    }
};
