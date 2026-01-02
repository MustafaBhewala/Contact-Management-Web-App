import { useState, useEffect } from 'react';
import API_URL from '../config/api';

const ContactForm = ({ onContactAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name cannot exceed 50 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const validateMessage = (message) => {
    if (message.length > 500) return 'Message cannot exceed 500 characters';
    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Real-time validation
  useEffect(() => {
    if (touched.name) {
      setErrors(prev => ({ ...prev, name: validateName(formData.name) }));
    }
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }));
    }
    if (touched.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
    }
    if (touched.message) {
      setErrors(prev => ({ ...prev, message: validateMessage(formData.message) }));
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onContactAdded(data.data, 'Contact added successfully! 🎉');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTouched({});
        setErrors({});
      } else {
        onContactAdded(null, data.message || 'Failed to add contact', 'error');
      }
    } catch (error) {
      onContactAdded(null, 'Network error. Please check your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.name.trim() && 
    formData.email.trim() && 
    formData.phone.trim() &&
    !errors.name && 
    !errors.email && 
    !errors.phone && 
    !errors.message;

  return (
    <div className="neo-card p-10 transition-transform duration-300" style={{transform: 'rotate(1deg)'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(1deg)'}>
      <h2 className="neo-heading text-4xl mb-8 flex items-center gap-3">
        <span className="text-5xl">📇</span>
        Add New Contact
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block font-bold mb-2 text-lg" style={{color: '#FFFFFF'}}>
            Name <span style={{color: '#FFFFFF'}}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="neo-input"
            style={errors.name && touched.name ? {borderColor: '#FFFFFF', boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)'} : {}}
            placeholder="Enter your name"
          />
          {errors.name && touched.name && (
            <p className="font-bold mt-2 text-sm" style={{color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'}}>⚠️ {errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block font-bold mb-2 text-lg" style={{color: '#FFFFFF'}}>
            Email <span style={{color: '#FFFFFF'}}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="neo-input"
            style={errors.email && touched.email ? {borderColor: '#FFFFFF', boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)'} : {}}
            placeholder="Enter your email"
          />
          {errors.email && touched.email && (
            <p className="font-bold mt-2 text-sm" style={{color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'}}>⚠️ {errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block font-bold mb-2 text-lg" style={{color: '#FFFFFF'}}>
            Phone <span style={{color: '#FFFFFF'}}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="neo-input"
            style={errors.phone && touched.phone ? {borderColor: '#FFFFFF', boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)'} : {}}
            placeholder="Enter your phone number"
          />
          {errors.phone && touched.phone && (
            <p className="font-bold mt-2 text-sm" style={{color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'}}>⚠️ {errors.phone}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block font-bold mb-2 text-lg" style={{color: '#FFFFFF'}}>
            Message <span className="text-sm" style={{color: 'rgba(255, 255, 255, 0.5)'}}>(Optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            className="neo-input resize-none"
            style={errors.message && touched.message ? {borderColor: '#FFFFFF', boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)'} : {}}
            placeholder="Enter your message (optional)"
          />
          <div className="flex justify-between items-center mt-2">
            {errors.message && touched.message && (
              <p className="font-bold text-sm" style={{color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'}}>⚠️ {errors.message}</p>
            )}
            <p className="text-sm font-semibold ml-auto" style={{color: 'rgba(255, 255, 255, 0.6)'}}>
              {formData.message.length}/500
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="neo-btn neo-btn-primary w-full"
        >
          {isSubmitting ? '⚡ SAVING...' : '➕ ADD CONTACT'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
