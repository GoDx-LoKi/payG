Pay-G: Instant UPI Payment Link & QR Generator
✨ Overview
Pay-G is a simple, intuitive, and mobile-friendly web application that allows users to quickly generate UPI (Unified Payments Interface) payment links and QR codes. Beyond basic generation, it offers a unique feature to create a sharable, aesthetic payment banner that automatically displays payment details when shared, providing a seamless payment request experience.

Designed with a clean, modern UI inspired by Google's design principles, Pay-G aims to make the process of requesting and making UPI payments as effortless as possible.

🚀 Features
UPI Link Generation: Create direct upi://pay links with UPI ID, payee name, amount (optional), and transaction note (optional).

Dynamic QR Code Generation: Instantly generate QR codes for the generated UPI links.

Sharable Payment Banner:

Generate a unique URL that, when opened, displays a beautifully designed, mobile-friendly payment banner with your QR code, payee name, and amount.

This is perfect for sharing on social media, in chats, or anywhere you need a dedicated payment page.

QR Code & Banner Download: Download the generated QR code or the full payment banner as a PNG image.

Copy to Clipboard: Easily copy generated UPI links or sharable banner links.

Quick Amount Fillers: Pre-defined buttons for common amounts to speed up input.

Payment Request History: Saves your generated payment requests locally in your browser for quick access and re-use.

Theme Toggle: Switch between light and dark modes for a personalized experience.

Native Share Integration: Utilize your device's native sharing capabilities for UPI links.

Mobile-Friendly UI: A clean and responsive design ensures a great experience on any device.

🛠️ Technologies Used
HTML5: For structuring the web application.

CSS3: For styling, including responsive design and the custom "Google-inspired" theme.

JavaScript (ES6+): For all interactive functionalities, form handling, QR code generation, image manipulation for banners, and local storage management.

QR Server API: External API used to generate QR codes from UPI links.

Google Fonts (Poppins): For modern and legible typography.

Font Awesome: For various icons used throughout the UI.

⚡ How to Use
1. Generate a Payment Request
Open the index.html file in your web browser.

Enter your UPI ID (e.g., yourname@bank or 1234567890@upi).

Enter your Name (this will be the payee name).

Optionally, enter the Amount you wish to receive. You can use the quick-fill buttons for common amounts.

Optionally, add a Transaction Note (e.g., "For coffee").

Click the "Generate QR & Link" button.

2. Output Options
After generation, you will see several options:

QR Code Image: Scan this directly with any UPI app to pay.

Download QR Code: Download just the QR code image.

Download Payment Banner: Download a visually appealing banner image (QR + details + UPI apps logo).

Pay Now (via UPI App): Click this button on your mobile device to open the UPI link directly in a supported UPI app.

Copy Link: Copy the raw upi://pay link to your clipboard.

3. Sharable Payment Banner Link (New Feature)
In the "Generate Your Sharable Banner Link" section, click "Get Sharable Banner Link".

A unique URL will be generated based on your entered UPI details.

Copy Link: Copy this URL.

Share: Share this link with anyone. When they open it in their browser, they will see a dedicated, mobile-friendly page displaying your payment banner with a "Pay Now" button to easily initiate the payment.

4. Payment Request History
All generated payment requests are saved locally in your browser's history.

Click on any history item to re-load the details into the form.

You can delete individual items or clear all history.

5. Theme Toggle
Click the "Toggle Dark Mode" button in the top right corner to switch between light and dark themes. Your preference will be saved.

💻 Local Setup (for Developers)
To run this project on your local machine:

Clone or Download: Get the project files (e.g., from a GitHub repository if available, or simply download the .zip file).

Folder Structure: Ensure your folder structure looks like this:

your-project-folder/
├── index.html
├── script.js
├── banner.html
└── img/
    ├── Screenshot_2024-01-18 195101-fotor-bg-remover-20240118195750.png (Your main logo)
    └── upi-apps.png (Combined UPI app icons image)

Important: Place your specific logo (Screenshot...png) and the combined UPI apps image (upi-apps.png) inside the img/ folder as referenced in the code.

Open index.html: Simply open the index.html file in your preferred web browser. All features should work directly.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to:

Fork the repository (if applicable).

Create a new branch (git checkout -b feature/your-feature-name or bugfix/issue-description).

Make your changes.

Commit your changes (git commit -m 'Feat: Add new feature X').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.

📄 License
This project is open-sourced under the MIT License. See the LICENSE file for more details. (Note: You might need to create a separate LICENSE file if you intend to use this for a public repository).
