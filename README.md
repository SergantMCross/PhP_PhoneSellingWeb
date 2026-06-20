# Smartphone Store

A PHP-based e-commerce website for selling smartphones. Features product browsing, user accounts, shopping cart, order management, and an admin panel.

## Requirements

- PHP 7.2+
- MySQL / MariaDB
- Apache or any PHP-compatible web server

## Installation

### 1. Clone or copy the project

Place the project folder in your web server's document root:

- **XAMPP**: `C:\xampp\htdocs\`
- **WAMP**: `C:\wamp\www\`
- **Laragon**: `C:\laragon\www\`

### 2. Import the database

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `web2`
3. Import the `web2.sql` file located in the project root

### 3. Configure database connection

Edit `BackEnd/ConnectionDB/DatabaseDriver.php` if needed:

```php
$Localhost = "localhost";
$User = "root";
$Pass = "";
$DbName = "web2";
```

### 4. Run the project

Open your browser and go to:

```
http://localhost/your-folder-name/
```

### Admin Panel

**URL:** `http://localhost/your-folder-name/Login.php`

Default admin accounts are stored in the `nguoidung` table with `MaQuyen != 1`.

### Project Structure

```
├── index.php                # Homepage
├── Admin.php                # Admin panel
├── Login.php                # Admin login
├── ProductDetail.php        # Product detail page
├── Cart.php                 # Shopping cart
├── User.php                 # User account page
├── php/                     # Backend PHP logic (products, orders, accounts, etc.)
├── js/                      # JavaScript files
├── css/                     # Stylesheets
├── img/                     # Product images
├── lib/                     # Libraries
├── BackEnd/ConnectionDB/    # Database classes
├── data/                    # Data files
└── web2.sql                 # Database dump
```
