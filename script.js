document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const upiForm = document.getElementById('upiForm');
    const upiIdInput = document.getElementById('upiId');
    const payeeNameInput = document.getElementById('payeeName');
    const amountInput = document.getElementById('amount');
    const transactionNoteInput = document.getElementById('transactionNote');
    const amountQuickFillButtons = document.querySelectorAll('.amount-quick-fill button');

    const upiIdError = document.getElementById('upiIdError');
    const payeeNameError = document.getElementById('payeeNameError');
    const amountError = document.getElementById('amountError');

    const qrOutputArea = document.getElementById('qrOutputArea');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const downloadQrButton = document.getElementById('downloadQrButton');
    const downloadCombinedQrButton = document.getElementById('downloadCombinedQrButton'); // New button
    const linkOutputArea = document.getElementById('linkOutputArea');
    const upiLinkButton = document.getElementById('upiLinkButton');
    const upiLinkText = document.getElementById('upiLinkText');
    const copyLinkButton = document.getElementById('copyLinkButton');
    const copyFeedback = document.getElementById('copyFeedback');
    const shareSection = document.getElementById('shareSection');

    const whatsappShare = document.getElementById('whatsapp-share');
    const telegramShare = document.getElementById('telegram-share');
    const nativeShareButton = document.getElementById('nativeShareButton'); // Changed from emailShare

    const historyList = document.getElementById('historyList');
    const noHistoryMessage = document.getElementById('noHistoryMessage');
    const clearAllHistoryButton = document.getElementById('clearAllHistoryButton');

    // Theme Toggle elements
    const themeToggleButton = document.getElementById('themeToggleButton');
    const body = document.body;
    const THEME_KEY = 'themePreference';

    // Own Link Feature elements
    const generateOwnLinkButton = document.getElementById('generateOwnLinkButton');
    const ownLinkOutputArea = document.getElementById('ownLinkOutputArea');
    const ownLinkText = document.getElementById('ownLinkText');
    const copyOwnLinkButton = document.getElementById('copyOwnLinkButton');
    const copyOwnLinkFeedback = document.getElementById('copyOwnLinkFeedback');


    let generatedUpiLink = '';

    const HISTORY_KEY = 'upiPaymentHistory';

    // --- Theme Management ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem(THEME_KEY, theme);
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        applyTheme(savedTheme);
    };

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    loadTheme(); // Load theme on page load

    // --- History Management ---
    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        historyList.innerHTML = ''; // Clear existing list
        if (history.length === 0) {
            noHistoryMessage.classList.remove('hidden');
            clearAllHistoryButton.classList.add('hidden');
        } else {
            noHistoryMessage.classList.add('hidden');
            clearAllHistoryButton.classList.remove('hidden');
            [...history].reverse().forEach((item, originalIndex) => {
                const listItem = document.createElement('li');
                const actualIndex = history.indexOf(item); // Find original index for deletion

                listItem.innerHTML = `
                    <a href="${item.link}" target="_blank" class="history-item-link">
                        ${item.name} - ₹${item.amount} ${item.note ? `(${item.note})` : ''} (${item.date})
                    </a>
                    <button class="history-delete-btn" data-actual-index="${actualIndex}">Delete</button>
                `;
                historyList.appendChild(listItem);
            });
        }
    };

    const saveToHistory = (item) => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        history.push(item);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        loadHistory();
    };

    const deleteHistoryItem = (actualIndex) => {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        history.splice(actualIndex, 1);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        loadHistory();
    };

    const clearAllHistory = () => {
        if (confirm('Are you sure you want to clear all payment history? This action cannot be undone.')) {
            localStorage.removeItem(HISTORY_KEY);
            loadHistory();
        }
    };

    loadHistory();

    historyList.addEventListener('click', (event) => {
        if (event.target.classList.contains('history-delete-btn')) {
            const actualIndex = parseInt(event.target.dataset.actualIndex);
            deleteHistoryItem(actualIndex);
        }
    });

    clearAllHistoryButton.addEventListener('click', clearAllHistory);

    // --- Native Share API Check ---
    if (navigator.share) {
        nativeShareButton.classList.remove('hidden');
    }

    // --- URL Parameter Pre-filling ---
    const parseUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('pa')) {
            upiIdInput.value = decodeURIComponent(params.get('pa'));
        }
        if (params.has('pn')) {
            payeeNameInput.value = decodeURIComponent(params.get('pn'));
        }
        if (params.has('am')) {
            amountInput.value = decodeURIComponent(params.get('am'));
        }
        if (params.has('tn')) {
            transactionNoteInput.value = decodeURIComponent(params.get('tn'));
        }
    };
    parseUrlParams();

    // --- Input Validation ---
    const validateInputs = () => {
        let isValid = true;
        upiIdError.textContent = '';
        payeeNameError.textContent = '';
        amountError.textContent = '';

        if (upiIdInput.value.trim() === '') {
            upiIdError.textContent = 'UPI ID cannot be empty.';
            isValid = false;
        } else if (!upiIdInput.value.trim().includes('@')) {
             upiIdError.textContent = 'Please enter a valid UPI ID (e.g., example@bank).';
             isValid = false;
        }
        if (payeeNameInput.value.trim() === '') {
            payeeNameError.textContent = 'Payee Name cannot be empty.';
            isValid = false;
        }
        // Amount field is now optional
        if (amountInput.value.trim() !== '' && (isNaN(amountInput.value) || parseFloat(amountInput.value) <= 0)) {
            amountError.textContent = 'If provided, amount must be a number greater than zero.';
            isValid = false;
        }
        return isValid;
    };

    // --- Form Submission (Generate QR & Link) ---
    upiForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (validateInputs()) {
            const upiId = encodeURIComponent(upiIdInput.value.trim());
            const payeeName = encodeURIComponent(payeeNameInput.value.trim());
            const amountValue = amountInput.value.trim(); // Get raw amount string
            const amount = amountValue !== '' ? parseFloat(amountValue).toFixed(2) : ''; // Format if not empty
            const transactionNote = encodeURIComponent(transactionNoteInput.value.trim());

            generatedUpiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&cu=INR`;
            if (amount) { // Only add amount if present
                generatedUpiLink += `&am=${encodeURIComponent(amount)}`;
            }
            if (transactionNote) {
                generatedUpiLink += `&tn=${transactionNote}`;
            }

            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generatedUpiLink)}`;
            qrCodeImage.src = qrCodeUrl;
            qrCodeImage.alt = `QR Code for UPI payment to ${decodeURIComponent(payeeName)} ${amount ? `for INR ${amount}` : ''}${transactionNote ? ` with note: ${decodeURIComponent(transactionNote)}` : ''}`;

            upiLinkButton.href = generatedUpiLink;
            upiLinkText.textContent = generatedUpiLink;

            qrOutputArea.classList.remove('hidden');
            linkOutputArea.classList.remove('hidden');
            shareSection.classList.remove('hidden');

            const shareText = `Pay ${decodeURIComponent(payeeName)} ${amount ? `INR ${amount} ` : ''}using UPI! ${transactionNote ? `Note: ${decodeURIComponent(transactionNote)}. ` : ''}Click here: ${generatedUpiLink}`;
            whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            telegramShare.href = `https://t.me/share/url?url=${encodeURIComponent(generatedUpiLink)}&text=${encodeURIComponent(`Pay ${decodeURIComponent(payeeName)} ${amount ? `INR ${amount} ` : ''}using UPI!${transactionNote ? ` Note: ${decodeURIComponent(transactionNote)}` : ''}`)}`;
            // emailShare.href was removed

            const now = new Date();
            const dateString = now.toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            saveToHistory({
                id: upiIdInput.value.trim(),
                name: payeeNameInput.value.trim(),
                amount: amount || 'N/A', // Save 'N/A' if amount is empty
                note: transactionNoteInput.value.trim(),
                link: generatedUpiLink,
                date: dateString
            });

            copyFeedback.textContent = '';
        } else {
            qrOutputArea.classList.add('hidden');
            linkOutputArea.classList.add('hidden');
            shareSection.classList.add('hidden');
        }
    });

    // --- Copy Payment Link Button ---
    copyLinkButton.addEventListener('click', () => {
        if (generatedUpiLink) {
            navigator.clipboard.writeText(generatedUpiLink)
                .then(() => {
                    copyFeedback.textContent = 'Link copied!';
                    setTimeout(() => {
                        copyFeedback.textContent = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    copyFeedback.textContent = 'Failed to copy link.';
                });
        }
    });

    // --- Native Share Button ---
    nativeShareButton.addEventListener('click', async () => {
        if (navigator.share && generatedUpiLink && payeeNameInput.value.trim()) {
            const amountText = amountInput.value.trim() ? ` INR ${parseFloat(amountInput.value).toFixed(2)}` : '';
            try {
                await navigator.share({
                    title: 'UPI Payment Request',
                    text: `Pay ${payeeNameInput.value.trim()}${amountText} using UPI!`,
                    url: generatedUpiLink,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    });

    // --- Quick Fill Amount Buttons ---
    amountQuickFillButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountInput.value = button.dataset.amount;
            amountError.textContent = '';
        });
    });

    // --- Real-time Input Validation Feedback ---
    upiIdInput.addEventListener('input', () => {
        const value = upiIdInput.value.trim();
        if (value === '') {
            upiIdError.textContent = 'UPI ID cannot be empty.';
        } else if (!value.includes('@')) {
            upiIdError.textContent = 'Please enter a valid UPI ID (e.g., example@bank).';
        } else {
            upiIdError.textContent = '';
        }
    });

    payeeNameInput.addEventListener('input', () => {
        payeeNameError.textContent = payeeNameInput.value.trim() === '' ? 'Payee Name cannot be empty.' : '';
    });

    amountInput.addEventListener('input', () => {
        const value = amountInput.value.trim();
        if (value !== '' && (isNaN(value) || parseFloat(value) <= 0)) {
            amountError.textContent = 'If provided, amount must be a number greater than zero.';
        } else {
            amountError.textContent = '';
        }
    });

    // --- Dynamic QR Code Download Feature (Original) ---
    downloadQrButton.addEventListener('click', async () => {
        if (qrCodeImage.src) {
            try {
                const response = await fetch(qrCodeImage.src);
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `UPI_QR_Code_${payeeNameInput.value.trim() || 'payment'}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            } catch (error) {
                console.error('Error downloading QR code:', error);
                alert('Could not download QR code. Please try again.');
            }
        } else {
            alert('Please generate a QR code first.');
        }
    });

    // --- Download Combined QR Banner Feature (Existing in index.html) ---
    downloadCombinedQrButton.addEventListener('click', async () => {
        if (!generatedUpiLink) {
            alert('Please generate a QR code and link first!');
            return;
        }
        
        try {
            const payeeName = payeeNameInput.value.trim();
            const amountValue = amountInput.value.trim(); // Get raw amount string
            const amount = amountValue !== '' ? parseFloat(amountValue).toFixed(2) : ''; // Format if not empty
            const qrCodeSrc = qrCodeImage.src;
            const logoSrc = 'https://i.ibb.co/GQsYHWtW/logo.png'; // Your logo link
            const upiAppsCombinedImageSrc = 'https://i.ibb.co/LDKX5n32/upi-apps.png'; // Combined UPI apps image link

            // Load static images for this local banner generation
            const [logoImage, upiAppsImage] = await Promise.all([
                loadImage(logoSrc),
                loadImage(upiAppsCombinedImageSrc)
            ]);

            // Call createCombinedQrImage with actual image objects
            const canvas = document.createElement('canvas'); // Create a new canvas for this specific download
            const ctx = canvas.getContext('2d');
            
            await createCombinedQrImage(canvas, ctx, logoImage, qrCodeSrc, payeeName, amount, upiAppsImage);
            
            const dataUrl = canvas.toDataURL('image/png');
            
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `UPI_Payment_Banner_${payeeName || 'generated'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          

        } catch (error) {
            console.error('Error generating or downloading combined QR image:', error);
            alert('Failed to generate payment banner. Please try again. Check console for details.');
        }
    });

    // Utility function to load an image - common for both index.html and banner.html logic
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => {
                console.error(`Error loading image from ${src}:`, e);
                reject(new Error(`Failed to load image from: ${src}`));
            };
            img.crossOrigin = 'Anonymous'; 
            img.src = src;
        });
    };

    // Refactored createCombinedQrImage to accept canvas and ctx
    async function createCombinedQrImage(canvas, ctx, logoImage, qrCodeSrc, payeeName, amount, upiAppsImage) { // Added canvas and ctx parameters
        // Define banner dimensions
        const bannerWidth = 600; // px
        // Adjust bannerHeight dynamically based on whether amount is shown
        let bannerHeight = 850; // Base height without amount
        const amountDisplayHeight = 60; // Height added for amount text
        if (amount) {
            bannerHeight += amountDisplayHeight;
        }
        
        const padding = 40;

        canvas.width = bannerWidth;
        canvas.height = bannerHeight;

        // 1. Draw Gradient Background
        const gradient = ctx.createLinearGradient(0, 0, bannerWidth, bannerHeight);
        gradient.addColorStop(0, '#e0f7fa'); // Light blue
        gradient.addColorStop(0.5, '#ffffff'); // White
        gradient.addColorStop(1, '#e0f7fa'); // Light blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, bannerWidth, bannerHeight);

        let qrImage;
        try {
            qrImage = await loadImage(qrCodeSrc);
        } catch (error) {
            throw new Error("Could not load QR code image.");
        }

        let currentY = padding; // Starting Y position for drawing

        // 2. Draw Logo at Top
        const logoMaxHeight = 80; 
        const logoMaxWidth = bannerWidth * 0.7; 
        let logoDrawWidth = logoImage.width;
        let logoDrawHeight = logoImage.height;

        if (logoDrawWidth > logoMaxWidth) {
            logoDrawHeight = (logoMaxWidth / logoDrawWidth) * logoDrawHeight;
            logoDrawWidth = logoMaxWidth;
        }
        if (logoDrawHeight > logoMaxHeight) {
            logoDrawWidth = (logoMaxHeight / logoDrawHeight) * logoDrawWidth;
            logoDrawHeight = logoMaxHeight;
        }
        const logoX = (bannerWidth - logoDrawWidth) / 2;
        ctx.drawImage(logoImage, logoX, currentY, logoDrawWidth, logoDrawHeight);
        currentY += logoDrawHeight + padding / 1.5; 
        currentY += 30;

        // 3. Draw "Scan to Pay" Text
        ctx.font = '700 36px "Poppins", sans-serif'; 
        ctx.fillStyle = '#333333'; 
        ctx.textAlign = 'center';
        ctx.fillText('Scan to Pay', bannerWidth / 2, currentY);
        currentY += 40; 

        // 4. Draw QR Code with a subtle frame
        const qrSize = 320; 
        const qrX = (bannerWidth - qrSize) / 2;
        const qrY = currentY;

        const borderRadius = 15;
        ctx.fillStyle = '#FFFFFF'; 
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        
        ctx.beginPath();
        ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, borderRadius);
        ctx.fill();
        ctx.closePath();
        
        ctx.shadowColor = 'transparent'; 

        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        currentY += qrSize + padding / 1.5;
        currentY += 30;

        // 5. Draw Payee Name
        ctx.font = '600 32px "Poppins", sans-serif'; 
        ctx.fillStyle = '#000000'; 
        ctx.fillText(`Pay to: ${payeeName || 'Recipient'}`, bannerWidth / 2, currentY);
        currentY += 50; 

        // 6. Draw Amount (conditionally)
        if (amount) {
            ctx.font = '700 40px "Poppins", sans-serif'; 
            ctx.fillStyle = '#28a745'; 
            ctx.fillText(`Amount: ₹${amount}`, bannerWidth / 2, currentY);
            currentY += 60; 
        }

        // 7. Draw "Accepted Payments" text
        ctx.font = '400 28px "Poppins", sans-serif'; 
        ctx.fillStyle = '#555555';
        ctx.fillText('Accepted on all UPI Apps', bannerWidth / 2, currentY);
        currentY += 50; 

        // 8. Draw Combined UPI App Icons Image - Increased size
        const upiAppsMaxHeight = 100; 
        const upiAppsMaxWidth = bannerWidth * 0.9; 
        let upiAppsDrawWidth = upiAppsImage.width;
        let upiAppsDrawHeight = upiAppsImage.height;

        if (upiAppsDrawWidth > upiAppsMaxWidth) {
            upiAppsDrawHeight = (upiAppsMaxWidth / upiAppsDrawWidth) * upiAppsDrawHeight;
            upiAppsDrawWidth = upiAppsMaxWidth;
        }
        if (upiAppsDrawHeight > upiAppsMaxHeight) {
            upiAppsDrawWidth = (upiAppsMaxHeight / upiAppsDrawHeight) * upiAppsDrawWidth;
            upiAppsDrawHeight = upiAppsMaxHeight;
        }
        const upiAppsX = (bannerWidth - upiAppsDrawWidth) / 2;
        ctx.drawImage(upiAppsImage, upiAppsX, currentY, upiAppsDrawWidth, upiAppsDrawHeight);
        
        // This function no longer returns a data URL as it operates on a passed canvas
        // The calling function will get the data URL from the canvas.
    }


    // --- "Generate Own Sharable Banner Link" Feature ---
    generateOwnLinkButton.addEventListener('click', () => {
        const upiId = encodeURIComponent(upiIdInput.value.trim());
        const payeeName = encodeURIComponent(payeeNameInput.value.trim());
        const amount = amountInput.value.trim() ? encodeURIComponent(parseFloat(amountInput.value).toFixed(2)) : '';
        const transactionNote = transactionNoteInput.value.trim() ? encodeURIComponent(transactionNoteInput.value.trim()) : '';

        if (!upiId || !payeeName) {
            alert('Please enter your UPI ID and Name to generate your sharable banner link.');
            return;
        }

        // Construct the link to the new banner.html page
        let sharableBannerLink = window.location.origin + '/banner.html' + `?pa=${upiId}&pn=${payeeName}`;
        if (amount) {
            sharableBannerLink += `&am=${amount}`;
        }
        if (transactionNote) {
            sharableBannerLink += `&tn=${transactionNote}`;
        }

        ownLinkText.textContent = sharableBannerLink;
        ownLinkOutputArea.classList.remove('hidden');
        copyOwnLinkFeedback.textContent = ''; // Clear previous feedback
    });

    // --- Copy Own Link Button ---
    copyOwnLinkButton.addEventListener('click', () => {
        if (ownLinkText.textContent) {
            navigator.clipboard.writeText(ownLinkText.textContent)
                .then(() => {
                    copyOwnLinkFeedback.textContent = 'Link copied!';
                    setTimeout(() => {
                        copyOwnLinkFeedback.textContent = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy own link: ', err);
                    copyOwnLinkFeedback.textContent = 'Failed to copy link.';
                });
        }
    });
});