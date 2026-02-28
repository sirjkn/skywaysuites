import { AlertCircle, Mail } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { toast } from "sonner";
import { saveEmailSettings, initializeEmailJS, EmailSettings as EmailSettingsType } from '../../services/emailService';

interface EmailSettingsProps {
  emailSettings: EmailSettingsType;
  setEmailSettings: React.Dispatch<React.SetStateAction<EmailSettingsType>>;
}

export const EmailSettings = ({ emailSettings, setEmailSettings }: EmailSettingsProps) => {
  const handleSaveEmail = () => {
    saveEmailSettings(emailSettings);
    if (emailSettings.enabled) {
      const initialized = initializeEmailJS();
      if (initialized) {
        toast.success("Email settings saved and initialized successfully!");
      } else {
        toast.warning("Email settings saved but initialization failed. Check your credentials.");
      }
    } else {
      toast.success("Email settings saved successfully!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
      <h2 className="text-xl font-semibold text-[#36454F] mb-6">
        Email Notifications
      </h2>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
          <div>
            <Label htmlFor="emailEnabled">
              Enable Email Notifications
            </Label>
            <p className="text-sm text-[#36454F]/70">
              Send automated emails for bookings and approvals
            </p>
          </div>
          <Switch
            id="emailEnabled"
            checked={emailSettings.enabled}
            onCheckedChange={(checked) =>
              setEmailSettings({
                ...emailSettings,
                enabled: checked,
              })
            }
          />
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-[#36454F] mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            EmailJS Setup Instructions
          </h4>
          <ol className="text-sm text-[#36454F]/80 space-y-1 list-decimal list-inside mb-2">
            <li>Create a free account at <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">emailjs.com</a></li>
            <li>Add an email service (Gmail, Outlook, etc.)</li>
            <li>Create an email template with variables: to_email, to_name, property_name, check_in, check_out, total_price, booking_id, message</li>
            <li>Copy your Service ID, Template ID, and Public Key</li>
            <li>Paste them below and enable email notifications</li>
          </ol>
        </div>

        <div>
          <Label htmlFor="serviceId">Service ID</Label>
          <Input
            id="serviceId"
            value={emailSettings.serviceId}
            onChange={(e) =>
              setEmailSettings({
                ...emailSettings,
                serviceId: e.target.value,
              })
            }
            placeholder="service_xxxxxxx"
            className="mt-1 font-mono"
          />
          <p className="text-xs text-[#36454F]/60 mt-1">
            Find this in your EmailJS dashboard under Email Services
          </p>
        </div>

        <div>
          <Label htmlFor="templateId">Template ID</Label>
          <Input
            id="templateId"
            value={emailSettings.templateId}
            onChange={(e) =>
              setEmailSettings({
                ...emailSettings,
                templateId: e.target.value,
              })
            }
            placeholder="template_xxxxxxx"
            className="mt-1 font-mono"
          />
          <p className="text-xs text-[#36454F]/60 mt-1">
            Find this in your EmailJS dashboard under Email Templates
          </p>
        </div>

        <div>
          <Label htmlFor="publicKey">Public Key</Label>
          <Input
            id="publicKey"
            type="password"
            value={emailSettings.publicKey}
            onChange={(e) =>
              setEmailSettings({
                ...emailSettings,
                publicKey: e.target.value,
              })
            }
            placeholder="Your EmailJS public key"
            className="mt-1 font-mono"
          />
          <p className="text-xs text-[#36454F]/60 mt-1">
            Find this in your EmailJS Account settings
          </p>
        </div>

        <div>
          <Label htmlFor="adminEmail">Admin Email (for booking notifications)</Label>
          <Input
            id="adminEmail"
            type="email"
            value={emailSettings.adminEmail}
            onChange={(e) =>
              setEmailSettings({
                ...emailSettings,
                adminEmail: e.target.value,
              })
            }
            placeholder="admin@skywaysuites.com"
            className="mt-1"
          />
          <p className="text-xs text-[#36454F]/60 mt-1">
            Receive notifications when customers make bookings
          </p>
        </div>

        <div className="p-4 border border-green-500/20 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>✉️ Email Features:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Booking confirmation to customer</li>
              <li>Booking notification to admin</li>
              <li>Approval email with PDF receipt to customer</li>
            </ul>
          </p>
        </div>

        <Button
          onClick={handleSaveEmail}
          className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
        >
          Save Email Settings
        </Button>
      </div>
    </div>
  );
};
