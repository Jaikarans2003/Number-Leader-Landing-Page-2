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
}); 