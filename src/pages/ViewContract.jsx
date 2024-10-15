// src/Pages/ViewContract.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Loader from '../Components/Loader';
import { toast } from 'react-toastify';

const ViewContract = () => {
    const { id } = useParams(); // Extract the contract ID from URL
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response = await axiosSecure.get(`/contracts/view/${id}`);
                if (response.status === 200) {
                    setContract(response.data);
                } else {
                    toast.error('Failed to fetch contract details.');
                }
            } catch (error) {
                console.error('Error fetching contract:', error);
                toast.error('An error occurred while fetching contract details.');
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id, axiosSecure]);

    // const formatDate = (dateString) => {
    //     if (!dateString) return '';
    //     const date = new Date(dateString);
    //     if (isNaN(date.getTime())) return '';
    //     const options = { day: 'numeric', month: 'short', year: 'numeric' };
    //     return date.toLocaleDateString('en-GB', options);
    // };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (loading) {
        return <Loader />;
    }

    if (!contract) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-semibold">Attachment Not Found</h2>
                <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Go Back
                </button>
            </div>
        );
    }

    // Construct the file URL
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    if (!apiUrl) {
        console.error("VITE_APP_API_URL is not defined in the environment variables.");
        toast.error('API URL is not defined. Please contact the administrator.');
    }

    const fileUrl = `${apiUrl}/uploads/${contract.contract_file}`;
    console.log("File URL:", fileUrl); // For debugging

    const fileExtension = contract.contract_file.split('.').pop().toLowerCase();

    const renderFile = () => {
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return <img src={fileUrl} alt="Contract Attachment" className="w-full" />;
        } else if (['pdf'].includes(fileExtension)) {
            return <iframe src={fileUrl} className="w-full h-screen" title="Contract Attachment"></iframe>;
        } else {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download File
                </a>
            );
        }
    };

    return (
        <div className="p-3">
            <button onClick={handleBack} className="mb-4 px-3 py-[6px] text-sm bg-blue-500 text-white rounded-md">
                &larr; Back
            </button>
            <h2 className="text-xl font-semibold mb-2">Contract Details</h2>
            {/* <div className='flex justify-between gap-2'> */}
                {/* <div className="mb-6">
                    <p><strong>Title:</strong> {contract.contract_title}</p>
                    <p><strong>Customer Name:</strong> {contract.customer_name}</p>
                    <p><strong>Project Type:</strong> {contract.project_type === '1' ? 'Service' :
                        contract.project_type === '2' ? 'Product' :
                            'Supply & Service'}</p>
                    <p><strong>Ref No:</strong> {contract.refNo}</p>
                    <p><strong>First Party:</strong> {contract.first_party}</p>
                    <p><strong>Signing Date:</strong> {formatDate(contract.signing_date)}</p>
                    <p><strong>Effective Date:</strong> {formatDate(contract.effective_date)}</p>
                    <p><strong>Closing Date:</strong> {formatDate(contract.closing_date)}</p>
                    <p><strong>Status:</strong> {contract.contract_status === '1' ? 'Not Expired' : 'Expired'}</p>
                    <p><strong>Scan Copy Status:</strong> {contract.scan_copy_status === '1' ? 'Done' : 'Undone'}</p>
                    <p><strong>Hard Copy Status:</strong> {contract.hard_copy_status === '1' ? 'Found' : 'Not Found'}</p>
                </div> */}
                <div className="mb-6">
                    <div className="border p-4">
                        {renderFile()}
                    </div>
                </div>
            {/* </div> */}
        </div>
    );
};

export default ViewContract;