import { Page } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { GRAPHQL_URL, STOCK_LOCATION_ID } from '../data/constants';
import type { CartItem } from '../types/cart';

const CART_QUERY = `
  query cart($stockLocationId: Int!) {
    cart(stockLocationId: $stockLocationId) {
      items { id quantity totalPrice }
    }
  }
`;

const CREATE_CART_ITEM_MUTATION = `
  mutation addToCart($productId: Int!, $quantity: Int!) {
    createCartItem(productId: $productId, quantity: $quantity) {
      items { id quantity totalPrice }
    }
  }
`;

const DELETE_CART_ITEM_MUTATION = `
  mutation deleteCartItem($itemId: Int!) {
    deleteCartItem(itemId: $itemId) {
      items { id }
    }
  }
`;

export { CART_QUERY, CREATE_CART_ITEM_MUTATION };

export async function getCart(
  request: APIRequestContext,
): Promise<{ items: CartItem[] }> {
  const res = await request.post(GRAPHQL_URL, {
    data: {
      operationName: 'cart',
      variables: { stockLocationId: STOCK_LOCATION_ID },
      query: CART_QUERY,
    },
  });
  const body = await res.json();
  return body.data?.cart ?? { items: [] };
}

export async function addItemToCart(
  request: APIRequestContext,
  productId: number,
  quantity = 1,
): Promise<CartItem[]> {
  const res = await request.post(GRAPHQL_URL, {
    data: {
      operationName: 'addToCart',
      variables: { productId, quantity },
      query: CREATE_CART_ITEM_MUTATION,
    },
  });
  const body = await res.json();
  return body.data?.createCartItem?.items ?? [];
}

export async function deleteCartItem(
  request: APIRequestContext,
  itemId: number,
): Promise<{ items: { id: number }[] }> {
  const res = await request.post(GRAPHQL_URL, {
    data: {
      operationName: 'deleteCartItem',
      variables: { itemId },
      query: DELETE_CART_ITEM_MUTATION,
    },
  });
  const body = await res.json();
  return body.data?.deleteCartItem ?? { items: [] };
}

export async function deleteCartItemRaw(
  request: APIRequestContext,
  variables: Record<string, unknown>,
) {
  return request.post(GRAPHQL_URL, {
    data: {
      operationName: 'deleteCartItem',
      variables,
      query: DELETE_CART_ITEM_MUTATION,
    },
  });
}

export async function clearCartRequest(
  request: APIRequestContext,
): Promise<void> {
  const { items } = await getCart(request);
  for (const item of items) {
    await deleteCartItem(request, item.id);
  }
}

export async function getFirstInStockProductId(
  request: APIRequestContext,
  searchTerm: string,
): Promise<number> {
  const res = await request.post(GRAPHQL_URL, {
    data: {
      operationName: 'searchProducts',
      variables: { searchString: searchTerm, rows: 10 },
      query: `query searchProducts($searchString: String, $rows: Int) {
        products(searchString: $searchString, rows: $rows) {
          edges { node { id stockItems { quantity } } }
        }
      }`,
    },
  });
  const body = await res.json();
  const edges: { node: { id: string; stockItems: { quantity: number }[] } }[] =
    body.data?.products?.edges ?? [];
  const inStock = edges.find(({ node }) =>
    node.stockItems.some((s) => s.quantity > 0),
  );
  if (!inStock)
    throw new Error(`No in-stock product found for: "${searchTerm}"`);
  return Number(inStock.node.id);
}

export async function clearCart(page: Page): Promise<void> {
  const cartResponse = await page.request.post(GRAPHQL_URL, {
    data: {
      operationName: 'cart',
      variables: { stockLocationId: STOCK_LOCATION_ID },
      query: `query cart($stockLocationId: Int!) {
        cart(stockLocationId: $stockLocationId) {
          items { id }
        }
      }`,
    },
  });

  if (!cartResponse.ok()) return;

  const cartData = await cartResponse.json();
  const items: { id: number }[] = cartData?.data?.cart?.items ?? [];

  for (const item of items) {
    await page.request.post(GRAPHQL_URL, {
      data: {
        operationName: 'deleteCartItem',
        variables: { itemId: item.id },
        query: `mutation deleteCartItem($itemId: Int!) {
          deleteCartItem(itemId: $itemId) {
            items { id }
          }
        }`,
      },
    });
  }
}
