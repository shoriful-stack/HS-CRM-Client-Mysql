import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
const AddContractModal = ({ isAddContractModalOpen, setIsAddContractModalOpen, selectedProject, refetch }) => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();


    const onSubmit = async (data) => {
        console.log(data);

        // contract_status based on closing_date
        // const signingDate = new Date(data.signing_date_date);
        // const effectiveDate = new Date(data.effective_date);
        const closingDate = new Date(data.closing_date);
        const today = new Date();
        const contract_status = closingDate > today ? "1" : "0";

        if (contract_status === "0") {
            toast.info("The contract will be marked as Expired.");
        } else {
            toast.info("The contract will be marked as Not Expired.");
        }

        // Create a FormData object to hold the form values and the file
        const formData = new FormData();

        // Append form fields to FormData
        formData.append('contract_title', data.contract_title);
        formData.append('project_id', data.project_id);
        formData.append('project_name', data.project_name);
        formData.append('customer_name', data.customer_name);
        formData.append('project_category', data.project_category);
        formData.append('refNo', data.refNo);
        formData.append('first_party', data.first_party);
        formData.append('signing_date', data.signing_date);
        formData.append('effective_date', data.effective_date);
        formData.append('closing_date', data.closing_date);
        formData.append('scan_copy_status', data.scan_copy_status);
        formData.append('hard_copy_status', data.hard_copy_status);
        formData.append('contract_file', data.contract_file[0]);

        try {
            // Send the form data (including the file) to the backend
            const contractRes = await axiosSecure.post('/contracts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(contractRes.data);

            if (contractRes.data.insertedId) {
                reset();
                refetch();
                toast.success(`${data.contract_title} added successfully`, { autoClose: 1500 });
                closeAddModal();
            }
        } catch (error) {
            console.error('Error uploading contract:', error);
            toast.error('This project already have a contract');
            reset();
        }
    };

    const closeAddModal = () => {
        setIsAddContractModalOpen(false);
    };

    return (
        <>
            {/* Modal Component */}
            {isAddContractModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                        <button
                            onClick={closeAddModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Contract</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title*
                                    </label>
                                    <input
                                        type="text"
                                        name="contract_title"
                                        {...register("contract_title", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                {selectedProject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Project Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="project_name"
                                            value={selectedProject.project_name}
                                            readOnly
                                            className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                        />
                                        <input
                                            type="hidden"
                                            name="project_id"
                                            value={selectedProject._id}
                                            {...register("project_id", { required: true })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {selectedProject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Project Category*
                                        </label>
                                        <input
                                            type="text"
                                            name="project_category"
                                            value={selectedProject.project_category === '1' ? 'Service' :
                                                selectedProject.project_category === '2' ? 'Product' :
                                                'Supply & Service'
                                            }
                                            readOnly
                                            className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                        />
                                    </div>
                                )}

                                {selectedProject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Customer Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={selectedProject.customer_name}
                                            readOnly
                                            className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Party*
                                    </label>
                                    <input
                                        type="text"
                                        name="first_party"
                                        {...register("first_party", { required: true })}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ref No.*
                                    </label>
                                    <input
                                        type="text"
                                        name="refNo"
                                        {...register("refNo", { required: true })}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Scan Copy Status*
                                    </label>
                                    <select
                                        name="scan_copy_status"
                                        {...register("scan_copy_status", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Status</option>
                                        <option value="1">Done</option>
                                        <option value="0">Undone</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hard Copy Status*
                                    </label>
                                    <select
                                        name="hard_copy_status"
                                        {...register("hard_copy_status", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Status</option>
                                        <option value="1">Found</option>
                                        <option value="0">Not Found</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Signing Date*
                                    </label>
                                    <input
                                        type="date"
                                        name="signing_date"
                                        {...register("signing_date", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Effective Date
                                    </label>
                                    <input
                                        type="date"
                                        name="effective_date"
                                        {...register("effective_date")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Closing Date
                                    </label>
                                    <input
                                        type="date"
                                        name="closing_date"
                                        {...register("closing_date")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-md font-medium text-gray-700 mr-3">
                                    Attachment*
                                </label>
                                <input type="file" name="contract_file" {...register("contract_file", { required: true })} id="" />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="mr-2 px-4 py-[6px] text-base bg-red-500 text-white rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-[6px] text-base bg-green-500 text-white rounded-md hover:bg-teal-600"
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

export default AddContractModal;
