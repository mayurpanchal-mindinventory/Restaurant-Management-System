import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createMenu, getAllCategories, getMenuById, updateMenuById } from "../services/adminService";
import { toast } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { FiArrowLeft, FiSave, FiUploadCloud, FiPackage, FiDollarSign, FiTag } from "react-icons/fi";
import { IndianRupee } from "lucide-react";

const validationSchema = Yup.object({
    MenuName: Yup.string().required("Menu Name is required"),
    price: Yup.number().typeError("Must be a number").required("Price is required"),
    MenuImage: Yup.mixed().required("An image is required"),
    categories: Yup.string().required("Category is required")
});

export default function Menu() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [edit, setEdit] = useState(false);
    const [menuDetail, setMenuDetail] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const handleFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue("MenuImage", file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const fetchData = async () => {
        try {
            const catRes = await getAllCategories();
            setCategories(catRes.data || []);

            const isEditMode = location.pathname.includes("editmenu");
            setEdit(isEditMode);

            if (isEditMode && id) {
                const menuRes = await getMenuById(id);
                setMenuDetail(menuRes.data);
                setImagePreviewUrl(menuRes?.data?.image);
            }
        } catch (e) {
            toast.error("Error loading menu data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const initialValues = {
        MenuName: menuDetail?.name || "",
        price: menuDetail?.price || "",
        MenuImage: menuDetail?.image || null,
        categories: menuDetail?.categoryId?._id || ""
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 ">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    const formData = new FormData();
                    formData.append("name", values.MenuName);
                    formData.append("price", values.price);
                    formData.append("image", values.MenuImage);
                    formData.append("categoryId", values.categories);
                    if (!edit) formData.append("restaurantId", id);

                    try {
                        edit ? await updateMenuById(id, formData) : await createMenu(formData);
                        toast.success(`Menu item ${edit ? "updated" : "created"}!`);
                        navigate(-1);
                    } catch (e) {
                        toast.error("Update failed. Please check server connection.");
                    }
                }}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form>
                        <header className="max-w-7xl mx-auto p-4 md:py-4 md:px-8 space-y-6 bg-white">
                            <div className="max-w-7xl flex  justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all"
                                    >
                                        <FiArrowLeft size={20} />
                                    </button>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {edit ? "Edit Menu Item" : "Add New Dish"}
                                    </h1>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                                >
                                    <FiSave /> {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </header>

                        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <FiPackage /> Dish Name
                                        </label>
                                        <Field
                                            name="MenuName"
                                            placeholder="e.g. Classic Margherita"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <ErrorMessage name="MenuName" component="p" className="text-red-500 text-xs font-semibold mt-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <IndianRupee /> Price
                                        </label>
                                        <Field
                                            name="price"
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono"
                                        />
                                        <ErrorMessage name="price" component="p" className="text-red-500 text-xs font-semibold mt-1" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <FiTag /> Menu Category
                                    </label>
                                    <Field
                                        name="categories"
                                        as="select"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="categories" component="p" className="text-red-500 text-xs font-semibold mt-1" />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Media Upload</label>

                                <div className="relative group">
                                    <input
                                        id="menu-image"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                    />
                                    <label
                                        htmlFor="menu-image"
                                        className={`flex flex-col items-center justify-center w-full min-h-[320px] border-2 border-dashed rounded-3xl cursor-pointer transition-all relative overflow-hidden
                                            ${imagePreviewUrl ? 'border-indigo-400' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                                    >
                                        {imagePreviewUrl ? (
                                            <>
                                                <img src={imagePreviewUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                    <FiUploadCloud size={32} className="mb-2" />
                                                    <span className="font-bold">Replace Photo</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                                    <FiUploadCloud size={28} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">Drop your image here</p>
                                                <p className="text-xs text-gray-400 mt-2">Recommended: 800 x 600px (JPG, PNG)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <ErrorMessage name="MenuImage" component="p" className="text-red-500 text-xs font-semibold text-center" />
                            </div>
                        </main>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
