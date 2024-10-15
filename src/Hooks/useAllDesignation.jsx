import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllDesignation = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allDesignations = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-designations"],
        queryFn: async () => {
            const res = await axiosSecure.get("/designations/all");
            return res.data;
        },
    });

    return [allDesignations, loading, refetch];
}

export default useAllDesignation;