import { prisma } from '../config/database.js';

export interface CartCalculation {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    slug: string;
    sku: string | null;
    image: string | null;
    unitPrice: number;
    compareAtPrice: number | null;
    discountPerUnit: number;
    quantity: number;
    itemSubtotal: number;
    itemTotal: number;
    inStock: boolean;
    availableStock: number;
  }>;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export class CartService {
  private async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    return cart;
  }

  async getCart(userId: string): Promise<CartCalculation> {
    const cart = await this.getOrCreateCart(userId);

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            images: {
              where: { viewType: 'hero' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let subtotal = 0;
    let discount = 0;
    let itemCount = 0;

    const formattedItems = cartItems.map(item => {
      const p = item.product;
      const unitPrice = parseFloat(p.price.toString());
      const compareAt = p.compareAtPrice ? parseFloat(p.compareAtPrice.toString()) : null;
      const discountPerUnit = compareAt && compareAt > unitPrice ? compareAt - unitPrice : 0;
      const itemSubtotal = unitPrice * item.quantity;
      const itemDiscount = discountPerUnit * item.quantity;

      subtotal += itemSubtotal;
      discount += itemDiscount;
      itemCount += item.quantity;

      const heroImg = p.images.length > 0 ? p.images[0].url : '/assets/products/hunting-h900-hero.svg';

      return {
        id: item.id,
        productId: p.id,
        productName: p.name,
        slug: p.slug,
        sku: p.sku,
        image: heroImg,
        unitPrice,
        compareAtPrice: compareAt,
        discountPerUnit,
        quantity: item.quantity,
        itemSubtotal,
        itemTotal: itemSubtotal,
        inStock: p.isActive && p.stock >= item.quantity,
        availableStock: p.stock
      };
    });

    // Free shipping on all Hunting projectors (> ₹5,000 threshold)
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    return {
      id: cart.id,
      items: formattedItems,
      itemCount,
      subtotal,
      discount,
      shipping,
      total
    };
  }

  async addItem(userId: string, productIdOrSlug: string, quantity = 1) {
    if (quantity <= 0) {
      throw new Error('Quantity must be at least 1.');
    }

    // Resolve product by ID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productIdOrSlug },
          { slug: productIdOrSlug }
        ]
      }
    });

    if (!product) {
      throw new Error('Projector not found in catalog.');
    }

    if (!product.isActive) {
      throw new Error(`'${product.name}' is currently unavailable for purchase.`);
    }

    if (product.stock < 1) {
      throw new Error(`'${product.name}' is currently out of stock.`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > product.stock) {
      throw new Error(`Only ${product.stock} units of '${product.name}' are available.`);
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity
        }
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: string, identifier: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        OR: [
          { id: identifier },
          { productId: identifier }
        ]
      },
      include: { product: true }
    });

    if (!item) {
      throw new Error('Item not found in your cart.');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: item.id }
      });
      return this.getCart(userId);
    }

    if (quantity > item.product.stock) {
      throw new Error(`Only ${item.product.stock} units of '${item.product.name}' are available.`);
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, identifier: string) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        OR: [
          { id: identifier },
          { productId: identifier }
        ]
      }
    });

    if (item) {
      await prisma.cartItem.delete({
        where: { id: item.id }
      });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return this.getCart(userId);
  }

  async mergeGuestCart(userId: string, guestItems: Array<{ productId: string; quantity: number }>) {
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return this.getCart(userId);
    }

    for (const item of guestItems) {
      try {
        if (item.productId && item.quantity > 0) {
          await this.addItem(userId, item.productId, item.quantity);
        }
      } catch (error) {
        // Continue merging other items if one item exceeds stock
      }
    }

    return this.getCart(userId);
  }
}

export const cartService = new CartService();
