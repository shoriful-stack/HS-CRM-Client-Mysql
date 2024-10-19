import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
import useAllDepartment from "../Hooks/useAllDepartments";
import useAllDesignation from "../Hooks/useAllDesignation";

const EditEmployeeModal = ({
  editEmployeeModalOpen,
  setEditEmployeeModalOpen,
  employee,
  refetch,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [allDepartments] = useAllDepartment(); // This hook contain all the data of designations collection
  const [allDesignations] = useAllDesignation(); // This hook contain all the data of designations collection

  useEffect(() => {
    if (employee) {
      // Set form values with employee data when modal opens
      setValue("employee_name", employee.employee_name);
      setValue("department_name", employee.department_name);
      setValue("designation", employee.designation);
      setValue("employee_phone", employee.employee_phone);
      setValue("employee_email", employee.employee_email);
      setValue("employee_uid", employee.employee_uid);
    }
  }, [employee, setValue]);
  const closeEditEmployeeModal = () => {
    setEditEmployeeModalOpen(false);
  };
  const onSubmit = async (data) => {
    console.log(data);

    const updatedEmployee = {
      employee_name: data.employee_name,
      department_name: data.department_name,
      designation: data.designation,
      employee_phone: data.employee_phone,
      employee_email: data.employee_email,
      employee_uid: data.employee_uid,
      employee_pass: data.employee_pass,
    };
    const employeeRes = await axiosSecure.patch(
      `/employees/${employee.id}`,
      updatedEmployee
    );
    console.log(employeeRes.data);

    if (employeeRes.data.modifiedCount > 0) {
      reset();
      refetch();
      toast.success(`${data.employee_name} updated successfully`, {
        autoClose: 1500,
      });
      closeEditEmployeeModal();
    }
    if (employeeRes.data.modifiedCount === 0) {
      refetch();
      closeEditEmployeeModal();
    }
  };

  return (
    <>
      {/* Modal Component */}
      {editEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md px-6  py-4 relative">
            <button
              onClick={closeEditEmployeeModal}
              className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* Employee Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employee_name"
                    {...register("employee_name")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Office ID
                  </label>
                  <input
                    type="text"
                    name="employee_uid"
                    {...register("employee_uid")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              {/* Department and Designation dropdown */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name="department_name"
                    {...register("department_name")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Department
                    </option>
                    {allDepartments
                      .filter(
                        (department) => department.department_status === 1
                      )
                      .map((department) => (
                        <option
                          key={department._id}
                          value={department.department_name}
                        >
                          {department.department_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <select
                    name="designation"
                    {...register("designation")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Designation
                    </option>
                    {allDesignations
                      .filter(
                        (designation) => designation.designation_status === 1
                      )
                      .map((designation) => (
                        <option
                          key={designation._id}
                          value={designation.designation}
                        >
                          {designation.designation}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {/* Phone and Email */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="number"
                    name="employee_phone"
                    {...register("employee_phone")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="employee_email"
                    {...register("employee_email")}
                    className="mt-1 text-xs block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditEmployeeModal}
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

export default EditEmployeeModal;
