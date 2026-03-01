import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  MessageSquare, 
  MessageCircle, 
  CreditCard, 
  HardDrive, 
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Upload,
  X,
  Image as ImageIcon,
  Mail,
  HardDrive as HardDriveIcon,
  Users,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { convertToWebP, isValidImageFile } from '../../utils/imageUtils';
import { 
  initializeSupabase, 
  disconnectSupabase, 
  testSupabaseConnection
} from '../../services/supabase';
import { 
  getTableCreationSQL,
  migrateLocalStorageToSupabase 
} from '../../services/migrations';
import { syncNow, startAutoSync, stopAutoSync } from '../../services/syncService';
import { copyToClipboard, downloadAsFile } from '../../utils/clipboard';
import { getEmailSettings, saveEmailSettings, initializeEmailJS } from '../../services/emailService';
import { SliderSettings } from '../../components/settings/SliderSettings';
import { EmailSettings } from '../../components/settings/EmailSettings';
import { UsersSettings } from '../../components/settings/UsersSettings';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState(() => {
    const stored = localStorage.getItem("generalSettings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error loading general settings:", error);
      }
    }
    return {
      currency: "Ksh",
      currencySymbol: "Ksh",
      timezone: "Africa/Nairobi",
      companyName: "Skyway Suites",
      companyEmail: "info@skywaysuites.com",
      companyPhone: "+254 700 000 000",
      companyAddress: "Nairobi, Kenya",
      companyWebsite: "www.skywaysuites.com",
      logo: "",
      maintenanceMode: false,
      maintenanceMessage:
        "We are currently performing scheduled maintenance. Please check back soon!",
    };
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#6B7F39",
    secondaryColor: "#F5E6D3",
    darkMode: false,
  });

  const [sliderSettings, setSliderSettings] = useState<Slide[]>(
    () => {
      const stored = localStorage.getItem("heroSlides");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(
            "Error loading slider settings:",
            error,
          );
        }
      }
      return [
        {
          id: 1,
          image:
            "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIyMDA3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Find Your Perfect Home",
          subtitle: "Luxury living spaces in prime locations",
        },
        {
          id: 2,
          image:
            "https://images.unsplash.com/photo-1612645213559-6af1d4edeaf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzcyMjEzNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Modern Comfort Awaits",
          subtitle: "Discover beautifully designed suites",
        },
        {
          id: 3,
          image:
            "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW50aG91c2UlMjBiYWxjb255JTIwdmlld3xlbnwxfHx8fDE3NzIxOTA2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Breathtaking Views",
          subtitle: "Experience elevated living",
        },
        {
          id: 4,
          image:
            "https://images.unsplash.com/photo-1611094016919-36b65678f3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzIyMTM3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Elegant Interiors",
          subtitle: "Thoughtfully curated spaces",
        },
      ];
    },
  );

  const [uploadingSlideImage, setUploadingSlideImage] =
    useState<number | null>(null);

  const [smsSettings, setSmsSettings] = useState({
    provider: "twilio",
    apiKey: "",
    apiSecret: "",
    senderName: "Skyway Suites",
    enabled: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mpesa: { enabled: true, tillNumber: "", apiKey: "" },
    stripe: { enabled: false, publicKey: "", secretKey: "" },
    paypal: { enabled: false, clientId: "", secret: "" },
  });

  const [whatsappSettings, setWhatsappSettings] = useState(
    () => {
      // Load from localStorage if available
      const stored = localStorage.getItem(
        "contactDetailsSettings",
      );
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(
            "Error loading contact details settings:",
            error,
          );
        }
      }
      return {
        enabled: true,
        phoneNumber: "+254 700 000 000",
        email: "info@skywaysuites.com",
        message:
          "Hello! I would like to inquire about your properties.",
      };
    },
  );

  const [databaseSettings, setDatabaseSettings] = useState(
    () => {
      const stored = localStorage.getItem("databaseSettings");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(
            "Error loading database settings:",
            error,
          );
        }
      }
      return {
        storageType: "local" as "local" | "remote",
        supabaseUrl: "",
        supabaseAnonKey: "",
        connected: false,
      };
    },
  );

  const [testingConnection, setTestingConnection] =
    useState(false);

  const [migrating, setMigrating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [showSQLDialog, setShowSQLDialog] = useState(false);

  const [emailSettings, setEmailSettings] = useState(() => {
    const stored = getEmailSettings();
    return stored;
  });

  const handleSaveGeneralSettings = () => {
    toast.success("General settings saved successfully");
    // Store in localStorage for the floating button
    localStorage.setItem(
      "generalSettings",
      JSON.stringify(generalSettings),
    );
    window.dispatchEvent(new Event("generalSettingsChanged"));
  };
  const handleConnectSupabase = async () => {
    if (
      !databaseSettings.supabaseUrl ||
      !databaseSettings.supabaseAnonKey
    ) {
      toast.error(
        "Please provide both Supabase URL and Anon Key",
      );
      return;
    }

    try {
      initializeSupabase({
        url: databaseSettings.supabaseUrl,
        anonKey: databaseSettings.supabaseAnonKey,
      });

      const connected = await testSupabaseConnection();
      if (connected) {
        const updated = {
          ...databaseSettings,
          connected: true,
        };
        setDatabaseSettings(updated);
        localStorage.setItem(
          "databaseSettings",
          JSON.stringify(updated),
        );
        window.dispatchEvent(
          new Event("databaseSettingsChanged"),
        );
        toast.success("Successfully connected to Supabase! Use the 'Sync Now' button to sync your data.");
      } else {
        toast.error(
          "Failed to connect. Please check your credentials.",
        );
      }
    } catch (error) {
      console.error("Supabase connection error:", error);
      toast.error(
        "Connection failed. Please verify your Supabase credentials.",
      );
    }
  };

  const handleDisconnectSupabase = () => {
    stopAutoSync();
    setAutoSyncEnabled(false);
    disconnectSupabase();
    const updated = { ...databaseSettings, connected: false };
    setDatabaseSettings(updated);
    localStorage.setItem(
      "databaseSettings",
      JSON.stringify(updated),
    );
    window.dispatchEvent(new Event("databaseSettingsChanged"));
    toast.info("Disconnected from Supabase");
  };

  const handleSyncNow = async () => {
    if (!databaseSettings.connected) {
      toast.error("Please connect to Supabase first");
      return;
    }

    setSyncing(true);
    try {
      const result = await syncNow();
      if (result.success) {
        setLastSyncTime(new Date());
        toast.success("Data synced successfully!");
        
        // Start auto-sync after first manual sync
        if (!autoSyncEnabled) {
          setAutoSyncEnabled(true);
          startAutoSync((time) => {
            setLastSyncTime(time);
          });
          toast.info("Auto-sync enabled! Syncing every 10 seconds.");
        }
      } else {
        toast.error(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync effect
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAutoSync();
    };
  }, []);

  // Watch for connection status changes
  useEffect(() => {
    if (!databaseSettings.connected && autoSyncEnabled) {
      stopAutoSync();
      setAutoSyncEnabled(false);
    }
  }, [databaseSettings.connected, autoSyncEnabled]);

  const handleSaveStorageSettings = () => {
    localStorage.setItem(
      "databaseSettings",
      JSON.stringify(databaseSettings),
    );
    window.dispatchEvent(new Event("databaseSettingsChanged"));
    toast.success("Storage settings saved successfully!");
  };

  const handleTestConnection = async () => {
    if (databaseSettings.storageType === "local") {
      toast.success("Local storage is always available");
      return;
    }

    setTestingConnection(true);
    try {
      const connected = await testSupabaseConnection();
      if (connected) {
        toast.success("✅ Connection successful!");
      } else {
        toast.error(
          "❌ Connection failed. Please check your settings.",
        );
      }
    } catch (error) {
      toast.error("Connection test failed");
    } finally {
      setTestingConnection(false);
    }
  };
  
  const handleSaveTheme = () => {
    toast.success("Theme settings saved successfully");
    // TODO: Connect to your database API
    console.log("Theme settings:", themeSettings);
  };

  const handleSaveSMS = () => {
    toast.success("SMS settings saved successfully");
    // TODO: Connect to your database API
    console.log("SMS settings:", smsSettings);
  };

  const handleSavePayment = () => {
    toast.success("Payment settings saved successfully");
    // TODO: Connect to your database API
    console.log("Payment settings:", paymentSettings);
  };

  const handleSaveWhatsApp = () => {
    toast.success(
      "Contact details settings saved successfully",
    );
    // TODO: Connect to your database API
    console.log("Contact details settings:", whatsappSettings);
    // Store in localStorage for the floating button
    localStorage.setItem(
      "contactDetailsSettings",
      JSON.stringify(whatsappSettings),
    );
    window.dispatchEvent(new Event("whatsappSettingsChanged"));
  };

  const handleBackup = () => {
    toast.success("Backup created successfully");
    // TODO: Implement backup functionality with your backend
  };

  const handleRestore = () => {
    toast.info(
      "Restore functionality - Connect to your backend",
    );
    // TODO: Implement restore functionality with your backend
  };

  const handleUploadSlideImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    slideId: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error(
        "Invalid image file. Please upload a valid image.",
      );
      return;
    }

    setUploadingSlideImage(slideId);
    try {
      const webPImage = await convertToWebP(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
      });
      setSliderSettings((prevSlides) =>
        prevSlides.map((slide) =>
          slide.id === slideId
            ? { ...slide, image: webPImage }
            : slide,
        ),
      );
      toast.success(
        "Image uploaded and converted to WebP successfully!",
      );
    } catch (error) {
      console.error("Error converting image to WebP:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingSlideImage(null);
    }
  };

  const handleRemoveSlideImage = (slideId: number) => {
    setSliderSettings((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === slideId ? { ...slide, image: "" } : slide,
      ),
    );
  };

  const handleSaveSliderSettings = () => {
    toast.success("Slider settings saved successfully");
    // Store in localStorage for the floating button
    localStorage.setItem(
      "heroSlides",
      JSON.stringify(sliderSettings),
    );
    window.dispatchEvent(new Event("sliderSettingsChanged"));
  };

  const handleUploadLogo = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error(
        "Invalid image file. Please upload a valid image.",
      );
      return;
    }

    setUploadingLogo(true);
    try {
      const webPImage = await convertToWebP(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
      });
      setGeneralSettings((prevSettings) => ({
        ...prevSettings,
        logo: webPImage,
      }));
      toast.success(
        "Logo uploaded and converted to WebP successfully!",
      );
    } catch (error) {
      console.error("Error converting image to WebP:", error);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setGeneralSettings((prevSettings) => ({
      ...prevSettings,
      logo: "",
    }));
  };

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#36454F]">
          Settings
        </h1>
        <p className="text-[#36454F]/70 mt-1">
          Configure your application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#F5E6D3] flex-wrap h-auto gap-2 p-2">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="flex items-center gap-2"
          >
            <Palette className="w-4 h-4" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger
            value="slider"
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Slider</span>
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="sms"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger
            value="backup"
            className="flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            <span>Backup</span>
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>Database</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              General Settings
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={generalSettings.currency}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        currency: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currencySymbol">
                    Currency Symbol
                  </Label>
                  <Input
                    id="currencySymbol"
                    value={generalSettings.currencySymbol}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        currencySymbol: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyName: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">
                    Company Email
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={generalSettings.companyEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyEmail: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">
                    Company Phone
                  </Label>
                  <Input
                    id="companyPhone"
                    value={generalSettings.companyPhone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyPhone: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyAddress">
                    Company Address
                  </Label>
                  <Input
                    id="companyAddress"
                    value={generalSettings.companyAddress}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyAddress: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">
                    Company Website
                  </Label>
                  <Input
                    id="companyWebsite"
                    value={generalSettings.companyWebsite}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyWebsite: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-[#36454F]/70">
                    Enable maintenance mode to restrict access
                    to the site
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: checked,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="maintenanceMessage">
                  Maintenance Message
                </Label>
                <Textarea
                  id="maintenanceMessage"
                  value={generalSettings.maintenanceMessage}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maintenanceMessage: e.target.value,
                    })
                  }
                  placeholder="We are currently performing scheduled maintenance. Please check back soon!"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Message displayed to users when maintenance
                  mode is enabled
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
                              <p className="text-sm">
                                Converting to WebP...
                              </p>
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
                          <span className="text-sm">
                            Upload Logo
                          </span>
                        </div>
                      </Label>
                    </div>
                    <p className="text-xs text-[#36454F]/60 mt-2">
                      Recommended size: 1920x1080px
                      (auto-converted to WebP)
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveGeneralSettings}
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                Save General Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              Theme Settings
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">
                    Primary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-20 h-12"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">
                    Secondary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-20 h-12"
                    />
                    <Input
                      value={themeSettings.secondaryColor}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-[#36454F]/70">
                    Enable dark theme for the application
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={themeSettings.darkMode}
                  onCheckedChange={(checked) =>
                    setThemeSettings({
                      ...themeSettings,
                      darkMode: checked,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleSaveTheme}
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                Save Theme Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Slider Settings */}
        <TabsContent value="slider">
          <SliderSettings 
            sliderSettings={sliderSettings}
            setSliderSettings={setSliderSettings}
          />
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <EmailSettings 
            emailSettings={emailSettings}
            setEmailSettings={setEmailSettings}
          />
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              Contact Details Settings
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="whatsappEnabled">
                    Enable Contact Notifications
                  </Label>
                  <p className="text-sm text-[#36454F]/70">
                    Allow customers to contact you via WhatsApp
                  </p>
                </div>
                <Switch
                  id="whatsappEnabled"
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      enabled: checked,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="whatsappPhoneNumber">
                  Phone Number (WhatsApp)
                </Label>
                <Input
                  id="whatsappPhoneNumber"
                  value={whatsappSettings.phoneNumber}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      phoneNumber: e.target.value,
                    })
                  }
                  placeholder="+254 700 000 000"
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  This number will be used for WhatsApp
                  help/support buttons throughout the site
                </p>
              </div>

              <div>
                <Label htmlFor="whatsappEmail">
                  Support Email
                </Label>
                <Input
                  id="whatsappEmail"
                  type="email"
                  value={whatsappSettings.email}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      email: e.target.value,
                    })
                  }
                  placeholder="info@skywaysuites.com"
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Primary contact email for customer support
                </p>
              </div>

              <div>
                <Label htmlFor="whatsappMessage">
                  Default WhatsApp Message
                </Label>
                <Textarea
                  id="whatsappMessage"
                  value={whatsappSettings.message}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      message: e.target.value,
                    })
                  }
                  placeholder="Hello! I would like to inquire about your properties."
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Pre-filled message when customers click
                  WhatsApp buttons
                </p>
              </div>

              <Button
                onClick={handleSaveWhatsApp}
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                Save Contact Details
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              SMS Configuration
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 bg-[#FAF4EC] rounded-lg">
                <div>
                  <Label htmlFor="smsEnabled">
                    Enable SMS Notifications
                  </Label>
                  <p className="text-sm text-[#36454F]/70">
                    Send SMS to customers for bookings
                  </p>
                </div>
                <Switch
                  id="smsEnabled"
                  checked={smsSettings.enabled}
                  onCheckedChange={(checked) =>
                    setSmsSettings({
                      ...smsSettings,
                      enabled: checked,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="smsProvider">
                  SMS Provider
                </Label>
                <Select
                  value={smsSettings.provider}
                  onValueChange={(value) =>
                    setSmsSettings({
                      ...smsSettings,
                      provider: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">
                      Twilio
                    </SelectItem>
                    <SelectItem value="africastalking">
                      Africa's Talking
                    </SelectItem>
                    <SelectItem value="custom">
                      Custom Provider
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={smsSettings.apiKey}
                  onChange={(e) =>
                    setSmsSettings({
                      ...smsSettings,
                      apiKey: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setSmsSettings({
                      ...smsSettings,
                      apiSecret: e.target.value,
                    })
                  }
                  placeholder="Enter your API secret"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={smsSettings.senderName}
                  onChange={(e) =>
                    setSmsSettings({
                      ...smsSettings,
                      senderName: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleSaveSMS}
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                Save SMS Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              Payment Methods
            </h2>
            <div className="space-y-8 max-w-2xl">
              {/* M-Pesa */}
              <div className="border border-[#6B7F39]/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#36454F]">
                    M-Pesa
                  </h3>
                  <Switch
                    checked={paymentSettings.mpesa.enabled}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        mpesa: {
                          ...paymentSettings.mpesa,
                          enabled: checked,
                        },
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
                          mpesa: {
                            ...paymentSettings.mpesa,
                            tillNumber: e.target.value,
                          },
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
                          mpesa: {
                            ...paymentSettings.mpesa,
                            apiKey: e.target.value,
                          },
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
                  <h3 className="font-semibold text-[#36454F]">
                    Stripe
                  </h3>
                  <Switch
                    checked={paymentSettings.stripe.enabled}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        stripe: {
                          ...paymentSettings.stripe,
                          enabled: checked,
                        },
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
                          stripe: {
                            ...paymentSettings.stripe,
                            publicKey: e.target.value,
                          },
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
                          stripe: {
                            ...paymentSettings.stripe,
                            secretKey: e.target.value,
                          },
                        })
                      }
                      placeholder="sk_..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSavePayment}
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                Save Payment Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
            <h2 className="text-xl font-semibold text-[#36454F] mb-6">
              Backup & Restore
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-[#FAF4EC] rounded-lg">
                <h3 className="font-semibold text-[#36454F] mb-2">
                  Create Backup
                </h3>
                <p className="text-sm text-[#36454F]/70 mb-4">
                  Create a complete backup of your database
                  including all properties, customers, bookings,
                  and settings.
                </p>
                <Button
                  onClick={handleBackup}
                  className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
                >
                  Create Backup Now
                </Button>
              </div>

              <div className="p-4 bg-[#FAF4EC] rounded-lg">
                <h3 className="font-semibold text-[#36454F] mb-2">
                  Restore from Backup
                </h3>
                <p className="text-sm text-[#36454F]/70 mb-4">
                  Restore your database from a previous backup
                  file. This will overwrite current data.
                </p>
                <div className="flex gap-3">
                  <Input
                    type="file"
                    accept=".sql,.backup"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleRestore}
                    variant="outline"
                  >
                    Restore
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-yellow-500/20 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Connect these
                  backup operations to your database backend API
                  to enable automatic backups and restoration.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Database Connection */}
        <TabsContent value="database">
  <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
    <h2 className="text-xl font-semibold text-[#36454F] mb-6">Storage Configuration</h2>
    
    <div className="space-y-6 max-w-2xl">
      {/* Storage Type Selection */}
      <div className="border border-[#6B7F39]/30 rounded-lg p-6 bg-gradient-to-br from-[#FAF4EC] to-white">
        <h3 className="font-semibold text-[#36454F] mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-[#6B7F39]" />
          Storage Type
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Local Storage Option */}
          <button
            onClick={() => setDatabaseSettings({ ...databaseSettings, storageType: 'local' })}
            className={`p-4 rounded-lg border-2 transition-all ${
              databaseSettings.storageType === 'local'
                ? 'border-[#6B7F39] bg-[#6B7F39]/10 shadow-md'
                : 'border-gray-200 hover:border-[#6B7F39]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <HardDriveIcon className="w-6 h-6 text-[#6B7F39]" />
              {databaseSettings.storageType === 'local' && (
                <CheckCircle2 className="w-5 h-5 text-[#6B7F39]" />
              )}
            </div>
            <h4 className="font-semibold text-[#36454F] mb-1">Local Storage</h4>
            <p className="text-sm text-[#36454F]/70">
              Store data in browser (for prototyping)
            </p>
          </button>

          {/* Remote Storage Option */}
          <button
            onClick={() => setDatabaseSettings({ ...databaseSettings, storageType: 'remote' })}
            className={`p-4 rounded-lg border-2 transition-all ${
              databaseSettings.storageType === 'remote'
                ? 'border-[#6B7F39] bg-[#6B7F39]/10 shadow-md'
                : 'border-gray-200 hover:border-[#6B7F39]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Cloud className="w-6 h-6 text-[#6B7F39]" />
              {databaseSettings.storageType === 'remote' && (
                <CheckCircle2 className="w-5 h-5 text-[#6B7F39]" />
              )}
            </div>
            <h4 className="font-semibold text-[#36454F] mb-1">Remote Database</h4>
            <p className="text-sm text-[#36454F]/70">
              Connect to Supabase (PostgreSQL)
            </p>
          </button>
        </div>
      </div>

      {/* Supabase Configuration (shown when Remote is selected) */}
      {databaseSettings.storageType === 'remote' && (
        <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-50/50">
          <div className="flex items-start gap-3 mb-4">
            <Cloud className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-[#36454F] mb-1">Supabase Configuration</h3>
              <p className="text-sm text-[#36454F]/70">
                Connect your Supabase project to enable remote database storage
              </p>
            </div>
          </div>

          {/* Connection Status */}
          {databaseSettings.connected && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Connected to Supabase</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="supabaseUrl">Supabase Project URL</Label>
              <Input
                id="supabaseUrl"
                value={databaseSettings.supabaseUrl}
                onChange={(e) => setDatabaseSettings({ ...databaseSettings, supabaseUrl: e.target.value })}
                placeholder="https://your-project.supabase.co"
                className="mt-1 font-mono text-sm"
                disabled={databaseSettings.connected}
              />
              <p className="text-xs text-[#36454F]/60 mt-1">
                Find this in your Supabase project settings
              </p>
            </div>

            <div>
              <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
              <Input
                id="supabaseAnonKey"
                type="password"
                value={databaseSettings.supabaseAnonKey}
                onChange={(e) => setDatabaseSettings({ ...databaseSettings, supabaseAnonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="mt-1 font-mono text-sm"
                disabled={databaseSettings.connected}
              />
              <p className="text-xs text-[#36454F]/60 mt-1">
                Your public anonymous key (safe to use in frontend)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              {!databaseSettings.connected ? (
                <Button
                  onClick={handleConnectSupabase}
                  className="bg-[#6B7F39] hover:bg-[#5A6A2F] text-white"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  Connect to Supabase
                </Button>
              ) : (
                <Button
                  onClick={handleDisconnectSupabase}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              )}
              
              <Button
                onClick={handleTestConnection}
                variant="outline"
                disabled={testingConnection}
              >
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </Button>

              {databaseSettings.connected && (
                <Button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="bg-[#6B7F39] hover:bg-[#5A6A2F] text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              )}
            </div>

            {/* Sync Status */}
            {databaseSettings.connected && lastSyncTime && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Last synced: {lastSyncTime.toLocaleTimeString()}
                    {autoSyncEnabled && ' • Auto-sync enabled (every 10s)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="mt-6 p-4 bg-white border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-[#36454F] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Setup Instructions
            </h4>
            <ol className="text-sm text-[#36454F]/80 space-y-1 list-decimal list-inside mb-3">
              <li>Create a free Supabase account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a></li>
              <li>Create a new project</li>
              <li>Copy your project URL and anon key from Settings → API</li>
              <li>Run the SQL schema in your Supabase SQL Editor (click button below)</li>
              <li>Paste credentials above and click "Connect to Supabase"</li>
            </ol>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={async () => {
                  const sql = getTableCreationSQL();
                  const success = await copyToClipboard(sql);
                  if (success) {
                    toast.success('SQL schema copied to clipboard! Paste it in Supabase SQL Editor.');
                  } else {
                    toast.error('Failed to copy. Try the download button instead.');
                  }
                }}
                variant="outline"
                className="border-[#6B7F39] text-[#6B7F39] hover:bg-[#6B7F39]/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy SQL
              </Button>
              <Button
                onClick={() => {
                  const sql = getTableCreationSQL();
                  downloadAsFile(sql, 'skyway-suites-schema.sql');
                  toast.success('SQL schema downloaded! Upload it to Supabase SQL Editor.');
                }}
                variant="outline"
                className="border-[#6B7F39] text-[#6B7F39] hover:bg-[#6B7F39]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SQL
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Local Storage Info */}
      {databaseSettings.storageType === 'local' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Using Local Storage</p>
              <p>Data is stored in your browser and will be lost if you clear browser data. For production use, switch to Remote Database.</p>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleSaveStorageSettings}
        className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
      >
        Save Storage Settings
      </Button>
    </div>
  </div>
</TabsContent>

        {/* Users Settings */}
        <TabsContent value="users">
          <UsersSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};