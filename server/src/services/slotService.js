const TimeSlot = require("../models/TimeSlot");

exports.createSlot = async (data) => {
    const exists = await TimeSlot.findOne({
        timeSlot: data.timeSlot,
        date: data.date,
        restaurantId: data.restaurantId
    });
    if (exists) throw new Error("Slot Already exist");
    return await TimeSlot.create(data);
};

exports.slotList = async (req) => {
    const { id } = req.params;

    if (!id) throw new Error("Resaurant Id Required");
    return await TimeSlot.find({ restaurantId: id });
};

exports.deleteSlot = async (req) => {
    const { id } = req.params;
    const exists = await TimeSlot.findOne();
    if (!exists) throw new Error("Slot ID must required");
    return await TimeSlot.findByIdAndDelete(id);
};

exports.updateSlot = async (req) => {
    const { id } = req.params;
    await TimeSlot.findByIdAndUpdate(id, req.body);

};

exports.getSlotDetails = async (req) => {
    const { id } = req.params;

    if (!id) throw new Error("Slot Id Required");
    return await TimeSlot.findById(id);
};
