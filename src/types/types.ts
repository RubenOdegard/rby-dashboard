export type Projects = {
	id: number;
	project: string;
	createdAt?: string;
	livePreview?: string | null;
	github?: string | null;
};

export interface ProjectUrls {
	id: number;
	url: string;
	owner: string;
	projectId: number | null;
	urlId: number | null;
}

export type Urls = {
	id: number;
	url: string;
	category: string;
	createdAt?: string;
	favorite: boolean;
};

export type ProjectUrlData = {
	id: number;
	url: string;
	category: string;
	favorite: boolean;
	createdAt: string;
	owner: string;
	projectId: number | null;
};
