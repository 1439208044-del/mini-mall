export interface CartItemForCalc {
  quantity: number;
  product: { price: number };
}

export function calcShipping(subtotal: number) {
  return subtotal > 100 ? 0 : 9.99;
}

export function calcTax(subtotal: number) {
  return subtotal * 0.08;
}

export function calcSubtotal(items: CartItemForCalc[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calcTotal(items: CartItemForCalc[]) {
  const subtotal = calcSubtotal(items);
  return subtotal + calcShipping(subtotal) + calcTax(subtotal);
}
