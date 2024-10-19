import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast} from "react-toastify";

const AddModal = ({isModalOpen, setIsModalOpen, refetch}) => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        console.log(data);

        const addCustomer = {
            customer_name: data.customer_name,
            customer_phone: data.customer_phone.trim(),
            customer_email: data.customer_email.trim(),
            customer_address: data.customer_address,
            customer_status: data.customer_status || 1
        }

        try{
            const customerRes = await axiosSecure.post('/customers', addCustomer);
            console.log(customerRes.data);
    
            if (customerRes.data.insertedId) {
                reset();
                refetch();
                toast.success(`${data.customer_name} added successfully`, {autoClose: 1500});
                closeModal();
            }
        }catch (error){
            console.log(error)
            toast.error(`${data.customer_name} already exists.`, {autoClose: 1500});
        }
    }


    return (
        <>
            {/* Modal Component */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Customer Name*
                                </label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    {...register("customer_name", { required: true })}
                                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="phone"
                                        name="customer_phone"
                                        {...register("customer_phone")}
                                        className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        {...register("customer_email")}
                                        className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    type="text"
                                    name="customer_address"
                                    {...register("customer_address")}
                                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mr-2 text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 text-sm py-2 bg-green-500 text-white rounded-md hover:bg-teal-600"
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

export default AddModal;
