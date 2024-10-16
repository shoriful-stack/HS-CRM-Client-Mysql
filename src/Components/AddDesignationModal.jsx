import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AddDesignationModal = ({ isDesignationModalOpen, setIsDesignationModalOpen, refetch }) => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const closeModal = () => {
        setIsDesignationModalOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        console.log(data);

        const addDesignation = {
            designation: data.designation.trim(),
            designation_status: data.designation_status || 1
        }
        try {
            const designationRes = await axiosSecure.post('/designations', addDesignation);
            console.log(designationRes.data);

            if (designationRes.data.insertedId) {
                reset();
                refetch();
                toast.success(`${data.designation} added successfully`, {autoClose: 1500});
                closeModal();
            }
        } catch (error) {
            toast.error(`${data.designation} already exists.`);
            reset();
        }
    }

    return (
        <>
            {/* Modal Component */}
            {isDesignationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Designation</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Designation*
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    {...register("designation", { required: true })}
                                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
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

export default AddDesignationModal;
