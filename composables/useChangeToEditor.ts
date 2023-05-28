import { Website, ThreeDCG, Animation, Editor } from "~/types";

export const useChangeToEditor = () => {
    return (data: Website | ThreeDCG | Animation): Editor => {
        return {
            _id: data._id,
            title: data.title,
            description: data.description,
            textEditor: data.textEditor,
            category: data.category,
            externalLink: data.externalLink,
            youtubeLink: (data as Animation)?.youtubeLink,
            photos: data.photos,
            updatedAt: data.updatedAt,
            createdAt: data.createdAt,
            visible: data.visible,
            homepage: data.homepage,
        };
    }
}