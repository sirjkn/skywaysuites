import { useState } from 'react';
import { Palette, MessageSquare, CreditCard, Database, HardDrive, MessageCircle, Image as ImageIcon, Upload, X, Settings as SettingsIcon, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { convertToWebP, isValidImageFile } from '../../utils/imageUtils';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState(() => {
    const stored = localStorage.getItem('generalSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
    return {
      currency: 'Ksh',
      currencySymbol: 'Ksh',
      timezone: 'Africa/Nairobi',
      companyName: 'Skyway Suites',
      companyEmail: 'info@skywaysuites.com',
      companyPhone: '+254 700 000 000',
      companyAddress: 'Nairobi, Kenya',
      companyWebsite: 'www.skywaysuites.com',
      logo: '',
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon!',
    };
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#6B7F39',
    secondaryColor: '#F5E6D3',
    darkMode: false,
  });

  const [sliderSettings, setSliderSettings] = useState<Slide[]>(() => {
    const stored = localStorage.getItem('heroSlides');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading slider settings:', error);
      }
    }
    return [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIyMDA3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Find Your Perfect Home',
        subtitle: 'Luxury living spaces in prime locations',
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1612645213559-6af1d4edeaf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzcyMjEzNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Modern Comfort Awaits',
        subtitle: 'Discover beautifully designed suites',
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1674494777503-f5d3484104c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW50aG91c2UlMjBiYWxjb255JTIwdmlld3xlbnwxfHx8fDE3NzIxOTA2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Breathtaking Views',
        subtitle: 'Experience elevated living',
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1611094016919-36b65678f3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzIyMTM3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Elegant Interiors',
        subtitle: 'Thoughtfully curated spaces',
      },
    ];
  });

  const [uploadingSlideImage, setUploadingSlideImage] = useState<number | null>(null);

  const [smsSettings, setSmsSettings] = useState({
    provider: 'twilio',
    apiKey: '',
    apiSecret: '',
    senderName: 'Skyway Suites',
    enabled: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mpesa: { enabled: true, tillNumber: '', apiKey: '' },
    stripe: { enabled: false, publicKey: '', secretKey: '' },
    paypal: { enabled: false, clientId: '', secret: '' },
  });

  const [dbSettings, setDbSettings] = useState({
    host: 'YOUR_DATABASE_HOST',
    port: '5432',
    database: 'skyway_suites',
    username: 'YOUR_DB_USERNAME',
    password: '',
  });

  const [whatsappSettings, setWhatsappSettings] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('contactDetailsSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading contact details settings:', error);
      }
    }
    return {
      enabled: true,
      phoneNumber: '+254 700 000 000',
      email: 'info@skywaysuites.com',
      message: 'Hello! I would like to inquire about your properties.',
    };
  });

  const handleSaveGeneralSettings = () => {
    toast.success('General settings saved successfully');
    // Store in localStorage for the floating button
    localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
    window.dispatchEvent(new Event('generalSettingsChanged'));
  };

  const handleSaveTheme = () => {
    toast.success('Theme settings saved successfully');
    // TODO: Connect to your database API
    console.log('Theme settings:', themeSettings);
  };

  const handleSaveSMS = () => {
    toast.success('SMS settings saved successfully');
    // TODO: Connect to your database API
    console.log('SMS settings:', smsSettings);
  };

  const handleSavePayment = () => {
    toast.success('Payment settings saved successfully');
    // TODO: Connect to your database API
    console.log('Payment settings:', paymentSettings);
  };

  const handleSaveDatabase = () => {
    toast.success('Database settings saved successfully');
    // TODO: Connect to your database API
    console.log('Database settings:', dbSettings);
  };

  const handleSaveWhatsApp = () => {
    toast.success('Contact details settings saved successfully');
    // TODO: Connect to your database API
    console.log('Contact details settings:', whatsappSettings);
    // Store in localStorage for the floating button
    localStorage.setItem('contactDetailsSettings', JSON.stringify(whatsappSettings));
    window.dispatchEvent(new Event('whatsappSettingsChanged'));
  };

  const handleBackup = () => {
    toast.success('Backup created successfully');
    // TODO: Implement backup functionality with your backend
  };

  const handleRestore = () => {
    toast.info('Restore functionality - Connect to your backend');
    // TODO: Implement restore functionality with your backend
  };

  const handleUploadSlideImage = async (event: React.ChangeEvent<HTMLInputElement>, slideId: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!isValidImageFile(file)) {
      toast.error('Invalid image file. Please upload a valid image.');
      return;
    }

    setUploadingSlideImage(slideId);
    try {
      const webPImage = await convertToWebP(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      setSliderSettings((prevSlides) => 
        prevSlides.map((slide) => 
          slide.id === slideId ? { ...slide, image: webPImage } : slide
        )
      );
      toast.success('Image uploaded and converted to WebP successfully!');
    } catch (error) {
      console.error('Error converting image to WebP:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingSlideImage(null);
    }
  };

  const handleRemoveSlideImage = (slideId: number) => {
    setSliderSettings((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === slideId ? { ...slide, image: '' } : slide
      )
    );
  };

  const handleSaveSliderSettings = () => {
    toast.success('Slider settings saved successfully');
    // Store in localStorage for the floating button
    localStorage.setItem('heroSlides', JSON.stringify(sliderSettings));
    window.dispatchEvent(new Event('sliderSettingsChanged'));
  };

  const handleUploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!isValidImageFile(file)) {
      toast.error('Invalid image file. Please upload a valid image.');
      return;
    }

    setUploadingLogo(true);
    try {
      const webPImage = await convertToWebP(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      setGeneralSettings((prevSettings) => ({ ...prevSettings, logo: webPImage }));
      toast.success('Logo uploaded and converted to WebP successfully!');
    } catch (error) {
      console.error('Error converting image to WebP:', error);
      toast.error('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setGeneralSettings((prevSettings) => ({ ...prevSettings, logo: '' }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#36454F]">Settings</h1>
        <p className="text-[#36454F]/70 mt-1">Configure your application settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#F5E6D3] flex-wrap h-auto gap-2 p-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger value="slider" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Slider</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Contact Details</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span>Backup</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Database</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">General Settings</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    value={generalSettings.currencySymbol}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currencySymbol: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={generalSettings.companyEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={generalSettings.companyPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input
                    id="companyAddress"
                    value={generalSettings.companyAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={generalSettings.companyWebsite}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyWebsite: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-[#36454F]/70">Enable maintenance mode to restrict access to the site</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                />
              </div>

              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={generalSettings.maintenanceMessage}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMessage: e.target.value })}
                  placeholder="We are currently performing scheduled maintenance. Please check back soon!"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Message displayed to users when maintenance mode is enabled
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2">
                    {generalSettings.logo ? (
                      <div className="relative group">
                        <img
                          src={generalSettings.logo}
                          alt="Company Logo"
                          className="w-full h-48 object-cover rounded-lg border-2 border-[#6B7F39]/30"
                        />
                        {uploadingLogo && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                            <div className="text-center text-white">
                              <Upload className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                              <p className="text-sm">Converting to WebP...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-[#F5E6D3] rounded-lg flex items-center justify-center border-2 border-dashed border-[#6B7F39]/30">
                        <ImageIcon className="w-12 h-12 text-[#6B7F39]/50" />
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadLogo}
                        disabled={uploadingLogo}
                        className="hidden"
                        id="logo"
                      />
                      <Label
                        htmlFor="logo"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="bg-[#36454F] hover:bg-[#2C3E50] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload Logo</span>
                        </div>
                      </Label>
                    </div>
                    <p className="text-xs text-[#36454F]/60 mt-2">
                      Recommended size: 1920x1080px (auto-converted to WebP)
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveGeneralSettings} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                Save General Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Theme Settings</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                      className="w-20 h-12"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                      className="w-20 h-12"
                    />
                    <Input
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-[#36454F]/70">Enable dark theme for the application</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={themeSettings.darkMode}
                  onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, darkMode: checked })}
                />
              </div>

              <Button onClick={handleSaveTheme} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                Save Theme Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Contact Details Settings</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="whatsappEnabled">Enable Contact Notifications</Label>
                  <p className="text-sm text-[#36454F]/70">Allow customers to contact you via WhatsApp</p>
                </div>
                <Switch
                  id="whatsappEnabled"
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, enabled: checked })}
                />
              </div>

              <div>
                <Label htmlFor="whatsappPhoneNumber">Phone Number (WhatsApp)</Label>
                <Input
                  id="whatsappPhoneNumber"
                  value={whatsappSettings.phoneNumber}
                  onChange={(e) => setWhatsappSettings({ ...whatsappSettings, phoneNumber: e.target.value })}
                  placeholder="+254 700 000 000"
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  This number will be used for WhatsApp help/support buttons throughout the site
                </p>
              </div>

              <div>
                <Label htmlFor="whatsappEmail">Support Email</Label>
                <Input
                  id="whatsappEmail"
                  type="email"
                  value={whatsappSettings.email}
                  onChange={(e) => setWhatsappSettings({ ...whatsappSettings, email: e.target.value })}
                  placeholder="info@skywaysuites.com"
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Primary contact email for customer support
                </p>
              </div>

              <div>
                <Label htmlFor="whatsappMessage">Default WhatsApp Message</Label>
                <Textarea
                  id="whatsappMessage"
                  value={whatsappSettings.message}
                  onChange={(e) => setWhatsappSettings({ ...whatsappSettings, message: e.target.value })}
                  placeholder="Hello! I would like to inquire about your properties."
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Pre-filled message when customers click WhatsApp buttons
                </p>
              </div>

              <Button onClick={handleSaveWhatsApp} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                Save Contact Details
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">SMS Configuration</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="smsEnabled">Enable SMS Notifications</Label>
                  <p className="text-sm text-[#36454F]/70">Send SMS to customers for bookings</p>
                </div>
                <Switch
                  id="smsEnabled"
                  checked={smsSettings.enabled}
                  onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enabled: checked })}
                />
              </div>

              <div>
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Select 
                  value={smsSettings.provider} 
                  onValueChange={(value) => setSmsSettings({ ...smsSettings, provider: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="africastalking">Africa's Talking</SelectItem>
                    <SelectItem value="custom">Custom Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={smsSettings.apiKey}
                  onChange={(e) => setSmsSettings({ ...smsSettings, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  value={smsSettings.apiSecret}
                  onChange={(e) => setSmsSettings({ ...smsSettings, apiSecret: e.target.value })}
                  placeholder="Enter your API secret"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={smsSettings.senderName}
                  onChange={(e) => setSmsSettings({ ...smsSettings, senderName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <Button onClick={handleSaveSMS} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                Save SMS Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Payment Methods</h2>
            <div className="space-y-8 max-w-2xl">
              {/* M-Pesa */}
              <div className="border border-[#6B7F39]/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#36454F]">M-Pesa</h3>
                  <Switch
                    checked={paymentSettings.mpesa.enabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings({
                        ...paymentSettings,
                        mpesa: { ...paymentSettings.mpesa, enabled: checked }
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Till Number</Label>
                    <Input
                      value={paymentSettings.mpesa.tillNumber}
                      onChange={(e) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          mpesa: { ...paymentSettings.mpesa, tillNumber: e.target.value }
                        })
                      }
                      placeholder="Enter M-Pesa till number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={paymentSettings.mpesa.apiKey}
                      onChange={(e) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          mpesa: { ...paymentSettings.mpesa, apiKey: e.target.value }
                        })
                      }
                      placeholder="Enter M-Pesa API key"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stripe */}
              <div className="border border-[#6B7F39]/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#36454F]">Stripe</h3>
                  <Switch
                    checked={paymentSettings.stripe.enabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings({
                        ...paymentSettings,
                        stripe: { ...paymentSettings.stripe, enabled: checked }
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Public Key</Label>
                    <Input
                      value={paymentSettings.stripe.publicKey}
                      onChange={(e) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          stripe: { ...paymentSettings.stripe, publicKey: e.target.value }
                        })
                      }
                      placeholder="pk_..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={paymentSettings.stripe.secretKey}
                      onChange={(e) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          stripe: { ...paymentSettings.stripe, secretKey: e.target.value }
                        })
                      }
                      placeholder="sk_..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePayment} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                Save Payment Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Backup & Restore</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-[#FAF4EC] rounded-lg">
                <h3 className="font-semibold text-[#36454F] mb-2">Create Backup</h3>
                <p className="text-sm text-[#36454F]/70 mb-4">
                  Create a complete backup of your database including all properties, customers, bookings, and settings.
                </p>
                <Button onClick={handleBackup} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                  Create Backup Now
                </Button>
              </div>

              <div className="p-4 bg-[#FAF4EC] rounded-lg">
                <h3 className="font-semibold text-[#36454F] mb-2">Restore from Backup</h3>
                <p className="text-sm text-[#36454F]/70 mb-4">
                  Restore your database from a previous backup file. This will overwrite current data.
                </p>
                <div className="flex gap-3">
                  <Input type="file" accept=".sql,.backup" className="flex-1" />
                  <Button onClick={handleRestore} variant="outline">
                    Restore
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-yellow-500/20 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Connect these backup operations to your database backend API to enable automatic backups and restoration.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Database Connection */}
        <TabsContent value="database">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Database Connection</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-blue-50 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📝 Note:</strong> These settings connect your application to your hosted database. Update the API service layer in <code>/src/app/services/api.ts</code> with your actual database endpoints.
                </p>
              </div>

              <div>
                <Label htmlFor="dbHost">Database Host</Label>
                <Input
                  id="dbHost"
                  value={dbSettings.host}
                  onChange={(e) => setDbSettings({ ...dbSettings, host: e.target.value })}
                  placeholder="localhost or your database URL"
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dbPort">Port</Label>
                  <Input
                    id="dbPort"
                    value={dbSettings.port}
                    onChange={(e) => setDbSettings({ ...dbSettings, port: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input
                    id="dbName"
                    value={dbSettings.database}
                    onChange={(e) => setDbSettings({ ...dbSettings, database: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dbUsername">Username</Label>
                <Input
                  id="dbUsername"
                  value={dbSettings.username}
                  onChange={(e) => setDbSettings({ ...dbSettings, username: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dbPassword">Password</Label>
                <Input
                  id="dbPassword"
                  type="password"
                  value={dbSettings.password}
                  onChange={(e) => setDbSettings({ ...dbSettings, password: e.target.value })}
                  placeholder="Enter database password"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveDatabase} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                  Save Database Settings
                </Button>
                <Button variant="outline">Test Connection</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Slider Settings */}
        <TabsContent value="slider">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">Hero Slider Settings</h2>
            <p className="text-sm text-[#36454F]/70 mb-6">
              Manage the hero slider images, titles, and subtitles. Images are automatically converted to WebP and compressed for optimal loading speed.
            </p>
            <div className="space-y-8 max-w-4xl">
              {sliderSettings.map((slide, index) => (
                <div key={slide.id} className="border border-[#6B7F39]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#36454F] text-lg">Slide {index + 1}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Preview and Upload */}
                    <div>
                      <Label>Slide Image</Label>
                      <div className="mt-2">
                        {slide.image ? (
                          <div className="relative group">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-48 object-cover rounded-lg border-2 border-[#6B7F39]/30"
                            />
                            {uploadingSlideImage === slide.id && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                <div className="text-center text-white">
                                  <Upload className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                                  <p className="text-sm">Converting to WebP...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-[#F5E6D3] rounded-lg flex items-center justify-center border-2 border-dashed border-[#6B7F39]/30">
                            <ImageIcon className="w-12 h-12 text-[#6B7F39]/50" />
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadSlideImage(e, slide.id)}
                            disabled={uploadingSlideImage === slide.id}
                            className="hidden"
                            id={`slide-image-${slide.id}`}
                          />
                          <Label
                            htmlFor={`slide-image-${slide.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="bg-[#36454F] hover:bg-[#2C3E50] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm">Upload Image</span>
                            </div>
                          </Label>
                        </div>
                        <p className="text-xs text-[#36454F]/60 mt-2">
                          Recommended size: 1920x1080px (auto-converted to WebP)
                        </p>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${slide.id}`}>Title</Label>
                        <Input
                          id={`title-${slide.id}`}
                          value={slide.title}
                          onChange={(e) =>
                            setSliderSettings((prevSlides) =>
                              prevSlides.map((s) =>
                                s.id === slide.id ? { ...s, title: e.target.value } : s
                              )
                            )
                          }
                          placeholder="Enter slide title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`subtitle-${slide.id}`}>Subtitle</Label>
                        <Textarea
                          id={`subtitle-${slide.id}`}
                          value={slide.subtitle}
                          onChange={(e) =>
                            setSliderSettings((prevSlides) =>
                              prevSlides.map((s) =>
                                s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                              )
                            )
                          }
                          placeholder="Enter slide subtitle"
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button onClick={handleSaveSliderSettings} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                  Save Slider Settings
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Preview on Homepage
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};