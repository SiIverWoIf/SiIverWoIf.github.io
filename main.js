function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
}

document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('nav-menu').classList.remove('show');
    });
});

document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(event.target) || 
        (event.target !== toggle && !toggle.contains(event.target) && !menu.contains(event.target))) {
        menu.classList.remove('show');
    }
});
