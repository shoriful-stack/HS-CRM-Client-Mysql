import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";

const EditCustomerModal = ({
  editModalOpen,
  setEditModalOpen,
  customer,
  refetch,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  // const queryClient = useQueryClient();

  useEffect(() => {
    if (customer) {
      // Set form values with customer data when modal opens
      setValue("customer_name", customer.customer_name);
      setValue("customer_phone", customer.customer_phone);
      setValue("customer_email", customer.customer_email);
      setValue("customer_address", customer.customer_address);
      setValue("customer_status", customer.customer_status);
    }
  }, [customer, setValue]);
  const closeModal = () => {
    setEditModalOpen(false);
  };
  const onSubmit = async (data) => {
    console.log(data);

    const updatedCustomer = {
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      customer_address: data.customer_address,
      customer_status: data.customer_status,
    };
    try {
      const customerRes = await axiosSecure.patch(
        `/customers/${customer.id}`,
        updatedCustomer
      );
      console.log(customerRes.data);

      if (customerRes?.data?.changedRows > 0) {
        reset();
        refetch();
        // queryClient.invalidateQueries(['projects']);
        toast.success(`${data.customer_name} updated successfully`, {
          autoClose: 1500,
        });
        closeModal();
      } else {
        reset();
        // Handle the case where the update was not successful
        toast.info("No changes made", { autoClose: 1500 });
        closeModal();
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("This customer already exists", { autoClose: 1500 });
    }
  };

  return (
    <>
      {/* Modal Component */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  {...register("customer_name")}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="customer_status"
                  {...register("customer_status")}
                  className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                >
                  <option className="hidden" value="">
                    Select Status
                  </option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
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
};

export default EditCustomerModal;
