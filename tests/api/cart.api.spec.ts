import { test, expect } from '@playwright/test';
import {
  addItemToCart,
  clearCartRequest,
  deleteCartItem,
  deleteCartItemRaw,
  getCart,
  getFirstInStockProductId,
} from '../../utils/cartApi';
import type { CartItem } from '../../types/cart';

test.use({ storageState: 'playwright/.auth/user.json' });

// API tests share the same user cart — serial mode prevents race conditions between workers
test.describe.configure({ mode: 'serial' });

let productId: number = 0;

test.describe('Cart API - positive', () => {
  test.beforeAll(async ({ request }) => {
    productId = await getFirstInStockProductId(request, 'varztas');
    if (!productId)
      throw new Error('Failed to fetch test product ID — suite cannot run');
  });

  test.beforeEach(async ({ request }) => {
    await clearCartRequest(request);
  });

  test(
    'should return cart with correct items',
    { tag: ['@smoke', '@api'] },
    async ({ request }) => {
      const [added] = await addItemToCart(request, productId);

      const { items } = await getCart(request);

      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(added.id);
      expect(items[0].quantity).toBe(1);
    },
  );

  test(
    'should delete cart item successfully',
    { tag: ['@regression', '@api'] },
    async ({ request }) => {
      const [item] = await addItemToCart(request, productId);

      const { items } = await deleteCartItem(request, item.id);

      expect(items).not.toContainEqual(
        expect.objectContaining({ id: item.id }),
      );
    },
  );

  test(
    'should validate response schema',
    { tag: ['@regression', '@api'] },
    async ({ request }) => {
      await addItemToCart(request, productId);

      const { items } = await getCart(request);
      const item: CartItem = items[0];

      expect(item.id).toEqual(expect.any(Number));
      expect(item.quantity).toEqual(expect.any(Number));
      expect(item.totalPrice).toEqual(expect.any(Number));
    },
  );
});

test.describe('Cart API - negative', () => {
  test.beforeEach(async ({ request }) => {
    await clearCartRequest(request);
  });

  test(
    'should return error for invalid item ID',
    { tag: ['@regression', '@api'] },
    async ({ request }) => {
      // omitting required $itemId variable triggers GraphQL validation error
      const res = await deleteCartItemRaw(request, {});

      expect(res.status()).toBe(400);
      const body = await res.json();
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
    },
  );
});
