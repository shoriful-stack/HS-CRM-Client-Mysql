const ViewEmployee = ({ isOpen, onClose, employee }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
            <h3 className="font-bold text-lg">Employee Details</h3>
            {employee && (
              <div className="mt-4">
                <p>
                  <strong>Name:</strong> {employee.employee_name}
                </p>
                <p>
                  <strong>UID:</strong> {employee.employee_uid}
                </p>
                <p>
                  <strong>Email:</strong> {employee.employee_email}
                </p>
                <p>
                  <strong>Phone:</strong> {employee.employee_phone}
                </p>
                <p>
                  <strong>Department:</strong> {employee.department_name}
                </p>
                <p>
                  <strong>Designation:</strong> {employee.designation}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewEmployee;
