import { fetchJson } from './api';
import { Address, AddressInput } from '../types/address';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const res = await fetchJson<{ success: boolean; data: Address[] }>('/addresses');
    return res.data;
  },

  async createAddress(data: AddressInput): Promise<Address> {
    const res = await fetchJson<{ success: boolean; data: Address }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateAddress(id: string, data: Partial<AddressInput>): Promise<Address> {
    const res = await fetchJson<{ success: boolean; data: Address }>(`/addresses/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await fetchJson(`/addresses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async setDefaultAddress(id: string): Promise<Address> {
    const res = await fetchJson<{ success: boolean; data: Address }>(`/addresses/${encodeURIComponent(id)}/default`, {
      method: 'PATCH',
    });
    return res.data;
  },
};
