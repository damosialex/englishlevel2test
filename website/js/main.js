/**
 * British English Level 2 Study Guide - Main JavaScript
 * 
 * This file contains general site functionality including:
 * - Navigation handling
 * - Smooth scrolling
 * - General utility functions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('nav a');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        });
    });
    
    // Highlight active navigation item on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile navigation toggle (to be implemented with CSS)
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.classList.add('mobile-nav-toggle');
    mobileNavToggle.setAttribute('aria-label', 'Toggle navigation menu');
    document.querySelector('nav .container').prepend(mobileNavToggle);
    
    mobileNavToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('nav ul');
        navMenu.classList.toggle('show');
        this.classList.toggle('active');
    });
});

/**
 * Utility function to load JSON data
 * @param {string} url - Path to the JSON file
 * @returns {Promise} - Promise resolving to the parsed JSON data
 */
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return null;
    }
}

/**
 * Utility function to create an element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {string|Node|Array} content - Text content, DOM node, or array of nodes
 * @returns {HTMLElement} - The created element
 */
function createElement(tag, attributes = {}, content = null) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Set content
    if (content !== null) {
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(item => {
                if (item instanceof Node) {
                    element.appendChild(item);
                }
            });
        }
    }
    
    return element;
}

/**
 * Utility function to shuffle an array (for randomizing questions)
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Utility function to format text with line breaks
 * @param {string} text - The text to format
 * @returns {string} - HTML with paragraphs
 */
function formatTextWithParagraphs(text) {
    return text.split('\n\n')
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
}