import React from 'react'

function Slot() {
    const [showModal, setShowModal] = useState(false);
    const slots = [
        { time: "12:00 PM – 1:00 PM", max: 10, discount: "10%" },
        { time: "1:00 PM – 2:00 PM", max: 8, discount: "5%" },
    ];
    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Time Slots</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Slot
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4">Time</th>
                            <th className="text-left p-4">Max Bookings</th>
                            <th className="text-left p-4">Discount</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((slot, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-4">{slot.time}</td>
                                <td className="p-4">{slot.max}</td>
                                <td className="p-4">{slot.discount}</td>
                                <td className="p-4 space-x-3">
                                    <button className="text-blue-600 hover:underline">
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white w-96 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Add Time Slot</h2>

                        <div className="space-y-4">
                            <input
                                type="time"
                                className="w-full border rounded-lg p-2"
                                placeholder="Start Time"
                            />

                            <input
                                type="time"
                                className="w-full border rounded-lg p-2"
                                placeholder="End Time"
                            />

                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                placeholder="Max Bookings"
                            />

                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                placeholder="Discount %"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                                Save Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}

export default Slot