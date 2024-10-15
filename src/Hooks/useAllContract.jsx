import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllContract = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allContracts = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-Contracts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/contracts/all");
            return res.data;
        },
    });

    return [allContracts, loading, refetch];
}

export default useAllContract;