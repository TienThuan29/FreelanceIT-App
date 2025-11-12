import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';

export type RatingDTO = {
    id: string;
    userId: string;
    stars: number;
    comment?: string;
    createdDate: string | Date;
    updatedDate: string | Date;
    userFullname?: string;
};

export type CreateRatingInput = {
    stars: number;
    comment?: string;
};

export type UpdateRatingInput = {
    stars?: number;
    comment?: string;
};

const useRating = () => {
    const axios = useAxios();

    const getAll = async (): Promise<RatingDTO[]> => {
        const res = await axios.get(Api.Rating.GET_ALL);
        return res.data.dataResponse as RatingDTO[];
    };

    const getMy = async (): Promise<RatingDTO[]> => {
        const res = await axios.get(Api.Rating.GET_MY);
        return res.data.dataResponse as RatingDTO[];
    };

    const getById = async (id: string): Promise<RatingDTO> => {
        const res = await axios.get(`${Api.Rating.GET_BY_ID}/${id}`);
        return res.data.dataResponse as RatingDTO;
    };

    const create = async (input: CreateRatingInput): Promise<RatingDTO> => {
        const res = await axios.post(Api.Rating.CREATE, input);
        return res.data.dataResponse as RatingDTO;
    };

    const update = async (id: string, input: UpdateRatingInput): Promise<RatingDTO> => {
        const res = await axios.put(`${Api.Rating.UPDATE}/${id}`, input);
        return res.data.dataResponse as RatingDTO;
    };

    const remove = async (id: string): Promise<boolean> => {
        const res = await axios.delete(`${Api.Rating.DELETE}/${id}`);
        return !!res.data.success;
    };

    return {
        getAll,
        getMy,
        getById,
        create,
        update,
        remove,
    };
};

export default useRating;

