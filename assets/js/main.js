$(document).ready(function() {
    "use strict";

    // Preloader
    $(window).on('load', function() {
        // Hide preloader after 1 second
        setTimeout(function() {
            $('body').addClass('loaded');
        }, 1000);
    });
    
    // Simulate window load event (for preview/development)
    setTimeout(function() {
        $('body').addClass('loaded');
    }, 1500);

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.nl-navbar').addClass('scrolled');
        } else {
            $('.nl-navbar').removeClass('scrolled');
        }
        
        // Back to top button visibility
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').addClass('show');
        } else {
            $('#back-to-top').removeClass('show');
        }
    });

    // Back to top button click event
    $('#back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
        return false;
    });

    // Smooth scrolling for anchor links - optimized for speed and responsiveness
    $('a.nav-link, .nl-cta-buttons a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            
            // Add active class immediately to the clicked nav item
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
            
            // Faster scroll animation (200ms instead of 400ms)
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70
            }, 200, 'linear');
            
            // Update URL without page jump
            if (history.pushState) {
                history.pushState(null, null, hash);
            }
        }
    });

    // Active nav item on scroll
    $(window).scroll(function() {
        var scrollPosition = $(document).scrollTop() + 100;
        
        // Apply active class to nav items
        $('.nav-link').each(function() {
            var navLink = $(this);
            var target = $(navLink.attr('href'));
            
            if (target.length && 
                scrollPosition >= target.offset().top && 
                scrollPosition <= target.offset().top + target.outerHeight()) {
                $('.nav-link').removeClass('active');
                navLink.addClass('active');
            }
        });
    });

    // Fade-in elements on scroll
    function fadeInElements() {
        $('.nl-fade-in').each(function() {
            var element = $(this);
            if ($(window).scrollTop() + $(window).height() > element.offset().top + 100) {
                element.addClass('nl-visible');
            }
        });
    }

    // Add fade-in class to elements
    $('.nl-section-title, .nl-card, .nl-feature-card, .nl-counter-card').addClass('nl-fade-in');
    
    // Initial call and on scroll
    fadeInElements();
    $(window).scroll(fadeInElements);

    // Counter animation
    $('.nl-counter-value').each(function () {
        var $this = $(this);
        var text = $this.text();
        
        // Check if the text contains a plus sign
        if (text.indexOf('+') !== -1) {
            // Remove the plus sign for the animation
            var numValue = parseInt(text.replace('+', ''));
            
            $this.prop('Counter', 0).animate({
                Counter: numValue
            }, {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                    $this.text(Math.ceil(now) + '+');
                }
            });
        } else {
            // For numbers without a plus sign
            $this.prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        }
    });

    // Form validation function
    function validateForm(formId) {
        let isValid = true;
        
        $(`#${formId} input[required], #${formId} textarea[required], #${formId} select[required]`).each(function() {
            if ($(this).val() === '') {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        // Validate email format
        const emailInput = $(`#${formId} input[type="email"]`);
        if (emailInput.length && emailInput.val() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.val())) {
                emailInput.addClass('is-invalid');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Show success message
    function showFormSuccess(formId, message) {
        // Clear any existing messages
        $(`#${formId}-message`).remove();
        
        // Add success message
        $(`#${formId}`).after(`
            <div id="${formId}-message" class="nl-alert nl-alert-success mt-3">
                <i class="fas fa-check-circle me-2"></i> ${message}
            </div>
        `);
        
        // Reset the form
        $(`#${formId}`)[0].reset();
        
        // Hide the message after 5 seconds
        setTimeout(function() {
            $(`#${formId}-message`).fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
    }

    // Contact form submission
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        // Validate the form
        if (!validateForm('contactForm')) {
            return false;
        }
        
        // Collect form data
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            userType: $('#userType').val(),
            message: $('#message').val()
        };
        
        // In a real implementation, you would send this data to your server
        // For now, we'll simulate a successful submission
        
        // Simulate network delay
        setTimeout(function() {
            showFormSuccess('contactForm', 'Your message has been sent successfully. We will get back to you soon!');
        }, 1000);
    });
    
    // Input validation on change
    $('input, textarea, select').on('change keyup', function() {
        if ($(this).val() !== '') {
            $(this).removeClass('is-invalid');
        }
    });
    
    // Cursor Trail Implementation
    let dots = [];
    const maxDots = 25; // Increased number of dots for more intense fire effect
    
    // Create initial dots
    function createDots() {
        // Remove any existing dots
        $('.cursor-trail-dot').remove();
        dots = [];
        
        // Create dot elements
        for (let i = 0; i < maxDots; i++) {
            const dot = $('<div class="cursor-trail-dot"></div>');
            $('body').append(dot);
            dots.push({
                element: dot,
                x: 0,
                y: 0,
                alpha: 0,
                size: Math.random() * 4 + 6, // Random size between 6-10px
                speedFactor: Math.random() * 0.3 + 0.2 // Random speed factor
            });
        }
    }
    
    // Track mouse movement
    $(document).on('mousemove', function(e) {
        // Update the position of the lead dot to the current mouse position
        if (dots.length > 0) {
            dots[0].x = e.clientX;
            dots[0].y = e.clientY;
            dots[0].alpha = 1;
            
            // Update the position of each dot
            for (let i = 1; i < dots.length; i++) {
                // Follow the dot ahead of it with slight delay
                const prevDot = dots[i - 1];
                const dot = dots[i];
                const dx = prevDot.x - dot.x;
                const dy = prevDot.y - dot.y;
                
                // Gradually move toward the previous dot with some randomness for flickering
                dot.x += dx * dot.speedFactor;
                // Add slight upward movement for fire effect
                dot.y += dy * dot.speedFactor - (i > dots.length * 0.5 ? 0.5 : 0);
                dot.alpha = 1 - (i / maxDots);
                
                // Get slightly smaller as they trail
                const currentSize = dot.size * (1 - (i / maxDots) * 0.7);
                
                // Add some random "flickering" to simulate fire
                const flicker = (Math.sin(Date.now() / 100 + i) + 1) * 0.15;
                
                // Set position, opacity and size
                dot.element.css({
                    'left': dot.x + 'px',
                    'top': dot.y + 'px',
                    'opacity': Math.min(dot.alpha + flicker, 1),
                    'width': currentSize + 'px',
                    'height': currentSize + 'px'
                });
                
                // Add fading class to later dots
                if (i > maxDots * 0.6) {
                    dot.element.addClass('fading');
                } else {
                    dot.element.removeClass('fading');
                }
            }
        }
    });
    
    // Create dots when page loads
    createDots();
    
    // Recreate dots when window is resized
    $(window).on('resize', function() {
        createDots();
    });
}); 