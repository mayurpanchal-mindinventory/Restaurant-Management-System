import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FiArrowLeft, FiFilter, FiCalendar, FiClock, FiPercent, FiUsers } from "react-icons/fi";
import { toast } from 'react-hot-toast';
import { useConfirm } from "../context/ConfirmationContext";
import {
    createSlot, deleteSlotById, getSlotById,
    getSlotListByRestaurant, updateSlot
} from "../services/adminService";

const validationSchema = Yup.object({
    timeslot: Yup.string().required("Time Slot is required"),
    maxbooking: Yup.number().min(1, "Minimum 1").required("Max bookings required"),
    discount: Yup.number().min(0).max(100).required("Discount is required"),
    date: Yup.date().required("Date is required"),
});

function Slot() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { confirm } = useConfirm();

    const [slot, setSlotList] = useState([]);
    const [currentpage, setcurrentpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [detail, setDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sortby, setSortBy] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const getSlotList = async () => {
        const res = await getSlotListByRestaurant(id, currentpage, sortby, selectedSlot);
        setSlotList(res?.data?.data?.data?.slots || []);
        setTotalPages(res?.data?.data?.data?.totalPages || 1);
    };

    useEffect(() => {
        getSlotList();
    }, [currentpage, sortby, selectedSlot]);

    const handleDelete = async (slotId) => {
        const isConfirmed = await confirm({
            title: "Delete Slot?",
            message: "Are you sure? This will remove the availability for this time."
        });
        if (isConfirmed) {
            await deleteSlotById(slotId);
            toast.success("Slot deleted");
            getSlotList();
        }
    };

    const editSlot = async (slotId) => {
        const res = await getSlotById(slotId);
        setDetail(res.data);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setDetail(null);
    };

    const initialValues = {
        timeslot: detail?.timeSlot || "",
        maxbooking: detail?.maxBookings || "",
        discount: detail?.discountPercent || "",
        date: detail?.date ? new Date(detail.date).toISOString().split('T')[0] : ""
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Booking Slots</h1>
                            <p className="text-sm text-slate-500 font-medium">Manage restaurant availability and discounts.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-200"
                    >
                        <PlusIcon className="w-5 h-5" /> Add New Slot
                    </button>
                </div>

                {/* Filters Panel */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">View Schedule</label>
                        <select
                            value={sortby}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="">All Availability</option>
                            <option value="1">Today</option>
                            <option value="2">Tomorrow</option>
                            <option value="3">This Week</option>
                        </select>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Filter by Time</label>
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="">Any Time</option>
                            {["10:00 AM - 11:00 AM", "12:00 PM - 01:00 PM", "02:00 PM - 03:00 PM", "04:00 PM - 05:00 PM"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Slots Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Window</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {slot?.length > 0 ? slot.map((r) => (
                                <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                        {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 uppercase">
                                            {r.timeSlot}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{r.maxBookings} Guests</td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-600 font-bold">{r.discountPercent}% Off</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => editSlot(r._id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(r._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-slate-400 italic">No slots configured.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">{detail ? 'Edit Slot' : 'Add New Slot'}</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
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
                                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                                <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
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

                                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                                        {detail ? 'Update Reservation Slot' : 'Create Reservation Slot'}
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                    <button disabled={currentpage === 1} onClick={() => setcurrentpage(p => p - 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 shadow-sm transition-all">Previous</button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {currentpage} / {totalPages}</span>
                    <button disabled={currentpage === totalPages} onClick={() => setcurrentpage(p => p + 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 shadow-sm transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}

export default Slot;
