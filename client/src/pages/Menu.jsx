import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useLocation } from "react-router-dom";
import { createMenu, getAllCategories } from "../services/adminService";
import { toast } from 'react-hot-toast';
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
    MenuName: Yup.string().required("Menu Name is required"),
    price: Yup.string().required("Menu Price is required"),
    MenuImage: Yup.mixed().required("Menu Image is required")
});

export default function Menu() {
    const location = useLocation();
    const [edit, setEdit] = useState(false)
    const updateLocation = location.pathname;
    console.log(updateLocation);


    const { id } = useParams();
    const [categories, setCategories] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const handleFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("MenuImage", file);

        if (file) {
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImagePreviewUrl(null);
        }
    };

    const getCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.data);
        } catch (e) {
            toast(e.ErrorMessage);
        }
    };

    useEffect(() => {
        updateLocation.startsWith("/admin/editmenu") ? setEdit(true) : setEdit(false)

        getCategories();
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, []);
    return (
        <Formik
            initialValues={{
                MenuName: "",
                price: "",
                MenuImage: null,
                categories: ""
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                const formData = new FormData();
                formData.append("name", values.MenuName);
                formData.append("price", values.price);
                formData.append("image", values.MenuImage);
                formData.append("categoryId", values.categories);
                formData.append("restaurantId", id);

                try {
                    await createMenu(formData);
                    toast.success("Menu item created successfully!");
                } catch (e) {
                    toast.error("Failed to create menu item.");
                }
            }}
        >
            {({ setFieldValue }) => (
                <Form className="space-y-6 p-6 max-w-3xl mx-auto bg-white text-black rounded-lg shadow-lg">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Menu Name</label>
                            <Field name="MenuName" className="mt-1 w-full p-2 border rounded-md" />
                            <ErrorMessage name="MenuName" component="p" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            <Field name="price" className="mt-1 w-full p-2 border rounded-md" type="number" />
                            <ErrorMessage name="price" component="p" className="text-red-500 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">Select an option</label>
                        <Field name="categories" as="select" className="block w-full px-3 bg-white py-2.5 border rounded-md text-heading text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                            <option value="">Choose a Category</option>
                            {Array.isArray(categories) && categories.map(a => (
                                <option key={a._id} value={a._id}>{a.categoryName}</option>
                            ))}
                        </Field >
                        <ErrorMessage name="categories" component="p" className="text-red-500 text-sm" />
                    </div>



                    <div>
                        <label className="block text-sm font-medium mb-2">Item Photo</label>
                        <div className="flex items-center justify-center bg-gray-100 w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium relative">


                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                />

                                {!imagePreviewUrl && (
                                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
                                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                )}


                                {imagePreviewUrl && (
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-cover rounded-base" // Added object-cover to fit nicely
                                    />
                                )}
                            </label>
                        </div>
                        <ErrorMessage
                            name="MenuImage"
                            component="p"
                            className="text-red-500 text-sm"
                        />
                    </div>
                    <div className="flex flex-row gap-10">
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-indigo-700"
                        >
                            {!edit ? "Add" : "Update Menu"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
