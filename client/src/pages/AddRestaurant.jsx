import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import { createRestaurant, getRestaurantsById, updateRestaurant } from "../services/adminService";
import { toast } from 'react-hot-toast';
import { useEffect, useState } from "react";
const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"),
    email: Yup.string().email().required("Email is required"),
    phone: Yup.string().required("Phone number is required"),

    // closedDates: Yup.array().min(0, "Select at least one holiday date"),
    // openDays: Yup.array().min(0, "Select at least one weekly off day"),

    mainImage: Yup.mixed().required("Cover photo is required"),
    logoImage: Yup.mixed().required("Profile photo is required"),
});

export default function RestaurantForm() {

    const { id } = useParams();
    const [apiData, setApiData] = useState(null)
    const getDetails = async () => {
        try {
            const res = await getRestaurantsById(id);
            setApiData(res.data);
            console.log(res.data);

        } catch (e) {
            toast("abc")
        }
    }

    const initialValues = {
        restaurantName: apiData?.name || "",
        password: apiData?.password || "",
        email: apiData?.userId?.email || "",
        phone: apiData?.userId?.phone || "",
        closedDates: apiData?.closedDates || [],
        openDays: apiData?.openDays || [],
        mainImage: apiData?.mainImage || null,
        logoImage: apiData?.logoImage || null,
    }

    useEffect(() => {
        if (id) {

            getDetails();
        }
    }, [id])

    return (

        <Formik
            initialValues={initialValues} enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                const formData = new FormData();

                formData.append("restaurantName", values.restaurantName);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("phone", values.phone);
                values.closedDates.forEach(date => {
                    formData.append("closedDates[]", date);
                });
                formData.append("openDays", values.openDays);

                formData.append("mainImage", values.mainImage);
                formData.append("logoImage", values.logoImage);

                try {

                    if (!id) {
                        const res = await createRestaurant(formData);
                        toast.success("Restaurant Created");
                    } else {
                        const res = await updateRestaurant(id, formData);
                        toast.success("Restaurant information Updated");
                    }

                } catch (e) {
                    toast("abc")
                }

            }}

        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-6 p-6 max-w-3xl mx-auto bg-white text-black rounded-lg shadow">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Restaurant Name</label>
                            <Field
                                name="restaurantName"
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                                name="restaurantName"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <Field
                                name="email"
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <Field
                                name="password"
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <Field
                                name="phone"
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm  font-medium">Holiday Dates</label>

                        <DatePicker
                            multiple
                            value={values.closedDates}
                            onChange={(dates) =>
                                setFieldValue(
                                    "closedDates",
                                    dates.map((d) => d.format("YYYY-MM-DD"))
                                )
                            }
                            placeholder="select Holiday Dates"
                            format="YYYY-MM-DD"
                            className="border rounded-md  w-full mt-1"
                        />

                        <ErrorMessage
                            name="closedDates"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Weekly Off</label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {[
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                            ].map((day) => (
                                <label key={day} className="flex items-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="openDays"
                                        value={day}
                                        className="h-4 w-4 border-gray-300 rounded"
                                    />
                                    <span>{day}</span>
                                </label>
                            ))}
                        </div>

                        <ErrorMessage
                            name="openDays"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>


                        <label className="block text-sm font-medium">Cover Photo</label>

                        <input
                            type="file"
                            className="w-full text-slate-500 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
                            onChange={(e) =>
                                setFieldValue("mainImage", e.currentTarget.files[0])
                            }
                        />

                        <ErrorMessage
                            name="mainImage"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Restaurant Logo</label>

                        <input
                            type="file"
                            className="w-full text-slate-500 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
                            onChange={(e) =>
                                setFieldValue("logoImage", e.currentTarget.files[0])
                            }
                        />

                        <ErrorMessage
                            name="logoImage"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div className="flex flex-row gap-10">
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-indigo-700"
                        >
                            {!id ? "Submit" : "Update"}
                        </button>
                        {/* <button
                            type="submit"
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-indigo-700"
                        >
                            Reset
                        </button> */}
                    </div>
                </Form>
            )}
        </Formik>
    );
}
