# Smartphone Store

A PHP-based e-commerce website for selling smartphones.

## Requirements

- PHP 7.2+
- MySQL / MariaDB
- Apache (with mod_rewrite) or any PHP-compatible web server

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

Edit `BackEnd/ConnectionDB/DB_driver.php` if needed:

```php
$localhost = "localhost";
$user = "root";
$pass = "";
$DbName = "web2";
```

### 4. Run the project

Open your browser and go to:

```
http://localhost/source/
```

(Adjust the path if the folder name is different)

### Admin Panel

**URL:** `http://localhost/source/login.php`

Default admin accounts are stored in the `nguoidung` table with `MaQuyen != 1`.

### Project Structure

```
source/
├── index.php                # Homepage
├── admin.php                # Admin panel
├── login.php                # Admin login
├── chitietsanpham.php       # Product detail page
├── giohang.php              # Shopping cart
├── nguoidung.php            # User account page
├── php/                     # Backend PHP logic
├── js/                      # JavaScript files
├── css/                     # Stylesheets
├── img/                     # Images
├── lib/                     # Libraries
├── BackEnd/ConnectionDB/    # Database classes
├── data/                    # Data files
└── web2.sql                 # Database dump
```

## Note

This is an older PHP project that uses MySQLi (deprecated in newer PHP versions). For production use, consider migrating to PDO or a modern framework.
