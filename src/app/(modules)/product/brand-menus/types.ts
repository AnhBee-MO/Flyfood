export type DishStatus = "selling" | "paused";

export type DishRecord = {
  id: string;
  name: string;
  image: string;
  code: string;
  categoryId: string;
  brandId: string;
  price: number;
  status: DishStatus;
  description: string;
  sellingUnit: string;
  nutritionalInfo: string;
  allergenInfo: string;
  shelfLifeStorage: string;
};

export type BrandRecord = {
  id: string;
  name: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type DishFormValues = {
  name: string;
  code: string;
  categoryId: string;
  brandId: string;
  description: string;
  imageFileName: string;
  sellingUnit: string;
  nutritionalInfo: string;
  allergenInfo: string;
  shelfLifeStorage: string;
};

export type BrandMenusResponse = {
  brands: BrandRecord[];
  categories: SelectOption[];
  dishes: DishRecord[];
};
