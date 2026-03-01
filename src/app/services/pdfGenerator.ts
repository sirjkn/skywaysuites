import jsPDF from 'jspdf';
import type { Booking, Property, Customer } from './api';

export interface ReceiptData {
  booking: Booking;
  property: Property;
  customer: Customer;
}

/**
 * Generate PDF receipt for a booking
 */
export const generateBookingReceipt = (data: ReceiptData): jsPDF => {
  const doc = new jsPDF();
  const { booking, property, customer } = data;

  // Colors
  const primaryColor = '#6B7F39';
  const darkGray = '#36454F';
  const lightGray = '#F5F5F5';

  // Header - Company Logo/Name
  doc.setFillColor(107, 127, 57); // #6B7F39
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SKYWAY SUITES', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Property Rentals', 105, 30, { align: 'center' });

  // Receipt Title
  doc.setTextColor(darkGray);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING RECEIPT', 105, 55, { align: 'center' });

  // Booking ID and Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #: ${booking.id}`, 20, 70);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 70);

  // Customer Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Customer Information', 20, 85);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray);
  doc.text(`Name: ${customer.name}`, 20, 95);
  doc.text(`Email: ${customer.email}`, 20, 102);
  doc.text(`Phone: ${customer.phone}`, 20, 109);
  if (customer.address) {
    doc.text(`Address: ${customer.address}`, 20, 116);
  }

  // Property Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Property Details', 20, 130);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray);
  doc.text(`Property: ${property.name}`, 20, 140);
  doc.text(`Location: ${property.location}`, 20, 147);
  doc.text(`Category: ${property.category}`, 20, 154);
  doc.text(`Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms}`, 20, 161);

  // Booking Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Booking Details', 20, 175);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray);
  doc.text(`Check-In: ${booking.checkIn}`, 20, 185);
  doc.text(`Check-Out: ${booking.checkOut}`, 20, 192);
  doc.text(`Status: ${booking.status.toUpperCase()}`, 20, 199);

  // Calculate number of nights
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  // Price Breakdown Table
  doc.setFillColor(lightGray);
  doc.rect(20, 210, 170, 10, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray);
  doc.text('Description', 25, 217);
  doc.text('Amount', 160, 217);

  // Line items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  let yPos = 227;
  doc.text(`${property.name} (${nights} night${nights > 1 ? 's' : ''})`, 25, yPos);
  doc.text(`Ksh ${property.price.toLocaleString()}`, 160, yPos);

  // Divider line
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);

  // Total
  yPos += 10;
  doc.setFillColor(primaryColor);
  doc.rect(20, yPos - 7, 170, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL AMOUNT', 25, yPos);
  doc.text(`Ksh ${booking.totalPrice.toLocaleString()}`, 160, yPos);

  // Footer
  doc.setTextColor(darkGray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const footerY = 270;
  doc.text('Thank you for choosing Skyway Suites!', 105, footerY, { align: 'center' });
  doc.text('For inquiries, contact us at: info@skywaysuites.com | +254 700 000 000', 105, footerY + 5, { align: 'center' });
  
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY + 10, 190, footerY + 10);

  return doc;
};

/**
 * Download receipt as PDF
 */
export const downloadReceipt = (data: ReceiptData): void => {
  const doc = generateBookingReceipt(data);
  doc.save(`Skyway-Suites-Receipt-${data.booking.id}.pdf`);
};

/**
 * Get receipt as base64 string (for email attachment)
 */
export const getReceiptBase64 = (data: ReceiptData): string => {
  const doc = generateBookingReceipt(data);
  return doc.output('dataurlstring');
};

/**
 * Preview receipt in new window
 */
export const previewReceipt = (data: ReceiptData): void => {
  const doc = generateBookingReceipt(data);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
