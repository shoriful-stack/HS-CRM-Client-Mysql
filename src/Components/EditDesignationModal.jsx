import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EditDesignationModal = ({ editDesignationModalOpen, setEditDesignationModalOpen, designation, refetch }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();


    useEffect(() => {
        if (designation) {
            // Set form values with designation data when modal opens
            setValue("designation", designation.designation);
            setValue("designation_status", designation.designation_status);
        }
    }, [designation, setValue]);
    const closeModal = () => {
        setEditDesignationModalOpen(false);
    };
    const onSubmit = async (data) => {
        console.log(data);

        const updatedDesignation = {
            designation: data.designation,
            designation_status: data.designation_status
        };
        const designationRes = await axiosSecure.patch(`/designations/${designation._id}`, updatedDesignation);
        console.log(designationRes.data);

        if (designationRes.data.modifiedCount > 0) {
            reset();
            refetch();
            queryClient.invalidateQueries(['employees']);
            toast.success(`${data.designation} updated successfully`, {autoClose: 1500});
            closeModal();
        }
        if (designationRes.data.modifiedCount === 0) {
            refetch();
            closeModal();
        }
    };

    return (
        <>
            {/* Modal Component */}
            {editDesignationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Designation</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    {...register("designation")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="designation_status"
                                    {...register("designation_status")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
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

export default EditDesignationModal;
