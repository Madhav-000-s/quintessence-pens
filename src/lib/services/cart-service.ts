import { POST } from "@/app/api/cart/route";
import type { AddToCartRequest, CartItemResponse, UpdateCartRequest } from "@/types/api";

/**
 * Add a pen to the customer's cart
 */
export async function addToCart(
  penId: number,
  customerId: number,
  count: number,
  totalPrice: number
): Promise<CartItemResponse> {
  const requestBody: AddToCartRequest = {
    customer: customerId,
    pen: penId,
    count,
    total_price: totalPrice,
    isActive: true,
  };

  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add item to cart");
  }
  const response2 = await fetch("/api/orders/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({penId, count})
  });
  return response.json();
}

/**
 * Get all cart items for a customer
 */
export async function getCart(customerId: number): Promise<CartItemResponse[]> {
  const response = await fetch(`/api/cart?customer_id=${customerId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch cart");
  }

  return response.json();
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartQuantity(cartId: number, count: number): Promise<CartItemResponse> {
  const requestBody: UpdateCartRequest = {
    id: cartId,
    count,
  };

  const response = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update cart item");
  }

  return response.json();
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(cartId: number): Promise<void> {
  const response = await fetch(`/api/cart?id=${cartId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove cart item");
  }
}

/**
 * Clear all items from a customer's cart
 */
export async function clearCart(customerId: number): Promise<void> {
  const items = await getCart(customerId);

  await Promise.all(items.map((item) => removeFromCart(item.id)));
}

/**
 * Get the total count of items in the cart
 */
export async function getCartItemCount(customerId: number): Promise<number> {
  const items = await getCart(customerId);
  return items.reduce((total, item) => total + (item.count || 1), 0);
}

/**
 * Get the total price of all items in the cart
 */
export async function getCartTotal(customerId: number): Promise<number> {
  const items = await getCart(customerId);
  return items.reduce((total, item) => total + (item.total_price || 0), 0);
}
