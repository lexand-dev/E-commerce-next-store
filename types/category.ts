import { IBillboard } from "./billboard";
import { IStore } from "./store";

export interface Category {
  id: string;
  storeId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  billboardId: string | null;
}

export interface CategoryWithRelations {
  category: Category;
  stores: IStore | null;
  billboard: IBillboard | null;
}
