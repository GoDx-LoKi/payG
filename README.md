# 💸 Pay-G: Instant UPI Payment Link & QR Generator

## ✨ Overview
**Pay-G** is a simple, intuitive, and mobile-friendly web application that enables users to quickly generate UPI (Unified Payments Interface) payment links and QR codes. It also offers a unique feature to create a shareable, aesthetic **payment banner** that displays all relevant payment details — perfect for seamless payment requests.

Built with a modern UI inspired by Google's design principles, Pay-G makes requesting and sending payments a breeze.

---

## 🚀 Features

- **UPI Link Generation**  
  Create direct `upi://pay` links using UPI ID, payee name, amount (optional), and transaction note (optional).

- **Dynamic QR Code Generation**  
  Instantly generate QR codes from UPI links.

- **Sharable Payment Banner**  
  Generate a unique URL that displays a beautiful, mobile-friendly payment banner with QR code, payee name, and amount.

- **QR Code & Banner Download**  
  Download QR codes or full payment banners as PNG images.

- **Copy to Clipboard**  
  Quickly copy UPI links or shareable banner links.

- **Quick Amount Fillers**  
  Buttons for commonly used amounts for faster input.

- **Payment Request History**  
  Locally saves previously generated requests for reuse.

- **Theme Toggle**  
  Light and dark mode toggle with saved preferences.

- **Native Share Integration**  
  Use your device's share options to share links directly.

- **Mobile-Friendly UI**  
  Clean, responsive design for all screen sizes.

---

## 🛠️ Technologies Used

- **HTML5** – Semantic and structured layout.
- **CSS3** – Custom Google-like theme and responsive styles.
- **JavaScript (ES6+)** – Logic, interactivity, and QR/banner generation.
- **QR Server API** – Generates QR codes.
- **Google Fonts (Poppins)** – Clean, modern typography.
- **Font Awesome** – Icon library.

---

## ⚡ How to Use

### 1. Generate a Payment Request
- Open `index.html` in a browser.
- Enter:
  - Your **UPI ID** (e.g., `yourname@bank`)
  - **Payee Name**
  - **Amount** (optional)
  - **Transaction Note** (optional)
- Click **"Generate QR & Link"**

### 2. Output Options
- **QR Code Image** – Scan directly using UPI apps.
- **Download QR Code** – Save as PNG.
- **Download Payment Banner** – Save a complete banner image.
- **Pay Now** – Opens the UPI app (on mobile).
- **Copy Link** – Copy raw UPI link to clipboard.

### 3. Sharable Payment Banner Link
- Go to **"Generate Your Sharable Banner Link"**
- Click **"Get Sharable Banner Link"**
- Share the generated URL — opens a banner page with payment details and QR code.

### 4. Payment Request History
- All generated links are saved locally in the browser.
- Click to reuse; delete or clear history anytime.

### 5. Theme Toggle
- Toggle between **Dark** and **Light** mode using the button in the top-right.
- Theme preference is saved automatically.

---

## 💻 Local Setup (for Developers)

### 📁 Folder Structure

