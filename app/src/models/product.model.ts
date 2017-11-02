export interface ProductModel {
    'id': string;
    'cover' : string;
    'title': string;
    'price': string;
}
export interface ProductsModel {
    'total': number;
    'row': ProductModel;
}
