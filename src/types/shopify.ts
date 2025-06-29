// 商品列表shopify结构
export type IProductList = {
  data: {
    products: {
      edges: Array<{
        node: Product;
      }>;
    };
  };
};

// 商品列表响应对象
export type IProductListResponst = {
  status: number;
  body?: IProductList;
  error?: string;
};
type Price = {
  amount: number;
  currencyCode: string;
};
// shopify商品数据结构
export type Product = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  handle: string;
  priceRange: {
    minVariantPrice: Price;
  };
  images: {
    edges: Array<{
      node: Image;
    }>;
  };
};
// 商品图片
type Image = {
  url: string;
  altText?: string | null;
};
