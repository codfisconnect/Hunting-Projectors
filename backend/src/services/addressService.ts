import { prisma } from '../config/database.js';

export interface AddressDTO {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  addressType?: string;
  isDefault?: boolean;
}

export class AddressService {
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });
    if (!address) {
      throw new Error('Address not found or does not belong to this account.');
    }
    return address;
  }

  async createAddress(userId: string, data: AddressDTO) {
    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      country = 'India',
      addressType = 'HOME',
      isDefault = false
    } = data;

    if (!fullName?.trim() || !phoneNumber?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
      throw new Error('Full name, phone, address line 1, city, state, and pincode are required.');
    }

    const pinClean = pincode.trim().replace(/\s+/g, '');
    if (!/^\d{6}$/.test(pinClean)) {
      throw new Error('Please enter a valid 6-digit Indian PIN code.');
    }

    // Check if this is the user's first address
    const count = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = isDefault || count === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim() || null,
        landmark: landmark?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        pincode: pinClean,
        country: country.trim(),
        addressType: addressType.toUpperCase(),
        isDefault: shouldBeDefault
      }
    });

    return address;
  }

  async updateAddress(userId: string, addressId: string, data: Partial<AddressDTO>) {
    await this.getAddressById(userId, addressId);

    if (data.pincode) {
      const pinClean = data.pincode.trim().replace(/\s+/g, '');
      if (!/^\d{6}$/.test(pinClean)) {
        throw new Error('Please enter a valid 6-digit Indian PIN code.');
      }
      data.pincode = pinClean;
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName: data.fullName?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        addressLine1: data.addressLine1?.trim(),
        addressLine2: data.addressLine2 !== undefined ? (data.addressLine2?.trim() || null) : undefined,
        landmark: data.landmark !== undefined ? (data.landmark?.trim() || null) : undefined,
        city: data.city?.trim(),
        state: data.state?.trim(),
        pincode: data.pincode,
        country: data.country?.trim(),
        addressType: data.addressType?.toUpperCase(),
        isDefault: data.isDefault
      }
    });

    return updated;
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.getAddressById(userId, addressId);

    await prisma.address.delete({
      where: { id: addressId }
    });

    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return true;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await this.getAddressById(userId, addressId);

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    return updated;
  }
}

export const addressService = new AddressService();
