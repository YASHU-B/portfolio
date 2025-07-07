document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbar = document.getElementById('navbar');
                const menuToggle = document.querySelector('.menu-toggle');
                const navList = navbar.querySelector('ul');
                
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    // Add this to your script.js
function animateName() {
    const name = "B Yaswanth";
    const nameElement = document.querySelector('.highlight');
    nameElement.textContent = '';
    
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < name.length) {
            nameElement.textContent += name[i];
            i++;
        } else {
            clearInterval(typingInterval);
            // Optional: Add a pulse effect after typing completes
            nameElement.classList.add('pulse');
        }
    }, 150);
}

// Call this when the page loads or when the section comes into view
animateName();

    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.getElementById('navbar');
    const navList = navbar.querySelector('ul');
    
    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.boxShadow = 'var(--shadow)';
        }
    });
    
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (isElementInViewport(bar)) {
                bar.style.width = width;
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Run once on page load
    
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                number.textContent = Math.floor(current);
            }, 10);
        });
    }
    
    // Only animate when stats section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.textContent = 'Message sent successfully!';
                    formMessage.style.backgroundColor = '#4CAF50';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    formMessage.textContent = 'Error: ' + data.message;
                    formMessage.style.backgroundColor = '#f44336';
                    formMessage.style.display = 'block';
                }
                
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                formMessage.textContent = 'Error: ' + error;
                formMessage.style.backgroundColor = '#f44336';
                formMessage.style.display = 'block';
                
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        });
    }
});
fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    // Handle successful response
    formMessage.textContent = data.message;
    formMessage.style.display = 'block';
    formMessage.style.backgroundColor = data.success ? '#4CAF50' : '#f44336';
    
    if (data.success) {
        contactForm.reset();
    }
})
.catch(error => {
    console.error('Error:', error);
    formMessage.textContent = 'An error occurred. Please try again.';
    formMessage.style.backgroundColor = '#f44336';
    formMessage.style.display = 'block';
});