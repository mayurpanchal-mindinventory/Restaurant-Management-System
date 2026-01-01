import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createSlot, deleteSlotById, getSlotById, getSlotListByRestaurant, updateSlot } from "../services/adminService";
import { Field, Form, Formik } from 'formik';
import { ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { useConfirm } from "../context/ConfirmationContext";
const validationSchema = Yup.object({
    timeslot: Yup.string().required("Time Slot is required"),
    maxbooking: Yup.string().required("Maximum Booking is required"),
    discount: Yup.string().required("Discount is required"),
    date: Yup.string().required("Date is required"),

});


function Slot() {

    const { confirm } = useConfirm();
    const [currentpage, setcurrentpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { id } = useParams();
    const [slot, setSlotList] = useState([]);
    const [detail, setDetail] = useState(null)
    const [sortby, setSortBy] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

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

    const [showModal, setShowModal] = useState(false);
    const getSlotList = async () => {
        const res = await getSlotListByRestaurant(id, currentpage, sortby, selectedSlot);

        setSlotList(res?.data?.data?.data?.slots);
        setTotalPages(res?.data?.data?.data?.totalPages);
    };

    useEffect(() => {
        getSlotList();
    }, [currentpage, sortby, selectedSlot])

    const goToNextPage = () => {
        if (currentpage < totalPages) {
            setcurrentpage(currentpage + 1);
        }
    };

    const goToPrevpage = () => {
        if (currentpage > 1) {
            setcurrentpage(currentpage - 1);
        }
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b">

                <div className="bg-white grid gap-2">
                    <select
                        id="sortby"
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 px-2 py-2 border rounded-lg">
                        <option value="">All Slots</option>
                        <option value="1">Today Slots</option>
                        <option value="2">Tomorrow Slots</option>
                        <option value="3">Weekly Slots</option>

                    </select>
                </div>
                <div className="flex md:flex-row gap-4 flex-col">

                    {/* <div className="flex items-center justify-center">
                        <p className="align-middle font-mono text-lg text-gray-600 font-bold mt-5">Filters : </p>
                    </div> */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Time Slots</label>
                        <select id="category" name="category"
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="">Any Time</option>
                            {["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "06:00 PM - 07:00 PM"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div>
                        <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="number" id="date-range" name="date-range" onChange={(e) => setDate(e.target.value)} placeholder="Select date range"
                            className="mt-1 block w-full pl-3 border pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div> */}
                    {/* <div class="flex items-end">
                        <button type="button"
                            onClick={() => { getmenus() }}
                            className="w-full md:w-auto px-4 py-2 border  rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Apply Filters
                        </button>
                    </div> */}

                </div>
            </div>

            {
                slot?.length > 0 ? (<div className=" overflow-x-auto">
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

                    {
                        slot.length > 0 && <div className="flex justify-between items-center mt-4">
                            <button className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50" disabled={currentpage === 1} onClick={() => goToPrevpage()}>Previous</button>

                            <div className="flex gap-2">
                                <span>page {currentpage} of {totalPages}</span>
                            </div>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize
                                onSubmit={async (values) => {
                                    const data = {
                                        timeSlot: values.timeslot,
                                        maxBookings: values.maxbooking,
                                        discountPercent: values.discount,
                                        date: values.date,
                                        restaurantId: id
                                    };
                                    try {
                                        detail ? await updateSlot(detail._id, data) : await createSlot(data);
                                        toast.success(`Slot ${detail ? 'updated' : 'added'}`);
                                        closeModal();
                                        getSlotList();
                                    } catch (e) {
                                        toast.error("Process failed");
                                    }
                                }}
                            >
                                <Form className="p-6 space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FiCalendar /> Date</label>
                                            <Field name="date" type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <ErrorMessage name="date" component="p" className="text-rose-500 text-[10px] font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FiClock /> Time Range</label>
                                            <Field as="select" name="timeslot" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                                                <option value="">Select Time</option>
                                                {["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "06:00 PM - 07:00 PM"].map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}

                                            </Field>
                                            <ErrorMessage name="timeslot" component="p" className="text-rose-500 text-[10px] font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FiUsers /> Max Bookings</label>
                                            <Field name="maxbooking" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FiPercent /> Discount</label>
                                            <Field name="discount" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
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
