import { prisma } from '../config/database.js';
import { cartService } from './cartService.js';
import { addressService } from './addressService.js';

export interface CreateOrderDTO {
  addressId?: string;
  shippingAddress?: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  paymentMethod?: string;
  directItem?: {
    productId: string;
    quantity: number;
  };
}

export class OrderService {
  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `HPT-${dateStr}-${randomHex}`;
  }

  async calculateCheckout(userId: string, directItem?: { productId: string; quantity: number }) {
    let itemsToProcess: Array<{ productId: string; quantity: number }> = [];

    if (directItem) {
      itemsToProcess = [directItem];
    } else {
      const cart = await cartService.getCart(userId);
      if (cart.items.length === 0) {
        throw new Error('Your cart is empty. Add a projector before proceeding to checkout.');
      }
      itemsToProcess = cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }));
    }

    let subtotal = 0;
    let discount = 0;
    const verifiedItems = [];

    for (const item of itemsToProcess) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { where: { viewType: 'hero' }, take: 1 }
        }
      });

      if (!product) {
        throw new Error(`Projector item no longer exists in catalog.`);
      }

      if (!product.isActive) {
        throw new Error(`'${product.name}' is currently unavailable for purchase.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient inventory: only ${product.stock} units of '${product.name}' remain.`);
      }

      const unitPrice = parseFloat(product.price.toString());
      const compareAt = product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null;
      const unitDiscount = compareAt && compareAt > unitPrice ? compareAt - unitPrice : 0;
      const lineSubtotal = unitPrice * item.quantity;
      const lineDiscount = unitDiscount * item.quantity;

      subtotal += lineSubtotal;
      discount += lineDiscount;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        image: product.images[0]?.url || '/assets/products/hunting-h900-hero.svg',
        quantity: item.quantity,
        unitPrice,
        compareAtPrice: compareAt,
        lineSubtotal
      });
    }

    // Free standard express shipping on all orders across India
    const shipping = 0;
    const total = subtotal + shipping;

    return {
      items: verifiedItems,
      subtotal,
      discount,
      shipping,
      shippingAmount: shipping,
      total
    };
  }

  async createOrder(userId: string, data: CreateOrderDTO) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // Resolve Shipping Address
    let addressData: any = null;

    const targetAddressId = data.addressId || (data as any).shippingAddressId;
    if (targetAddressId) {
      const dbAddress = await addressService.getAddressById(userId, targetAddressId);
      addressData = {
        fullName: dbAddress.fullName,
        phoneNumber: dbAddress.phoneNumber,
        addressLine1: dbAddress.addressLine1,
        addressLine2: dbAddress.addressLine2,
        landmark: dbAddress.landmark,
        city: dbAddress.city,
        state: dbAddress.state,
        pincode: dbAddress.pincode,
        country: dbAddress.country,
      };
    } else if (data.shippingAddress) {
      const s = data.shippingAddress;
      if (!s.fullName || !s.phoneNumber || !s.addressLine1 || !s.city || !s.state || !s.pincode) {
        throw new Error('Complete shipping address (name, phone, address line 1, city, state, pincode) is required.');
      }
      addressData = {
        fullName: s.fullName.trim(),
        phoneNumber: s.phoneNumber.trim(),
        addressLine1: s.addressLine1.trim(),
        addressLine2: s.addressLine2?.trim() || null,
        landmark: s.landmark?.trim() || null,
        city: s.city.trim(),
        state: s.state.trim(),
        pincode: s.pincode.trim(),
        country: s.country?.trim() || 'India',
      };
    } else {
      // Try to find user's default address
      const defaultAddr = await prisma.address.findFirst({
        where: { userId, isDefault: true }
      });
      if (!defaultAddr) {
        throw new Error('Please select or provide a delivery address.');
      }
      addressData = {
        fullName: defaultAddr.fullName,
        phoneNumber: defaultAddr.phoneNumber,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2,
        landmark: defaultAddr.landmark,
        city: defaultAddr.city,
        state: defaultAddr.state,
        pincode: defaultAddr.pincode,
        country: defaultAddr.country,
      };
    }

    // Server-side recalculation and stock validation
    const calculation = await this.calculateCheckout(userId, data.directItem);

    const orderNumber = this.generateOrderNumber();

    // Execute order creation and inventory decrement in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify and decrement stock atomically
      for (const item of calculation.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!prod || prod.stock < item.quantity) {
          throw new Error(`Inventory check failed for '${item.name}'. Order could not be completed.`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 2. Create Order record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: addressData.fullName,
          customerPhone: addressData.phoneNumber,
          customerEmail: user.email,
          addressLine: `${addressData.addressLine1}${addressData.addressLine2 ? ', ' + addressData.addressLine2 : ''}`,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          shippingAddress: addressData,
          subtotal: calculation.subtotal,
          shippingAmount: calculation.shipping,
          discountAmount: calculation.discount,
          totalAmount: calculation.total,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: data.paymentMethod || 'DIRECT_BANK_OR_WHATSAPP',
          items: {
            create: calculation.items.map(item => ({
              productId: item.productId,
              productName: item.name,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { viewType: 'hero' }, take: 1 }
                }
              }
            }
          }
        }
      });

      // 3. Clear user's cart if order was from cart
      if (!data.directItem) {
        const userCart = await tx.cart.findUnique({ where: { userId } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      return newOrder;
    });

    return order;
  }

  async getCustomerOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { viewType: 'hero' }, take: 1 }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(userId: string, orderIdOrNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [
          { id: orderIdOrNumber },
          { orderNumber: orderIdOrNumber }
        ]
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { viewType: 'hero' }, take: 1 }
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found or access denied.');
    }

    return order;
  }

  async cancelOrder(userId: string, orderIdOrNumber: string, reason?: string) {
    const order = await this.getOrderById(userId, orderIdOrNumber);

    // Cancellation policy: Only PENDING or CONFIRMED orders can be cancelled
    const cancellableStatuses = ['PENDING', 'CONFIRMED'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new Error(`Order #${order.orderNumber} cannot be cancelled because it is already '${order.orderStatus}'.`);
    }

    // Restore inventory in transaction
    const cancelled = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: 'CANCELLED',
        },
        include: {
          items: true
        }
      });
    });

    return cancelled;
  }

  async confirmTestPayment(userId: string, orderIdOrNumber: string) {
    const order = await this.getOrderById(userId, orderIdOrNumber);

    if (order.paymentStatus === 'PAID') {
      return order;
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        orderStatus: order.orderStatus === 'PENDING' ? 'CONFIRMED' : order.orderStatus
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { viewType: 'hero' }, take: 1 }
              }
            }
          }
        }
      }
    });

    return updated;
  }
}

export const orderService = new OrderService();
