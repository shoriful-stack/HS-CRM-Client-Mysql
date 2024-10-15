import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EditProject_MasterModal = ({ editProject_MasterModalOpen, setEditProject_MasterModalOpen, project_master, refetch }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (project_master) {
            // Set form values with customer data when modal opens
            setValue("project_name", project_master.project_name);
            setValue("project_code", project_master.project_code);
            setValue("project_status", project_master.project_status);
        }
    }, [project_master, setValue]);
    const closeEditProjectModal = () => {
        setEditProject_MasterModalOpen(false);
    };
    const onSubmit = async (data) => {
        console.log(data);

        const updatedProject = {
            project_name: data.project_name,
            project_code: data.project_code,
            project_status: data.project_status
        };
        const projectRes = await axiosSecure.patch(`/projects_master/${project_master._id}`, updatedProject);
        console.log(projectRes.data);

        if (projectRes.data.modifiedCount > 0) {
            reset();
            refetch();
            queryClient.invalidateQueries(['projects']);
            toast.success(`${data.project_name} updated successfully`);
            closeEditProjectModal();
        }
        if (projectRes.data.modifiedCount === 0) {
            refetch();
            closeEditProjectModal();
        }
    };

    return (
        <>
            {/* Modal Component */}
            {editProject_MasterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeEditProjectModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex justify-between items-center gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        name="project_name"
                                        {...register("project_name")}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Code
                                    </label>
                                    <input
                                        type="text"
                                        name="project_code"
                                        {...register("project_code")}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="project_status"
                                    {...register("project_status")}
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
                                    onClick={closeEditProjectModal}
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

export default EditProject_MasterModal;
