export type CategoryType = 'output' | 'input';

export interface CategoryModel {
	id: string;
	name: string;
	info?: string;
	chartColor?: string;
	type: CategoryType;
	profileId: string;
	color?: string;
	icon?: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface Country {
	fullName: string;
	countryCode: string;
	currency: string;
	currencyName: string;
	currencySymbol: string;
	flag: string;
}
