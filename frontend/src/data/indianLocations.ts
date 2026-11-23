/**
 * Comprehensive Indian States, Union Territories and Primary Cities Dataset
 * Designed for offline-first, zero-external-API, fast autocomplete and validation.
 */

export interface StateCityData {
  state: string;
  cities: string[];
}

export const INDIAN_STATES_AND_CITIES: StateCityData[] = [
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Vizianagaram']
  },
  {
    state: 'Arunachal Pradesh',
    cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila']
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon']
  },
  {
    state: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar']
  },
  {
    state: 'Chandigarh',
    cities: ['Chandigarh']
  },
  {
    state: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur']
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    cities: ['Daman', 'Diu', 'Silvassa']
  },
  {
    state: 'Delhi',
    cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Dwarka', 'Rohini', 'Connaught Place']
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda']
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Bharuch']
  },
  {
    state: 'Haryana',
    cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula']
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Una']
  },
  {
    state: 'Jammu and Kashmir',
    cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore']
  },
  {
    state: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Hazaribagh', 'Giridih']
  },
  {
    state: 'Karnataka',
    cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi']
  },
  {
    state: 'Kerala',
    cities: ['Thiruvananthempuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram']
  },
  {
    state: 'Ladakh',
    cities: ['Leh', 'Kargil']
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa']
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Kolhapur', 'Amravati', 'Nanded']
  },
  {
    state: 'Manipur',
    cities: ['Imphal', 'Churachandpur', 'Thoubal']
  },
  {
    state: 'Meghalaya',
    cities: ['Shillong', 'Tura', 'Jowai']
  },
  {
    state: 'Mizoram',
    cities: ['Aizawl', 'Lunglei', 'Champhai']
  },
  {
    state: 'Nagaland',
    cities: ['Kohima', 'Dimapur', 'Mokokchung']
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak']
  },
  {
    state: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Hoshiarpur', 'Batala', 'Pathankot']
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar']
  },
  {
    state: 'Sikkim',
    cities: ['Gangtok', 'Namchi', 'Geyzing']
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Kanchipuram']
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda']
  },
  {
    state: 'Tripura',
    cities: ['Agartala', 'Udaipur', 'Dharmanagar']
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Greater Noida', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur']
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Kashipur', 'Nainital']
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur', 'Haldia']
  }
];

export const ALL_INDIAN_STATES = INDIAN_STATES_AND_CITIES.map(item => item.state);

/**
 * Validates 6-digit Indian Postal PIN codes.
 * Returns { isValid: boolean, message?: string }
 */
export function validateIndianPincode(pincode: string): { isValid: boolean; message: string } {
  const trimmed = pincode.trim();
  if (!trimmed) {
    return { isValid: false, message: 'PIN Code is required.' };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { isValid: false, message: 'PIN Code must contain numeric digits only.' };
  }
  if (trimmed.length !== 6) {
    return { isValid: false, message: 'PIN Code must be exactly 6 digits.' };
  }
  if (trimmed.startsWith('0')) {
    return { isValid: false, message: 'Invalid Indian PIN Code: cannot start with 0.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates 10-digit Indian Mobile Numbers.
 */
export function validateIndianPhone(phone: string): { isValid: boolean; message: string } {
  // Strip spaces, dashes, leading +91 or 0
  const clean = phone.replace(/[\s\-\(\)]/g, '').replace(/^(\+91|91|0)/, '');
  if (!clean) {
    return { isValid: false, message: 'Phone number is required.' };
  }
  if (!/^\d+$/.test(clean)) {
    return { isValid: false, message: 'Phone number must contain digits only.' };
  }
  if (clean.length !== 10) {
    return { isValid: false, message: 'Please enter a valid 10-digit mobile number.' };
  }
  if (!/^[6-9]/.test(clean)) {
    return { isValid: false, message: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
  }
  return { isValid: true, message: '' };
}
