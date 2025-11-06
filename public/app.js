// Elements
const secretForm = document.getElementById('secret-form');
const secretInput = document.getElementById('secret-input');
const expirySelect = document.getElementById('expiry-select');
const createSection = document.getElementById('create-section');
const resultSection = document.getElementById('result-section');
const secretLink = document.getElementById('secret-link');
const copyBtn = document.getElementById('copy-btn');
const createAnotherBtn = document.getElementById('create-another-btn');

// Form submission
secretForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const secret = secretInput.value.trim();
    const expiresIn = parseInt(expirySelect.value);

    if (!secret) {
        alert('Please enter a secret');
        return;
    }

    try {
        const response = await fetch('/api/secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secret, expiresIn }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create secret');
        }

        // Show result
        secretLink.value = data.url;
        createSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create secret: ' + error.message);
    }
});

// Copy link button
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(secretLink.value);
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#28a745';
        copyBtn.style.color = 'white';

        setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    } catch (error) {
        // Fallback for older browsers
        secretLink.select();
        document.execCommand('copy');
        copyBtn.textContent = '✓ Copied!';
    }
});

// Create another secret
createAnotherBtn.addEventListener('click', () => {
    secretInput.value = '';
    resultSection.classList.add('hidden');
    createSection.classList.remove('hidden');
    secretInput.focus();
});
