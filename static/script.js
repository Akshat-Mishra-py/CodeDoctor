const toggle = document.getElementsByClassName('theme-toggle');
function toggleTheme()  {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log(document.documentElement)
    // Switch icon
    toggle[0].innerHTML = !isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
toggle[0].addEventListener('click', toggleTheme)

// Code Viewer Functionality
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const languageSelect = document.getElementById('language-select');
const langBadge = document.getElementById('lang-badge');
const copyBtn = document.getElementById('copy-btn');

if (codeInput) {
    codeInput.addEventListener('input', function() {
        codeOutput.textContent = this.value;
        Prism.highlightElement(codeOutput);
    });

    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        const langNames = {
            'javascript': 'JavaScript',
            'python': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'csharp': 'C#',
            'html': 'HTML',
            'css': 'CSS',
            'php': 'PHP',
            'sql': 'SQL'
        };

        // Update language badge
        langBadge.textContent = langNames[selectedLang];

        // Remove all language classes
        codeOutput.className = '';
        codeOutput.classList.add(`language-${selectedLang}`);

        // Update the code display
        Prism.highlightElement(codeOutput);
    });

    copyBtn.addEventListener('click', function() {
        const code = codeInput.value;
        navigator.clipboard.writeText(code).then(() => {
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
}

const FixBtn = document.getElementById('fix-btn');
if (FixBtn) {
    FixBtn.addEventListener('click', async function() {
        
        const code = document.getElementById('code-input').value;
        if (code.length === 0) {
            alert('Please paste your code before clicking Fix Code!');
            return;
        }
        const language = document.getElementById('language-select').value;
        const loadingIndicator = document.getElementById('loading');
        
        const response = await fetch('/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language })
        })
        FixBtn.disabled = true;
        loadingIndicator.style.display = 'block';
        
        const result = await response.json();
        if (result.redirect_url) {
            window.location.href =  result.redirect_url;
        }
    });
}