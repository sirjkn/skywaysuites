import { useState } from 'react';
import { Palette, MessageSquare, CreditCard, Database, HardDrive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#6B7F39',
    secondaryColor: '#F5E6D3',
    darkMode: false,
  });

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

  const handleBackup = () => {
    toast.success('Backup created successfully');
    // TODO: Implement backup functionality with your backend
  };

  const handleRestore = () => {
    toast.info('Restore functionality - Connect to your backend');
    // TODO: Implement restore functionality with your backend
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#36454F]">Settings</h1>
        <p className="text-[#36454F]/70 mt-1">Configure your application settings</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="bg-[#F5E6D3]">
          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="backup">
            <HardDrive className="w-4 h-4 mr-2" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

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

              <Button onClick={handleSaveTheme} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
                Save Theme Settings
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

              <Button onClick={handleSaveSMS} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
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

              <Button onClick={handleSavePayment} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
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
                <Button onClick={handleBackup} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
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
                <Button onClick={handleSaveDatabase} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
                  Save Database Settings
                </Button>
                <Button variant="outline">Test Connection</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};