import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";

const EditDepartmentModal = ({ editDepartmentModalOpen, setEditDepartmentModalOpen, department, refetch }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    // const queryClient = useQueryClient();


    useEffect(() => {
        if (department) {
            // Set form values with department data when modal opens
            setValue("department_name", department.department_name);
            setValue("department_status", department.department_status);
        }
    }, [department, setValue]);
    const closeModal = () => {
        setEditDepartmentModalOpen(false);
    };
    const onSubmit = async (data) => {
        const updatedDepartment = {
            department_name: data.department_name,
            department_status: data.department_status
        };

        try {
            const departmentRes = await axiosSecure.patch(`/departments/${department.id}`, updatedDepartment);
            console.log(departmentRes.data);

            if (departmentRes?.data?.changedRows > 0) {
                reset();
                refetch();
                // queryClient.invalidateQueries(['employees']);
                toast.success(`${data.department_name} updated successfully`, { autoClose: 1500 });
                closeModal();
            }else {
                reset();
                // Handle the case where the update was not successful
                toast.info('No changes made', { autoClose: 1500 });
                closeModal();
            }
        } catch (error) {
            console.error("Failed to update department:", error);
            toast.error('This Department already exists', { autoClose: 1500 });
        }
    };

    return (
        <>
            {/* Modal Component */}
            {editDepartmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-4 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-2">Edit Department</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    name="department_name"
                                    {...register("department_name")}
                                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="department_status"
                                    {...register("department_status")}
                                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
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
                                    className="mr-2 text-xs px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 text-xs py-2 bg-green-500 text-white rounded-md hover:bg-teal-600"
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

export default EditDepartmentModal;
