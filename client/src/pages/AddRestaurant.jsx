import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-multi-date-picker";

const validationSchema = Yup.object({
    // restaurantName: Yup.string().required("Restaurant name is required"),
    password: Yup.string().required("Password is required"),
    email: Yup.string().email().required("Email is required"),
    phone: Yup.string().required("Phone number is required"),

    holidayDates: Yup.array().min(1, "Select at least one holiday date"),
    weeklyOff: Yup.array().min(1, "Select at least one weekly off day"),

    coverPhoto: Yup.mixed().required("Cover photo is required"),
    profilePhoto: Yup.mixed().required("Profile photo is required"),
});

export default function RestaurantForm() {
    return (
        <Formik
            initialValues={{
                restaurantName: "",
                password: "",
                email: "",
                phone: "",
                holidayDates: [],
                weeklyOff: [],
                coverPhoto: null,
                profilePhoto: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log("FORM SUBMITTED:", values);
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
                            value={values.holidayDates}
                            onChange={(dates) => setFieldValue("holidayDates", dates)}
                            placeholder="select Holiday Dates"
                            format="YYYY-MM-DD"
                            className="border rounded-md p-4 w-full mt-1"
                        />

                        <ErrorMessage
                            name="holidayDates"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Weekly Off</label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                            ].map((day) => (
                                <label key={day} className="flex items-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="weeklyOff"
                                        value={day}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span>{day}</span>
                                </label>
                            ))}
                        </div>

                        <ErrorMessage
                            name="weeklyOff"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Cover Photo</label>

                        <input
                            type="file"
                            className="mt-2 w-full border rounded-md p-2"
                            onChange={(e) =>
                                setFieldValue("coverPhoto", e.currentTarget.files[0])
                            }
                        />

                        <ErrorMessage
                            name="coverPhoto"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Profile Photo</label>

                        <input
                            type="file"
                            className="mt-2 w-full border rounded-md p-2"
                            onChange={(e) =>
                                setFieldValue("profilePhoto", e.currentTarget.files[0])
                            }
                        />

                        <ErrorMessage
                            name="profilePhoto"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div className="flex flex-row gap-10">
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-indigo-700"
                        >
                            Submit
                        </button>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-indigo-700"
                        >
                            Reset
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
