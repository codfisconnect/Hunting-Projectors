import { 
  validateIndianPincode, 
  validateIndianPhone, 
  INDIAN_STATES_AND_CITIES,
  ALL_INDIAN_STATES 
} from '../data/indianLocations';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

export function runAddressValidationSelfTests() {
  // 1. PIN code tests
  assert(validateIndianPincode('600001').isValid === true, '600001 should be valid');
  assert(validateIndianPincode('110001').isValid === true, '110001 should be valid');
  assert(validateIndianPincode('560001').isValid === true, '560001 should be valid');
  assert(validateIndianPincode('').isValid === false, 'Empty pincode should be invalid');
  assert(validateIndianPincode('60000').isValid === false, '5-digit pincode should be invalid');
  assert(validateIndianPincode('6000001').isValid === false, '7-digit pincode should be invalid');
  assert(validateIndianPincode('60000A').isValid === false, 'Alpha pincode should be invalid');
  assert(validateIndianPincode('012345').isValid === false, 'PIN starting with 0 should be invalid');

  // 2. Phone tests
  assert(validateIndianPhone('9876543210').isValid === true, '9876543210 should be valid');
  assert(validateIndianPhone('8765432109').isValid === true, '8765432109 should be valid');
  assert(validateIndianPhone('+91 98765 43210').isValid === true, '+91 should be valid');
  assert(validateIndianPhone('1234567890').isValid === false, 'Starting with 1 should be invalid');
  assert(validateIndianPhone('98765').isValid === false, 'Short phone should be invalid');

  // 3. States & Cities
  assert(ALL_INDIAN_STATES.length >= 30, 'Should have >= 30 states/UTs');
  assert(ALL_INDIAN_STATES.includes('Tamil Nadu'), 'Should include Tamil Nadu');
  const tn = INDIAN_STATES_AND_CITIES.find(s => s.state === 'Tamil Nadu');
  assert(Boolean(tn && tn.cities.includes('Chennai')), 'Tamil Nadu should have Chennai');

  console.log('All Indian Address & PIN validation checks passed successfully.');
}
