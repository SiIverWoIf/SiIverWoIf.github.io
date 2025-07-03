function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
}

function openUrl(url) {
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu click handlers
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            document.getElementById('nav-menu').classList.remove('show');
        });
    });

    // Click outside menu to close
    document.addEventListener('click', function(event) {
        const nav = document.querySelector('nav');
        const menu = document.getElementById('nav-menu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (!nav.contains(event.target) || 
            (event.target !== toggle && !toggle.contains(event.target) && !menu.contains(event.target))) {
            menu.classList.remove('show');
        }
    });
});

// Fixed URL Shortener Function with multiple API fallbacks
async function shortenUrl() {
    const urlInput = document.getElementById('url-input').value.trim();
    if (!urlInput) {
        alert('Please input an URL!');
        return;
    }
    
    // Add protocol if missing
    let url = urlInput;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // Try multiple APIs
    const apis = [
        {
            name: 'TinyURL',
            url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
            method: 'GET'
        },
        {
            name: 'is.gd',
            url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
            method: 'GET'
        }
    ];
    
    for (let api of apis) {
        try {
            const response = await fetch(api.url);
            if (response.ok) {
                const shortenedUrl = await response.text();
                if (shortenedUrl && shortenedUrl.startsWith('http')) {
                    document.getElementById('shortened-url').textContent = shortenedUrl;
                    document.getElementById('shortened-url').href = shortenedUrl;
                    document.getElementById('result-container').style.display = 'block';
                    return;
                }
            }
        } catch (error) {
            console.log(`${api.name} API failed:`, error);
            continue;
        }
    }
    
    // If all APIs fail, create a simple shortened version
    const shortCode = Math.random().toString(36).substring(2, 8);
    const fallbackUrl = `https://short.ly/${shortCode}`;
    document.getElementById('shortened-url').textContent = `${fallbackUrl} (Demo)`;
    document.getElementById('shortened-url').href = url; // Link to original URL
    document.getElementById('result-container').style.display = 'block';
    alert('Note: This is a demo link. The URL shortener service is currently unavailable.');
}

// Add dropdown functionality for mobile
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
    
    // Also handle dropdown on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                this.classList.toggle('show');
            }
        });
    });
}


// Copy to clipboard function
function copyToClipboard() {
    const urlText = document.getElementById('shortened-url').textContent;
    navigator.clipboard.writeText(urlText).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Másolva!';
        copyBtn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#333';
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Nem sikerült a másolás.');
    });
}

// YouTube Thumbnail Functions
function getYouTubeThumbnail() {
    const url = document.getElementById('yt-url-input').value.trim();
    if (!url) {
        alert('Please increase your IQ level.');
        return;
    }
    
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/);
    
    if (!videoIdMatch) {
        alert('Please increase your IQ level.');
        return;
    }
    
    const videoId = videoIdMatch[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    const thumbnailImg = document.getElementById('yt-thumbnail');
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = 'YouTube Thumbnail';
    document.getElementById('thumbnail-result').style.display = 'block';
    
    // Check if high quality thumbnail exists, fallback to standard if not
    thumbnailImg.onerror = function() {
        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        this.onerror = null;
    };
}

function downloadThumbnail() {
    const thumbnailUrl = document.getElementById('yt-thumbnail').src;
    const link = document.createElement('a');
    link.href = thumbnailUrl;
    link.download = 'youtube-thumbnail.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyThumbnailUrl() {
    const thumbnailUrl = document.getElementById('yt-thumbnail').src;
    navigator.clipboard.writeText(thumbnailUrl).then(() => {
        alert('Thumbnail URL copied to clipboard.');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Sucks to be you.');
    });
}

// Enter key support for inputs
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const ytInput = document.getElementById('yt-url-input');
    
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                shortenUrl();
            }
        });
    }
    
    if (ytInput) {
        ytInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getYouTubeThumbnail();
            }
        });
    }
});
