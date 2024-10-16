import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AddProject_MasterModal = ({ isProject_MasterModalOpen, setIsProject_MasterModalOpen, refetch }) => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        console.log(data);

        const addProject = {
            project_name: data.project_name.trim(),
            project_code: data.project_code,
            project_status: data.project_status || 1
        }
        try{
            const projectRes = await axiosSecure.post('/projects_master', addProject);
            console.log(projectRes.data);
    
            if (projectRes.data.insertedId) {
                reset();
                refetch();
                toast.success(`${data.project_name} added successfully`, {autoClose: 1500});
                closeAddModal();
            }
        }catch (error) {
            toast.error(`${data.project_name} already exists.`);
            reset();
        }
    }

    const closeAddModal = () => {
        setIsProject_MasterModalOpen(false);
    };

    return (
        <>
            {/* Modal Component */}
            {isProject_MasterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
                        <button
                            onClick={closeAddModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-2">Add New Project</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="project_name"
                                        {...register("project_name", { required: true })}
                                        className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Code*
                                    </label>
                                    <input
                                        type="text"
                                        name="project_code"
                                        {...register("project_code", { required: true })}
                                        className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
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

export default AddProject_MasterModal;
