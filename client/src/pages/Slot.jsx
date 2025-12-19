import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createSlot, deleteSlotById, getSlotById, getSlotListByRestaurant, updateSlot } from "../services/adminService";
import { Field, Form, Formik } from 'formik';
import { ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { FiArrowLeft } from "react-icons/fi";
import { useConfirm } from "../context/ConfirmationContext";
const validationSchema = Yup.object({
    timeslot: Yup.string().required("Time Slot is required"),
    maxbooking: Yup.string().required("Maximum Booking is required"),
    discount: Yup.string().required("Discount is required"),
    date: Yup.string().required("Date is required"),

});


function Slot() {

    const { confirm } = useConfirm();

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: "Delete Slot?",
            message: "This action is permanent and cannot be undone."
        });

        if (isConfirmed) {
            await deleteSlotById(id);
            getSlotList();
        }
    };

    const navigate = useNavigate();
    const { id } = useParams();
    const [slot, setSlotList] = useState([]);
    const [detail, setDetail] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const getSlotList = async () => {
        const res = await getSlotListByRestaurant(id);
        setSlotList(res.data.data);
    };

    useEffect(() => {
        getSlotList();
    }, [])

    const deleteSlot = async (id) => {
        await deleteSlotById(id);
        getSlotList();
    };

    const editSlot = async (id) => {
        const res = await getSlotById(id);
        setDetail(res.data);
        setShowModal(true)
    };
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayDate = getTodayDateString();

    const convertDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    }
    const initialValues = {

        timeslot: detail?.timeSlot || "",
        maxbooking: detail?.maxBookings || "",
        discount: detail?.discountPercent || "",
        date: detail?.date ? convertDate(detail.date) : ""

    }
    return (
        <div className="w-full bg-white h-full text-black shadow-md rounded-xl p-4">
            <header className={`${!showModal && `border-b bg-white `} sticky top-0 z-10 px-4 py-2 flex items-center justify-between`}>

                <div className="flex text-orange-500 items-center">
                    <button type="button" onClick={() => navigate('/admin')} className="p-2 hover:bg-orange-500 hover:text-white rounded-full">
                        <FiArrowLeft size={20} />
                    </button>
                </div>
                <Link onClick={() => setShowModal(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                    Add Slot
                </Link>
            </header>


            {slot?.length > 0 ? (<div className=" overflow-x-auto">
                <div>
                    <h2 className="text-xl font-semibold p-4">Slot List</h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3">Date </th>
                            <th className="p-3">Time</th>
                            <th className="p-3">Max Bookings</th>
                            <th className="p-3">Discount</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {Array.isArray(slot) && slot.map((r) => (
                            <tr key={r?._id} className="border-b">
                                <td className="p-3">{r?.date ? convertDate(r.date) : "-"}</td>
                                <td className="p-3 text-balance">{r?.timeSlot}</td>
                                <td className="p-3">{r?.maxBookings} People</td>
                                <td className="p-3"> {r?.discountPercent || "-"} %</td>

                                <td className="p-3">
                                    <Link onClick={() => editSlot(r._id)}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <PencilIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>

                                    <button onClick={() => handleDelete(r._id)} className="p-2 rounded hover:bg-gray-100">
                                        <TrashIcon className="size-6 text-red-500" />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>) : (<div className="h-lvh flex text-gray-800 items-center justify-center">
                <p className="text-3xl font-bold">
                    No Slot Yet
                </p>
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
                                "discountPercent": Number(values.discount),
                                "date": values.date
                            }



                            if (!detail) {
                                const res = await createSlot(formdata);
                                if (res)
                                    toast.success("Slot Created");
                            } else {
                                const res = await updateSlot(detail._id, formdata);
                                toast.success("Slot information Updated");
                            }
                            setShowModal(false);
                            setDetail(null)

                            getSlotList();
                        } catch (e) {
                            toast.error(e.response?.data?.error || e.message);
                        }

                    }}

                >
                    {({ values }) => (<Form className="fixed inset-0 bg-black/40 flex items-center text-black justify-center">

                        <div className="bg-white w-96 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Time Slot</h2>

                            <div className="space-y-4">
                                <Field
                                    name="date"
                                    type="date"
                                    min={todayDate}
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Slot Date"
                                />
                                <ErrorMessage name="date" component="p" className="text-red-500 text-sm" />

                                <label className="block mb-2.5 text-sm font-medium text-heading">Select an option</label>
                                <Field name="timeslot" as="select" className="block w-full px-3 bg-white py-2.5 border rounded-md text-heading text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                                    <option value="">Choose a Time Slot</option>
                                    <option key="10-11" value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                    <option key="11-12" value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                    <option key="12-13" value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                                    <option key="13-14" value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                                    <option key="14-15" value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                                    <option key="14-15" value="02:00 PM - 03:00 PM">03:00 PM - 04:00 PM</option>
                                    <option key="14-15" value="02:00 PM - 03:00 PM">04:00 PM - 05:00 PM</option>

                                </Field >
                                <ErrorMessage name="timeslot" component="p" className="text-red-500 text-sm" />


                                <Field
                                    name="maxbooking"
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Max Bookings"
                                />
                                <ErrorMessage name="maxbooking" component="p" className="text-red-500 text-sm" />

                                <Field
                                    name="discount"
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Discount %"
                                />
                                <ErrorMessage name="discount" component="p" className="text-red-500 text-sm" />

                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => { setShowModal(false), setDetail(false) }}
                                    className="px-4 py-2 rounded-lg border"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                                    {!detail ? "Save Slot" : "Update Slot"}
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
