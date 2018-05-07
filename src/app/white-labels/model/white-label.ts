export interface IWhiteLabelFilters {
	searchStr?: string;
	sortBy?: string;
}

export interface IWhiteLabelQueryParams extends IWhiteLabelFilters {
	skip: number;
	limit: number;
}

export interface IWhiteLabel {}
