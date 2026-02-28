# Skyway Suites - cPanel Deployment Guide

## Prerequisites
- cPanel hosting account with Node.js support
- SSH access (recommended) or File Manager access
- Your database credentials from cPanel

---

## Part 1: Build the Application Locally

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 2: Create Production Build
```bash
npm run build
# or
pnpm build
```

This creates a `dist/` folder with optimized production files.

---

## Part 2: Deploy to cPanel

### Method A: Using File Manager (Easier)

#### 1. Access cPanel File Manager
- Log into your cPanel account
- Navigate to **File Manager**
- Go to `public_html` (or your domain's root directory)

#### 2. Upload Files
- **Option 1: Upload as ZIP**
  - Compress the entire `dist` folder into `dist.zip`
  - Upload `dist.zip` to `public_html`
  - Right-click → Extract
  - Move contents of `dist` folder to `public_html` root
  - Delete the empty `dist` folder and `dist.zip`

- **Option 2: Upload Directly**
  - Select all files inside the `dist` folder
  - Upload them directly to `public_html`

#### 3. Verify Upload
Your `public_html` should contain:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images/fonts]
└── .htaccess (create this - see below)
```

### Method B: Using SSH & Git (Advanced)

#### 1. SSH into cPanel
```bash
ssh username@yourdomain.com
```

#### 2. Clone Repository
```bash
cd public_html
git clone https://github.com/YOUR_USERNAME/skyway-suites.git
cd skyway-suites
```

#### 3. Install and Build
```bash
npm install
npm run build
```

#### 4. Move Build Files
```bash
mv dist/* ../
cd ..
rm -rf skyway-suites
```

---

## Part 3: Configure for React Router

### Create .htaccess File
React Router requires URL rewriting. Create `.htaccess` in `public_html`:

**File: `public_html/.htaccess`**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect HTTP to HTTPS (optional but recommended)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Handle React Router - redirect all requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

## Part 4: Set Up Backend API & Database

### Step 1: Create MySQL Database in cPanel

1. **Go to MySQL Database Wizard**
   - cPanel → Databases → MySQL Database Wizard
   
2. **Create Database**
   - Name: `skyway_suites`
   - Click "Next Step"

3. **Create Database User**
   - Username: `skyway_admin`
   - Password: [Generate strong password]
   - Click "Create User"

4. **Set Privileges**
   - Check "ALL PRIVILEGES"
   - Click "Next Step"

5. **Note Your Credentials**
   ```
   Database Name: username_skyway_suites
   Database User: username_skyway_admin
   Database Password: [your password]
   Database Host: localhost
   ```

### Step 2: Import Database Schema

1. **Go to phpMyAdmin**
   - cPanel → Databases → phpMyAdmin
   
2. **Select Your Database**
   - Click on `username_skyway_suites` in the left sidebar

3. **Import Schema**
   - Click "SQL" tab
   - Copy the schema from `DATABASE_INTEGRATION.md`
   - Paste and click "Go"

### Step 3: Create Backend API

You have two options:

#### Option A: PHP Backend (Recommended for cPanel)

Create a simple PHP API in `public_html/api/`:

**File: `public_html/api/config.php`**
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'username_skyway_suites');
define('DB_USER', 'username_skyway_admin');
define('DB_PASS', 'your_password');

// Create connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?>
```

**File: `public_html/api/properties.php`**
```php
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single property
            $stmt = $pdo->prepare("
                SELECT p.*, 
                       GROUP_CONCAT(DISTINCT pf.feature_id) as feature_ids,
                       GROUP_CONCAT(DISTINCT pi.image_url) as images
                FROM properties p
                LEFT JOIN property_features pf ON p.id = pf.property_id
                LEFT JOIN property_images pi ON p.id = pi.property_id
                WHERE p.id = ?
                GROUP BY p.id
            ");
            $stmt->execute([$_GET['id']]);
            $property = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($property) {
                $property['feature_ids'] = $property['feature_ids'] ? explode(',', $property['feature_ids']) : [];
                $property['images'] = $property['images'] ? explode(',', $property['images']) : [];
            }
            
            echo json_encode($property);
        } else {
            // Get all properties
            $category = $_GET['category'] ?? 'all';
            
            $sql = "
                SELECT p.*,
                       GROUP_CONCAT(DISTINCT pi.image_url) as images
                FROM properties p
                LEFT JOIN property_images pi ON p.id = pi.property_id
            ";
            
            if($category !== 'all') {
                $sql .= " WHERE p.category = :category";
            }
            
            $sql .= " GROUP BY p.id ORDER BY p.created_at DESC";
            
            $stmt = $pdo->prepare($sql);
            if($category !== 'all') {
                $stmt->execute(['category' => $category]);
            } else {
                $stmt->execute();
            }
            
            $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach($properties as &$property) {
                $property['images'] = $property['images'] ? explode(',', $property['images']) : [];
            }
            
            echo json_encode($properties);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("
            INSERT INTO properties (name, category, price, location, bedrooms, bathrooms, area, description, building_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['name'],
            $data['category'],
            $data['price'],
            $data['location'],
            $data['bedrooms'],
            $data['bathrooms'],
            $data['area'],
            $data['description'],
            $data['building_name'] ?? null
        ]);
        
        $propertyId = $pdo->lastInsertId();
        
        // Insert features
        if(!empty($data['feature_ids'])) {
            $stmt = $pdo->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
            foreach($data['feature_ids'] as $featureId) {
                $stmt->execute([$propertyId, $featureId]);
            }
        }
        
        // Insert images
        if(!empty($data['images'])) {
            $stmt = $pdo->prepare("INSERT INTO property_images (property_id, image_url) VALUES (?, ?)");
            foreach($data['images'] as $image) {
                $stmt->execute([$propertyId, $image]);
            }
        }
        
        http_response_code(201);
        echo json_encode(['id' => $propertyId, 'message' => 'Property created successfully']);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'];
        
        $stmt = $pdo->prepare("
            UPDATE properties 
            SET name=?, category=?, price=?, location=?, bedrooms=?, bathrooms=?, area=?, description=?, building_name=?
            WHERE id=?
        ");
        
        $stmt->execute([
            $data['name'],
            $data['category'],
            $data['price'],
            $data['location'],
            $data['bedrooms'],
            $data['bathrooms'],
            $data['area'],
            $data['description'],
            $data['building_name'] ?? null,
            $id
        ]);
        
        // Update features
        $pdo->exec("DELETE FROM property_features WHERE property_id = $id");
        if(!empty($data['feature_ids'])) {
            $stmt = $pdo->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
            foreach($data['feature_ids'] as $featureId) {
                $stmt->execute([$id, $featureId]);
            }
        }
        
        echo json_encode(['message' => 'Property updated successfully']);
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        
        $pdo->exec("DELETE FROM property_features WHERE property_id = $id");
        $pdo->exec("DELETE FROM property_images WHERE property_id = $id");
        $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['message' => 'Property deleted successfully']);
        break;
}
?>
```

**Create similar files for other endpoints:**
- `api/features.php`
- `api/customers.php`
- `api/bookings.php`
- `api/payments.php`
- `api/auth.php`

### Step 4: Update Frontend API Configuration

Update your API base URL to point to your backend:

**File: `src/app/services/api.ts`** (Before building)
```typescript
const BASE_URL = 'https://yourdomain.com/api';
```

Then rebuild and redeploy:
```bash
npm run build
# Upload new dist files to cPanel
```

#### Option B: Node.js Backend

If your cPanel supports Node.js:

1. **Enable Node.js Application**
   - cPanel → Software → Setup Node.js App
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/username/api`
   - Application URL: `api`

2. **Create Express API**
   - Upload your Node.js backend to the `api` folder
   - Install dependencies via SSH
   - The application will run on a specific port

3. **Update API URL**
   ```typescript
   const BASE_URL = 'https://yourdomain.com/api';
   ```

---

## Part 5: Configure Environment & Security

### 1. Set Correct Permissions
Via File Manager or SSH:
```bash
chmod 755 public_html
chmod 644 public_html/index.html
chmod 644 public_html/.htaccess
chmod 755 public_html/api
chmod 644 public_html/api/*.php
```

### 2. Enable SSL Certificate
- cPanel → Security → SSL/TLS Status
- Run AutoSSL or install Let's Encrypt certificate
- Force HTTPS in `.htaccess` (already included above)

### 3. Secure API Directory
Create `public_html/api/.htaccess`:
```apache
# Prevent directory listing
Options -Indexes

# Allow API access
<FilesMatch "\.(php)$">
  Order allow,deny
  Allow from all
</FilesMatch>
```

---

## Part 6: Testing & Troubleshooting

### Test Your Deployment

1. **Visit Your Site**
   ```
   https://yourdomain.com
   ```

2. **Check Console**
   - Open browser DevTools (F12)
   - Look for any errors in Console tab
   - Check Network tab for failed requests

3. **Test API Endpoints**
   ```
   https://yourdomain.com/api/properties.php
   ```

### Common Issues & Solutions

#### Issue: Blank page / White screen
**Solution:**
- Check browser console for errors
- Verify all files uploaded correctly
- Check file permissions (644 for files, 755 for directories)

#### Issue: 404 on page refresh
**Solution:**
- Verify `.htaccess` file exists in `public_html`
- Check if `mod_rewrite` is enabled (ask hosting support)
- Ensure `.htaccess` RewriteRule is correct

#### Issue: API calls fail
**Solution:**
- Check database credentials in `api/config.php`
- Verify database exists in phpMyAdmin
- Check PHP error logs in cPanel
- Test API endpoint directly in browser

#### Issue: Images not loading
**Solution:**
- Verify image paths are correct
- Check if images uploaded to correct directory
- Update image URLs in database

#### Issue: CORS errors
**Solution:**
- Ensure API files have CORS headers (already in config.php)
- Check `.htaccess` doesn't block API requests

---

## Part 7: File Upload Configuration (For Property Images)

### Create Upload Directory
```bash
mkdir public_html/uploads
mkdir public_html/uploads/properties
chmod 755 public_html/uploads
chmod 755 public_html/uploads/properties
```

### Create Upload Handler
**File: `public_html/api/upload.php`**
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $uploadDir = '../uploads/properties/';
    $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
    $targetPath = $uploadDir . $fileName;
    
    // Validate image
    $imageFileType = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($imageFileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }
    
    // Check file size (max 5MB)
    if ($_FILES['image']['size'] > 5000000) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large']);
        exit;
    }
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        $imageUrl = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/properties/' . $fileName;
        echo json_encode(['url' => $imageUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Upload failed']);
    }
}
?>
```

---

## Quick Reference

### Important URLs
- **Frontend:** `https://yourdomain.com`
- **Admin:** `https://yourdomain.com/admin`
- **API:** `https://yourdomain.com/api/`
- **cPanel:** `https://yourdomain.com:2083`
- **phpMyAdmin:** cPanel → Databases → phpMyAdmin

### Important Files
- **Frontend:** `public_html/index.html`
- **Routing:** `public_html/.htaccess`
- **API Config:** `public_html/api/config.php`
- **Database:** Access via phpMyAdmin

### Deployment Checklist
- [ ] Build application locally (`npm run build`)
- [ ] Upload `dist` files to `public_html`
- [ ] Create `.htaccess` for React Router
- [ ] Create MySQL database in cPanel
- [ ] Import database schema via phpMyAdmin
- [ ] Create API directory and PHP files
- [ ] Configure database credentials in `api/config.php`
- [ ] Update `BASE_URL` in frontend and rebuild
- [ ] Set correct file permissions
- [ ] Enable SSL certificate
- [ ] Test frontend and API endpoints
- [ ] Create uploads directory for images

---

## Next Steps After Deployment

1. **Set up automated backups** (cPanel → Backups)
2. **Monitor error logs** (cPanel → Metrics → Errors)
3. **Set up email notifications** for bookings
4. **Configure payment gateway** (M-Pesa, Stripe, etc.)
5. **Add Google Analytics** for tracking
6. **Optimize images** for faster loading
7. **Set up CDN** (optional, for better performance)

---

## Support Resources

- **cPanel Documentation:** https://docs.cpanel.net
- **PHP Documentation:** https://www.php.net/docs.php
- **React Router:** https://reactrouter.com
- **MySQL:** https://dev.mysql.com/doc

---

## Notes

- Remember to rebuild (`npm run build`) after ANY changes to source code
- Always backup your database before making schema changes
- Keep your cPanel and database passwords secure
- Update API credentials in a secure location (not in git)
- Consider using environment variables for sensitive data

---

**Need Help?** Contact your hosting provider's support team for cPanel-specific issues.
