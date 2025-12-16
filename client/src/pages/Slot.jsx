import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import { createSlot, deleteSlotById, getSlotListByRestaurant } from "../services/adminService";
import { Field, Form, Formik } from 'formik';
import { ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
const validationSchema = Yup.object({
    timeslot: Yup.string().required("Time Slot is required"),
    maxbooking: Yup.string().required("Maximum Booking is required"),
    discount: Yup.string().required("Discount is required"),
});
function Slot() {

    const { id } = useParams();
    const [slot, setSlotList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const getSlotList = async () => {
        const res = await getSlotListByRestaurant(id);
        setSlotList(res.data.data);
        setLoading(false)

    };

    useEffect(() => {
        setLoading(true)
        getSlotList();
    }, [])

    const deleteSlot = async (id) => {
        await deleteSlotById(id);
        getSlotList();
    };

    const initialValues = {
        timeslot: "",
        maxbooking: "",
        discount: ""
    }
    return (
        <div className="w-full bg-white  text-black shadow-md rounded-xl p-4">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link onClick={() => setShowModal(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                    Add Slot
                </Link>
                <div>
                    <h2 className="text-xl font-semibold">Slot List</h2>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border w-full md:w-64 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                </div>
            </div>

            {loading ? <Loader loading={loading} size={60} /> : (<div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3">Time</th>
                            <th className="p-3">Max Bookings</th>
                            <th className="p-3">Discount</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {Array.isArray(slot) && slot.map((r) => (
                            <tr key={r?._id} className="border-b">
                                <td className="p-3">{r?.timeSlot}</td>

                                <td className="p-3">{r?.maxBookings} People</td>
                                <td className="p-3"> {r?.discountPercent || "-"} %</td>

                                <td className="p-3">
                                    <Link to={`/admin/editmenu/${r._id}`}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <PencilIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>

                                    <button onClick={() => deleteSlot(r._id)} className="p-2 rounded hover:bg-gray-100">
                                        <TrashIcon className="size-6 text-red-500" />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>)}
            {showModal && (
                <Formik
                    initialValues={initialValues} enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        try {

                            const formdata = {
                                "restaurantId": id,
                                "timeSlot": values.timeslot,
                                "maxBookings": values.maxbooking,
                                "discountPercent": Number(values.discount)
                            }

                            const res = await createSlot(formdata);
                            if (res?.error)
                                toast.success("Slot Already Exist");

                            // if (!id) {

                            //     } else {
                            //         const res = await updateRestaurant(id, formData);
                            //         toast.success("Slot information Updated");
                            //     }
                            showModal(false);

                        } catch (e) {
                            toast.error(e.response?.data?.error || e.message);
                        }

                    }}

                >
                    {({ values }) => (<Form className="fixed inset-0 bg-black/40 flex items-center text-black justify-center">

                        <div className="bg-white w-96 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Time Slot</h2>

                            <div className="space-y-4">
                                <label className="block mb-2.5 text-sm font-medium text-heading">Select an option</label>
                                <Field name="timeslot" as="select" className="block w-full px-3 bg-white py-2.5 border rounded-md text-heading text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                                    <option value="">Choose a Time Slot</option>
                                    <option key="10-11" value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                    <option key="11-12" value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                    <option key="12-13" value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                                    <option key="13-14" value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                                    <option key="14-15" value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>

                                </Field >
                                <ErrorMessage name="timeslot" component="p" className="text-red-500 text-sm" />


                                <Field
                                    name="maxbooking"
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Max Bookings"
                                />

                                <Field
                                    name="discount"
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
                                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                                    Save Slot
                                </button>
                            </div>
                        </div>

                    </Form>
                    )}
                </Formik>
            )
            }
        </div >
    );
}

export default Slot;
