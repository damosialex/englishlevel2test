/**
 * British English Level 2 Study Guide - Writing JavaScript
 * 
 * This file contains functionality for:
 * - Writing format tabs
 * - Sample answer toggles
 * - Enhanced writing feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeWritingTabs();
    initializeSampleAnswers();
    enhanceWritingFeedback();
});

/**
 * Initialize the writing format tabs
 */
function initializeWritingTabs() {
    const tabButtons = document.querySelectorAll('.writing-tabs .tab-btn');
    const formatTips = document.querySelectorAll('.writing-format-tips');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            formatTips.forEach(tip => tip.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show the corresponding content
            const format = this.getAttribute('data-format');
            document.getElementById(`${format}-tips`).classList.add('active');
        });
    });
}

/**
 * Initialize the sample answer toggle buttons
 */
function initializeSampleAnswers() {
    const toggleButtons = document.querySelectorAll('.toggle-sample');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sampleAnswer = this.nextElementSibling;
            
            if (sampleAnswer.style.display === 'none') {
                sampleAnswer.style.display = 'block';
                this.textContent = 'Hide Sample Answer';
            } else {
                sampleAnswer.style.display = 'none';
                this.textContent = 'View Sample Answer';
            }
        });
    });
}

/**
 * Enhance the writing feedback functionality
 */
function enhanceWritingFeedback() {
    const checkButtons = document.querySelectorAll('.check-writing');
    const writingAreas = document.querySelectorAll('.writing-exercise textarea');
    
    checkButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const textarea = writingAreas[index];
            const content = textarea.value;
            
            if (content.trim() === '') {
                alert('Please write something before checking.');
                return;
            }
            
            // Provide enhanced feedback
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            const sentenceCount = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
            const paragraphCount = content.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
            
            let feedback = `Word count: ${wordCount}\n`;
            feedback += `Sentence count: ${sentenceCount}\n`;
            feedback += `Paragraph count: ${paragraphCount}\n\n`;
            
            // Word count feedback
            if (wordCount < 200) {
                feedback += 'Your response is quite short. The exam requires approximately 250-350 words.\n';
            } else if (wordCount > 400) {
                feedback += 'Your response is quite long. Try to be more concise while maintaining all key points.\n';
            } else {
                feedback += 'Your word count is appropriate for the task.\n';
            }
            
            // Paragraph structure feedback
            if (paragraphCount < 3) {
                feedback += 'Consider using more paragraphs to organize your ideas better.\n';
            } else if (paragraphCount > 8) {
                feedback += 'You have many short paragraphs. Consider combining some related points.\n';
            } else {
                feedback += 'Your paragraph structure looks good.\n';
            }
            
            // Sentence length feedback
            if (sentenceCount > 0) {
                const avgWordsPerSentence = wordCount / sentenceCount;
                if (avgWordsPerSentence > 25) {
                    feedback += 'Your sentences are quite long on average. Consider using some shorter sentences for clarity.\n';
                } else if (avgWordsPerSentence < 10) {
                    feedback += 'Your sentences are quite short on average. Try combining some ideas for better flow.\n';
                } else {
                    feedback += 'Your sentence length variety looks good.\n';
                }
            }
            
            // Check for common issues
            const commonErrors = [
                { pattern: /\bi\b/g, suggestion: 'Remember to capitalize "I"' },
                { pattern: /\s\s+/g, suggestion: 'Multiple spaces detected' },
                { pattern: /[,.!?][A-Za-z]/g, suggestion: 'Add a space after punctuation marks' },
                { pattern: /\b(their|there|they're|your|you're|its|it's|to|too|two)\b/gi, suggestion: 'Check usage of commonly confused words' },
                { pattern: /\b(affect|effect|accept|except|advice|advise)\b/gi, suggestion: 'Check usage of commonly confused words' },
                { pattern: /\b(im|dont|cant|wont|didnt|couldnt|shouldnt|wouldnt)\b/gi, suggestion: 'Use apostrophes in contractions' },
                { pattern: /\b(alot|aswell|alright|ofcourse)\b/gi, suggestion: 'Check spelling of compound words' }
            ];
            
            let errorFound = false;
            commonErrors.forEach(error => {
                if (error.pattern.test(content)) {
                    if (!errorFound) {
                        feedback += '\nPotential issues to check:\n';
                        errorFound = true;
                    }
                    feedback += `- ${error.suggestion}\n`;
                }
            });
            
            // Format-specific checks based on the exercise
            const exerciseHeading = this.closest('.writing-exercise').querySelector('h4').textContent.toLowerCase();
            
            if (exerciseHeading.includes('formal letter')) {
                if (!content.includes('Dear') && !content.includes('dear')) {
                    feedback += '\n- Your letter may be missing a proper greeting (Dear...)\n';
                }
                if (!content.includes('Yours') && !content.includes('yours')) {
                    feedback += '- Your letter may be missing a proper closing (Yours sincerely/faithfully)\n';
                }
            } else if (exerciseHeading.includes('report')) {
                if (!content.includes('Introduction') && !content.includes('INTRODUCTION') && !content.includes('introduction')) {
                    feedback += '\n- Your report may be missing an introduction section\n';
                }
                if (!content.includes('Conclusion') && !content.includes('CONCLUSION') && !content.includes('conclusion')) {
                    feedback += '- Your report may be missing a conclusion section\n';
                }
            } else if (exerciseHeading.includes('email')) {
                if (!content.includes('Dear') && !content.includes('dear') && !content.includes('Hello') && !content.includes('hello')) {
                    feedback += '\n- Your email may be missing a greeting\n';
                }
                if (!content.includes('regards') && !content.includes('Regards') && !content.includes('Sincerely') && !content.includes('sincerely')) {
                    feedback += '- Your email may be missing a closing\n';
                }
            }
            
            alert(feedback);
        });
    });
    
    // Load saved drafts from local storage
    writingAreas.forEach((textarea, index) => {
        const savedContent = localStorage.getItem(`writing_draft_${index}`);
        if (savedContent) {
            textarea.value = savedContent;
        }
    });
    
    // Set up save buttons
    const saveButtons = document.querySelectorAll('.save-writing');
    saveButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const textarea = writingAreas[index];
            const content = textarea.value;
            
            if (content.trim() === '') {
                alert('Please write something before saving.');
                return;
            }
            
            // Save to local storage
            localStorage.setItem(`writing_draft_${index}`, content);
            alert('Your draft has been saved.');
        });
    });
}