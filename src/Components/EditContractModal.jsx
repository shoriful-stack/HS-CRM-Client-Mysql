import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";

const EditContractModal = ({ editContractModalOpen, setEditContractModalOpen, contract, refetch }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    // const [allCustomers] = useAllCustomer();
    // const queryClient = useQueryClient();

    useEffect(() => {
        if (contract) {
            // Set form values with contract data when modal opens
            setValue('contract_title', contract.contract_title);
            setValue('project_name', contract.project_details.project_name);
            setValue('customer_name', contract.customer_name);
            setValue('project_category', contract.project_category === "1" ? "Service" :
                contract.project_category === "2" ? "Product" :
                    "Supply & Service"
            );
            setValue('refNo', contract.refNo);
            setValue('first_party', contract.first_party);
            // Format the dates for the date input fields
            if (contract.signing_date) {
                setValue('signing_date', new Date(contract.signing_date).toISOString().slice(0, 10));
            }
            if (contract.effective_date) {
                setValue('effective_date', new Date(contract.effective_date).toISOString().slice(0, 10));
            }
            if (contract.closing_date) {
                setValue('closing_date', new Date(contract.closing_date).toISOString().slice(0, 10));
            }
            setValue('scan_copy_status', contract.scan_copy_status);
            setValue('hard_copy_status', contract.hard_copy_status);
            // setValue('contract_file', contract.contract_file[0]);
        }
    }, [contract, setValue]);
    const closeEditContractModal = () => {
        setEditContractModalOpen(false);
    };
    const onSubmit = async (data) => {
        console.log(data);

        // Determine contract_status based on closing_date
        // const signing_date = new Date(data.signing_date);
        // const effectiveDate = new Date(data.effective_date);
        const closingDate = new Date(data.closing_date);
        const today = new Date();
        const contract_status = closingDate > today ? "1" : "0";

        // Optionally, you can display a message or set a state based on contract_status
        if (contract_status === "0") {
            toast.info("The contract will be marked as Expired.");
        } else {
            toast.info("The contract will be marked as Not Expired.");
        }

        const updatedContract = {
            contract_title: data.contract_title,
            project_name: data.project_name,
            customer_name: data.customer_name,
            project_category: data.project_category,
            refNo: data.refNo,
            first_party: data.first_party,
            signing_date: data.signing_date,
            effective_date: data.effective_date,
            closing_date: data.closing_date,
            scan_copy_status: data.scan_copy_status,
            hard_copy_status: data.hard_copy_status
        };
        const contractRes = await axiosSecure.patch(`/contracts/${contract._id}`, updatedContract);
        console.log(contractRes.data);

        if (contractRes.data.modifiedCount > 0) {
            reset();
            refetch();
            // queryClient.invalidateQueries(['contracts']);
            toast.success(`${data.contract_title} updated successfully`);
            closeEditContractModal();
        }
        if (contractRes.data.modifiedCount === 0) {
            refetch();
            closeEditContractModal();
        }
    };

    return (
        <>
            {/* Modal Component */}
            {editContractModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            onClick={closeEditContractModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Contract</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="contract_title"
                                        {...register("contract_title")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        name="project_name"
                                        value={contract.project_details.project_name}
                                        readOnly
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                    />

                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Type
                                    </label>
                                    <input
                                        type="text"
                                        name="project_category"
                                        value={contract.project_category === '1' ? 'Service' :
                                            contract.project_category === '2' ? 'Product' :
                                                'Supply & Service'
                                        }
                                        readOnly
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={contract.customer_name}
                                        readOnly
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Party
                                    </label>
                                    <input
                                        type="text"
                                        name="first_party"
                                        {...register("first_party")}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ref No.
                                    </label>
                                    <input
                                        type="text"
                                        name="refNo"
                                        {...register("refNo")}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Scan Copy Status
                                    </label>
                                    <select
                                        name="scan_copy_status"
                                        {...register("scan_copy_status")}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Status</option>
                                        <option value="1">Done</option>
                                        <option value="0">Undone</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hard Copy Status
                                    </label>
                                    <select
                                        name="hard_copy_status"
                                        {...register("hard_copy_status")}
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
                                        Signing Date
                                    </label>
                                    <input
                                        type="date"
                                        name="signing_date"
                                        {...register("signing_date")}
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
                            {/* <div>
                                <label className="text-md font-medium text-gray-700 mr-3">
                                    Attachment*
                                </label>
                                <input type="file" name="contract_file" {...register("contract_file", { required: true })} id="" />
                            </div> */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditContractModal}
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

export default EditContractModal;
