import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EditCustomerModal = ({ editModalOpen, setEditModalOpen,  customer, refetch}) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    

    useEffect(() => {
        if (customer) {
            // Set form values with customer data when modal opens
            setValue("name", customer.name);
            setValue("phone", customer.phone);
            setValue("email", customer.email);
            setValue("address", customer.address);
            setValue("status", customer.status);
        }
    }, [customer, setValue]);
    const closeModal = () => {
        setEditModalOpen(false);
    };
    const onSubmit = async (data) => {
        console.log(data);

        const updatedCustomer = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            status: data.status
        };
        const customerRes = await axiosSecure.patch(`/customers/${customer._id}`, updatedCustomer);
        console.log(customerRes.data);

        if (customerRes.data.modifiedCount > 0) {
            reset();
            refetch();
            queryClient.invalidateQueries(['projects']);
            toast.success(`${data.name} updated successfully`, {autoClose: 1500});
            closeModal();
        }
        if (customerRes.data.modifiedCount === 0) {
            refetch();
            closeModal();
        }
    };

    return (
        <>
            {/* Modal Component */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    {...register("name")}
                                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="phone"
                                        name="phone"
                                        {...register("phone")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        {...register("email")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    type="text"
                                    name="address"
                                    {...register("address")}
                                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                     name="status"
                                     {...register("status")}
                                     className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option className="hidden" value="">Select Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-teal-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditCustomerModal;
