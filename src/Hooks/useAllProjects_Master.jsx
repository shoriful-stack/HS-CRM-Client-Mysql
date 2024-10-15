import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of projects_master collection
const useAllProjects_Master = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allProjects = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-projects"],
        queryFn: async () => {
            const res = await axiosSecure.get("/projects_master/all");
            return res.data;
        },
    });

    return [allProjects, loading, refetch];
}

export default useAllProjects_Master;