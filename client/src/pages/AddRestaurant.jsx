import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import { createRestaurant, getRestaurantsById, updateRestaurant } from "../services/adminService";
import { toast } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { FiUpload, FiArrowLeft, FiSave } from "react-icons/fi";


export default function RestaurantForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [apiData, setApiData] = useState(null);
    const [previews, setPreviews] = useState({ main: null, logo: null });

    const validationSchema = Yup.object({
        restaurantName: Yup.string().required("Name is required"),
        password: id ? Yup.string() :
            Yup.string()
                .required("Password is required")
                .min(8, 'Password is too short - should be 8 characters minimum.')
                .matches(/[A-Z]/, 'Password requires an uppercase letter')
                .matches(/[0-9]/, 'Password requires a number'),
        email: Yup.string().email().required("Email is required"),
        description: Yup.string().required("Description is required"),
        phone: Yup.string().required("Phone number is required"),
        mainImage: Yup.mixed().required("Cover photo is required"),
        logoImage: Yup.mixed().required("Profile photo is required"),
    });
    const getDetails = async () => {
        try {
            const res = await getRestaurantsById(id);
            setApiData(res.data);
            setPreviews({ main: res.data.mainImage, logo: res.data.logoImage });
        } catch (e) {
            toast.error("Failed to fetch details");
        }
    }

    useEffect(() => { if (id) getDetails(); }, [id]);

    const initialValues = {
        restaurantName: apiData?.name || "",
        password: apiData?.password || "",
        email: apiData?.userId?.email || "",
        description: apiData?.description || "",
        phone: apiData?.userId?.phone || "",
        closedDates: apiData?.closedDates || [],
        mainImage: apiData?.mainImage || null,
        logoImage: apiData?.logoImage || null,
        openDays: typeof apiData?.openDays === 'string'
            ? apiData.openDays.split(',')
            : apiData?.openDays || [],
    };

    const handleFileChange = (e, setFieldValue, fieldName) => {
        const file = e.currentTarget.files[0];
        setFieldValue(fieldName, file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => ({ ...prev, [fieldName === 'mainImage' ? 'main' : 'logo']: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const formData = new FormData();
                    Object.keys(values).forEach(key => {
                        if (key === 'closedDates') {
                            values.closedDates.forEach(date => formData.append("closedDates[]", date));
                        } else {
                            formData.append(key, values[key]);
                        }
                    });

                    try {
                        id ? await updateRestaurant(id, formData) : await createRestaurant(formData);
                        toast.success(`Restaurant ${id ? 'Updated' : 'Created'} Successfully`);
                        navigate('/admin');
                    } catch (e) {
                        toast.error("An error occurred");
                    }
                }}
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form className="flex-1 flex flex-col">
                        <header className="bg-white border-b sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
                            <div className="flex text-orange-500 items-center gap-4">
                                <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-orange-500 hover:text-white rounded-full">
                                    <FiArrowLeft size={20} />
                                </button>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {id ? "Edit Restaurant Profile" : "Register New Restaurant"}
                                </h1>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-indigo-700 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                <FiSave /> {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </header>

                        <main className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                            <div className="lg:col-span-1 space-y-6  text-black">
                                <div className="bg-white p-6 rounded-xl shadow-sm border">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Branding</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Cover Photo</label>
                                        <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group">
                                            {previews.main ? (
                                                <img src={previews.main} className="w-full h-full object-cover" alt="Cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <FiUpload size={24} />
                                                    <span className="text-xs mt-2">Upload Cover</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileChange(e, setFieldValue, "mainImage")}
                                            />
                                        </div>
                                        <ErrorMessage name="mainImage" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <label className="block text-sm font-medium mb-2 w-full text-left">Logo</label>
                                        <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 group">
                                            {previews.logo ? (
                                                <img src={previews.logo} className="w-full h-full object-cover" alt="Logo" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400"><FiUpload /></div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileChange(e, setFieldValue, "logoImage")}
                                            />
                                        </div>
                                        <ErrorMessage name="logoImage" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6  text-black">
                                <div className="bg-white p-8 rounded-xl shadow-sm border">
                                    <h2 className="text-lg font-semibold mb-6 border-b pb-2 text-gray-700">General Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600">Restaurant Name</label>
                                            <Field name="restaurantName" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50 border" />
                                            <ErrorMessage name="restaurantName" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Email Address</label>
                                            <Field name="email" type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50 border" />
                                            <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                            <Field name="phone" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50 border" />
                                            <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600">Password</label>
                                            <Field name="password" type="password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50 border" />
                                            <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />

                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600">Description</label>
                                            <Field as="textarea" rows="3" name="description" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50 border" />
                                            <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />

                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-sm border">
                                    <h2 className="text-lg font-semibold mb-6 border-b pb-2 text-gray-700">Operational Hours</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Holiday Dates</label>
                                            <DatePicker
                                                multiple
                                                value={values.closedDates}
                                                onChange={(dates) => setFieldValue("closedDates", dates?.map((d) => d.format("YYYY-MM-DD")))}
                                                containerClassName="w-full"
                                                inputClass="w-full border p-2.5 rounded-md bg-gray-50 border-gray-300 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-3">Operational Days</label>
                                            <div className="flex flex-wrap gap-3">
                                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                                    <label key={day} className="flex items-center px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <Field type="checkbox" name="openDays" value={day} className="h-4 w-4 text-indigo-600 rounded mr-2" />
                                                        <span className="text-sm text-gray-700">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
