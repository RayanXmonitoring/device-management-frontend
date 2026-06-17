export const validators = {
  // Email validation
  email: (value) => {
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return pattern.test(value) ? null : 'Email tidak valid';
  },

  // Password validation
  password: (value) => {
    if (value.length < 6) {
      return 'Password minimal 6 karakter';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password harus mengandung huruf kapital';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password harus mengandung huruf kecil';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password harus mengandung angka';
    }
    return null;
  },

  // PIN validation (6 digits)
  pin: (value) => {
    if (!/^\d{6}$/.test(value)) {
      return 'PIN harus 6 digit angka';
    }
    return null;
  },

  // Device ID validation
  deviceId: (value) => {
    if (!/^[A-Za-z0-9-]{8,36}$/.test(value)) {
      return 'Device ID tidak valid';
    }
    return null;
  },

  // Phone number validation
  phone: (value) => {
    const pattern = /^\+?[0-9]{10,15}$/;
    return pattern.test(value) ? null : 'Nomor telepon tidak valid';
  },

  // Required field
  required: (value) => {
    if (!value || value.trim() === '') {
      return 'Field ini wajib diisi';
    }
    return null;
  },

  // Min length
  minLength: (min) => (value) => {
    if (value.length < min) {
      return `Minimal ${min} karakter`;
    }
    return null;
  },

  // Max length
  maxLength: (max) => (value) => {
    if (value.length > max) {
      return `Maksimal ${max} karakter`;
    }
    return null;
  },

  // URL validation
  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL tidak valid';
    }
  },

  // IP Address validation
  ipAddress: (value) => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(value)) {
      return 'IP Address tidak valid';
    }
    const parts = value.split('.');
    for (const part of parts) {
      if (parseInt(part) > 255) {
        return 'IP Address tidak valid';
      }
    }
    return null;
  },
};

// Validate object with schema
export const validateObject = (data, schema) => {
  const errors = {};
  for (const [key, validators] of Object.entries(schema)) {
    const value = data[key];
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
