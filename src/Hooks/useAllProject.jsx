import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllProject = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allProjects = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-projects"],
        queryFn: async () => {
            const res = await axiosSecure.get("/projects/all");
            return res.data;
        },
    });

    return [allProjects, loading, refetch];
}

export default useAllProject;