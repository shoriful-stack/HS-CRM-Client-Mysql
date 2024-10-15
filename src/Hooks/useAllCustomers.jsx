import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllCustomer = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allCustomers = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-customers"],
        queryFn: async () => {
            const res = await axiosSecure.get("/customers/all");
            return res.data;
        },
    });

    return [allCustomers, loading, refetch];
}

export default useAllCustomer;