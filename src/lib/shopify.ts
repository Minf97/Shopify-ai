import { IProductList, IProductListResponst } from "@/types/shopify";
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ status: number; body?: T; error?: string }> {
  try {
    // 读取环境变量
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const graphqlEndpoint = process.env.SHOPIFY_GRAPHQL_API_ENDPOINT;
    const accessToken = process.env.SHOPIFY_FRONTEND_ACCESS_TOKEN;

    // 构建完整的 API URL
    const apiUrl = `https://${storeDomain}${graphqlEndpoint}`;

    if (!storeDomain || !graphqlEndpoint || !accessToken) {
      throw new Error("Shopify configuration is not complete. Please check SHOPIFY_STORE_DOMAIN, SHOPIFY_GRAPHQL_API_ENDPOINT, and access token.");
    }

    // 配置代理（只在服务端）
    let httpsAgent = undefined;
    if (typeof window === 'undefined') {
      const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
      const allProxy = process.env.ALL_PROXY || process.env.all_proxy;
      
      if (httpsProxy) {
        console.log("Using HTTPS proxy:", httpsProxy);
        httpsAgent = new HttpsProxyAgent(httpsProxy);
      } else if (allProxy) {
        console.log("Using ALL proxy:", allProxy);
        if (allProxy.startsWith('socks')) {
          httpsAgent = new SocksProxyAgent(allProxy);
        } else {
          httpsAgent = new HttpsProxyAgent(allProxy);
        }
      }
    }

    // 使用 axios 发送请求
    const response = await axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      data: { query, variables },
      httpsAgent: httpsAgent,
      timeout: 10000, // 10 秒超时
    });

    // 返回结果
    return {
      status: response.status,
      body: response.data,
    };
  } catch (error) {
    // axios 错误处理
    console.error("=== Shopify Fetch Error (Axios) ===");
    if (axios.isAxiosError(error)) {
      console.error("Axios error message:", error.message);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request config:", error.config?.url);
      
      return {
        status: error.response?.status || 500,
        error: error.message || "Axios request failed",
      };
    } else {
      console.error("Non-axios error:", (error as Error).message);
      return {
        status: 500,
        error: (error as Error).message || "Error receiving data",
      };
    }
  }
}

export async function fetchProductList(): Promise<IProductListResponst> {
  const productsListQuery = `
    query {
      products(first: 6) {
        edges {
          node {
            id
            title
            description
            tags
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  // 使用刚刚定义的函数发送请求
  const result = await shopifyFetch<IProductList>(productsListQuery);
  if (result.status === 200) {
    return { status: 200, body: result.body };
  } else {
    // 调试使用
    console.error("Failed to fetch product list:", result.error);
    return {
      status: 500,
      error: result.error || "Failed to fetch product list.",
    };
  }
}

// 获取分类列表
export async function fetchCollections(): Promise<{ status: number; body?: any; error?: string }> {
  const collectionsQuery = `
    query {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch(collectionsQuery);
  if (result.status === 200) {
    return { status: 200, body: result.body };
  } else {
    console.error("Failed to fetch collections:", result.error);
    return {
      status: 500,
      error: result.error || "Failed to fetch collections.",
    };
  }
}

// 根据分类获取商品
export async function fetchProductsByCollection(collectionHandle: string, first: number = 12): Promise<{ status: number; body?: any; error?: string }> {
  const productsQuery = `
    query {
      collection(handle: "${collectionHandle}") {
        id
        title
        description
        image {
          url
          altText
        }
        products(first: ${first}) {
          edges {
            node {
              id
              title
              handle
              description
              tags
              productType
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch(productsQuery);
  if (result.status === 200) {
    return { status: 200, body: result.body };
  } else {
    console.error("Failed to fetch products by collection:", result.error);
    return {
      status: 500,
      error: result.error || "Failed to fetch products by collection.",
    };
  }
}

// 根据分类和搜索词获取商品建议
export async function fetchProductSuggestions(query?: string, collectionHandle?: string): Promise<{ status: number; body?: any; error?: string }> {
  let productsQuery = `
    query {
      products(first: 10${query ? `, query: "${query}"` : ''}) {
        edges {
          node {
            id
            title
            handle
            productType
            tags
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            collections(first: 1) {
              edges {
                node {
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  `;

  // 如果指定了分类，按分类查询
  if (collectionHandle) {
    productsQuery = `
      query {
        collection(handle: "${collectionHandle}") {
          products(first: 10${query ? `, query: "${query}"` : ''}) {
            edges {
              node {
                id
                title
                handle
                productType
                tags
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                collections(first: 1) {
                  edges {
                    node {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  const result = await shopifyFetch(productsQuery);
  if (result.status === 200) {
    return { status: 200, body: result.body };
  } else {
    console.error("Failed to fetch product suggestions:", result.error);
    return {
      status: 500,
      error: result.error || "Failed to fetch product suggestions.",
    };
  }
}
