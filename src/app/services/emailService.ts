import emailjs from '@emailjs/browser';

export interface EmailSettings {
  enabled: boolean;
  serviceId: string;
  templateId: string;
  publicKey: string;
  adminEmail: string;
}

/**
 * Get email settings from localStorage
 */
export const getEmailSettings = (): EmailSettings => {
  const stored = localStorage.getItem('emailSettings');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    enabled: false,
    serviceId: '',
    templateId: '',
    publicKey: '',
    adminEmail: 'admin@skywaysuites.com',
  };
};

/**
 * Save email settings to localStorage
 */
export const saveEmailSettings = (settings: EmailSettings): void => {
  localStorage.setItem('emailSettings', JSON.stringify(settings));
};

/**
 * Initialize EmailJS with settings
 */
export const initializeEmailJS = (): boolean => {
  const settings = getEmailSettings();
  if (!settings.enabled || !settings.publicKey) {
    return false;
  }
  
  emailjs.init(settings.publicKey);
  return true;
};

/**
 * Send booking confirmation email to customer
 */
export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  bookingDetails: {
    propertyName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    bookingId: string;
  }
): Promise<{ success: boolean; message: string }> => {
  const settings = getEmailSettings();
  
  if (!settings.enabled) {
    return { success: false, message: 'Email service is not enabled' };
  }

  try {
    const templateParams = {
      to_email: customerEmail,
      to_name: customerName,
      subject: 'Booking Confirmation - Skyway Suites',
      property_name: bookingDetails.propertyName,
      check_in: bookingDetails.checkIn,
      check_out: bookingDetails.checkOut,
      total_price: `Ksh ${bookingDetails.totalPrice.toLocaleString()}`,
      booking_id: bookingDetails.bookingId,
      message: `Your booking has been received and is pending approval. You will receive another email once your booking is confirmed.`,
    };

    await emailjs.send(
      settings.serviceId,
      settings.templateId,
      templateParams
    );

    return { success: true, message: 'Confirmation email sent to customer' };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

/**
 * Send booking notification email to admin
 */
export const sendAdminBookingNotification = async (
  bookingDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    bookingId: string;
  }
): Promise<{ success: boolean; message: string }> => {
  const settings = getEmailSettings();
  
  if (!settings.enabled || !settings.adminEmail) {
    return { success: false, message: 'Admin email not configured' };
  }

  try {
    const templateParams = {
      to_email: settings.adminEmail,
      to_name: 'Admin',
      subject: 'New Booking Received - Skyway Suites',
      customer_name: bookingDetails.customerName,
      customer_email: bookingDetails.customerEmail,
      customer_phone: bookingDetails.customerPhone,
      property_name: bookingDetails.propertyName,
      check_in: bookingDetails.checkIn,
      check_out: bookingDetails.checkOut,
      total_price: `Ksh ${bookingDetails.totalPrice.toLocaleString()}`,
      booking_id: bookingDetails.bookingId,
      message: `A new booking has been received and requires your approval.`,
    };

    await emailjs.send(
      settings.serviceId,
      settings.templateId,
      templateParams
    );

    return { success: true, message: 'Notification email sent to admin' };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, message: 'Failed to send admin notification' };
  }
};

/**
 * Send booking approval email to customer with PDF receipt
 */
export const sendBookingApprovalEmail = async (
  customerEmail: string,
  customerName: string,
  bookingDetails: {
    propertyName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    bookingId: string;
  },
  pdfBase64?: string
): Promise<{ success: boolean; message: string }> => {
  const settings = getEmailSettings();
  
  if (!settings.enabled) {
    return { success: false, message: 'Email service is not enabled' };
  }

  try {
    const templateParams = {
      to_email: customerEmail,
      to_name: customerName,
      subject: 'Booking Approved - Skyway Suites',
      property_name: bookingDetails.propertyName,
      check_in: bookingDetails.checkIn,
      check_out: bookingDetails.checkOut,
      total_price: `Ksh ${bookingDetails.totalPrice.toLocaleString()}`,
      booking_id: bookingDetails.bookingId,
      message: `Great news! Your booking has been approved. Please find your receipt attached.`,
      pdf_receipt: pdfBase64 || '',
    };

    await emailjs.send(
      settings.serviceId,
      settings.templateId,
      templateParams
    );

    return { success: true, message: 'Approval email sent to customer' };
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { success: false, message: 'Failed to send approval email' };
  }
};
