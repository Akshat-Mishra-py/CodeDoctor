
const username = 'Akshat-Mishra-py';
document.documentElement.setAttribute("data-theme", "dark")
async function loadRepos() {
    const grid = document.getElementById('repo-grid');
    if (!grid) return;

    // Check LocalStorage Cache
    const cachedData = localStorage.getItem('gh_repos');
    const cacheTime = localStorage.getItem('gh_repos_time');
    const now = new Date().getTime();
    if (cachedData && (now - cacheTime < 300000)) { 
        return renderRepos(JSON.parse(cachedData));        
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        if (!response.ok) throw new Error('GitHub API limit reached');
        
        const repos = await response.json();
        localStorage.setItem('gh_repos', JSON.stringify(repos));
        localStorage.setItem('gh_repos_time', now.toString());
        
        renderRepos(repos);
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

function renderRepos(repos) {
    const grid = document.getElementById('repo-grid');
    grid.innerHTML = repos.map((repo) => {
        // Match CSS classes for special glow effects
        let cardClass = "card";
        if (repo.name.includes("Neural")) cardClass += " neural-card";
        if (repo.name.includes("Donut")) cardClass += " donut-card";

        // Unique image per repo using repo.id
        return `
            <div class="${cardClass}">
                <div class="card-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Deep tech software project exploring complex logic and engineering.'}</p>
                    <div class="card-footer">
                        <span class="lang-tag">${repo.language || 'Code'}</span>
                        <a href="${repo.html_url}" target="_blank" style="color: inherit; text-decoration: none; font-weight: bold;">
                            View →
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// document.addEventListener('DOMContentLoaded',loadRepos());


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
const codeDisplay = document.querySelector('.code-display');

if (codeInput) {
    codeInput.addEventListener('input', function() {
        codeOutput.textContent = this.value;
        Prism.highlightElement(codeOutput);
        // Sync scroll positions
        codeDisplay.scrollTop = this.scrollTop;
        codeDisplay.scrollLeft = this.scrollLeft;
    });

    // Sync scroll
    codeInput.addEventListener('scroll', function() {
        codeDisplay.scrollTop = this.scrollTop;
        codeDisplay.scrollLeft = this.scrollLeft;
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