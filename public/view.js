// Elements
const loadingSection = document.getElementById('loading-section');
const secretSection = document.getElementById('secret-section');
const errorSection = document.getElementById('error-section');
const secretContent = document.getElementById('secret-content');
const copySecretBtn = document.getElementById('copy-secret-btn');
const clearBtn = document.getElementById('clear-btn');
const errorMessage = document.getElementById('error-message');

// Get secret ID from URL
const urlParams = new URLSearchParams(window.location.search);
const secretId = urlParams.get('id');

// Fetch secret on page load
async function fetchSecret() {
    if (!secretId) {
        showError('No secret ID provided in the URL.');
        return;
    }

    try {
        const response = await fetch(`/api/secret/${secretId}`);
        const data = await response.json();

        if (!response.ok) {
            showError(data.message || data.error || 'Failed to retrieve secret');
            return;
        }

        // Show the secret
        secretContent.textContent = data.secret;
        loadingSection.classList.add('hidden');
        secretSection.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while retrieving the secret.');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    loadingSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
}

// Copy secret to clipboard
copySecretBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(secretContent.textContent);
        copySecretBtn.textContent = '✓ Copied!';
        copySecretBtn.style.background = '#28a745';

        setTimeout(() => {
            copySecretBtn.textContent = 'Copy Secret';
            copySecretBtn.style.background = '';
        }, 2000);
    } catch (error) {
        alert('Failed to copy secret to clipboard');
    }
});

// Clear secret from screen
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the secret from the screen?')) {
        secretContent.textContent = '[Secret has been cleared from screen]';
        copySecretBtn.disabled = true;
        clearBtn.disabled = true;
    }
});

// Fetch secret when page loads
fetchSecret();
