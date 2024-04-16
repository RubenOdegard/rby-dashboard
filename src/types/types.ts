export type Urls = {
    id: number;
    url: string;
    category: string;
    favorite: boolean;
    createdAt?: string;
};

export type Projects = {
    id: number;
    project: string;
    createdAt?: string;
    livePreview?: string | null;
    github?: string | null;
};

export type ProjectUrls = {
    projectId: number | null;
    urlId: number | null;
};

