import { IProductList, IProductListResponst } from "@/types/shopify";

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ status: number; body?: T; error?: string }> {
  try {
    // 读取环境变量
    const apiUrl = process.env.NEXT_PUBLIC_SHOPIFY_API_URL;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_FRONTEND_ACCESS_TOKEN;

    console.log(apiUrl, accessToken, "apiUrl, accessToken");

    if (!apiUrl || !accessToken) {
      throw new Error("API URL or Access Token is not configured.");
    }
    // 发送请求
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseBody: T = await response.json();
    // 返回结果
    return {
      status: response.status,
      body: responseBody,
    };
  } catch (error) {
    // 调试错误处理 部署时删除
    console.error("Error fetching data:", (error as Error).message);
    return {
      status: 500,
      error: (error as Error).message || "Error receiving data",
    };
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
