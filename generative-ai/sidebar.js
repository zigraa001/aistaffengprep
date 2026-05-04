// AI Engineering Course - Shared Sidebar Component
// Renders consistent sidebar navigation across all pages
(function() {
    'use strict';

    // Determine active page from filename
    var path = window.location.pathname;
    var currentFile = path.split('/').pop() || 'index.html';

    function isActive(href) {
        return href.split('/').pop() === currentFile;
    }

    var sidebarData = [
        {
            title: 'Getting Started',
            links: [
                { href: 'index.html', text: 'Introduction' },
                { href: 'cheat-sheet.html', text: 'Interview Cheat Sheet', icon: true }
            ]
        },
        {
            title: 'Phase 1: Foundations',
            links: [
                { href: 'module-01.html', num: '1', text: 'Setup + Core Math' },
                { href: 'module-02.html', num: '2', text: 'Terminology + MNIST' }
            ]
        },
        {
            title: 'Phase 2: LLM Deep Dive',
            links: [
                { href: 'module-03.html', num: '3', text: 'LLM Basics' },
                { href: 'module-04.html', num: '4', text: 'Attention Mechanisms' },
                { href: 'module-05.html', num: '5', text: 'LLM Coding: GPT' },
                { href: 'module-06.html', num: '6', text: 'Training at Scale' },
                { href: 'module-07.html', num: '7', text: 'Optimization Hacks' }
            ]
        },
        {
            title: 'Phase 3: RAG & Retrieval',
            links: [
                { href: 'module-08.html', num: '8', text: 'RAG Fundamentals' },
                { href: 'module-09.html', num: '9', text: 'RAG Implementation' }
            ]
        },
        {
            title: 'Phase 4: Agents & Systems',
            links: [
                { href: 'module-10.html', num: '10', text: 'AI Agents' },
                { href: 'module-11.html', num: '11', text: 'Context Engineering' }
            ]
        },
        {
            title: 'Phase 5: Production AI Eng',
            links: [
                { href: 'module-12.html', num: '12', text: 'AI Engineering Decisions' },
                { href: 'module-13.html', num: '13', text: 'AI Inference Platforms' },
                { href: 'module-14.html', num: '14', text: 'Model Routing & Gateway' },
                { href: 'module-15.html', num: '15', text: 'Observability for AI' },
                { href: 'module-16.html', num: '16', text: 'Cost Optimization' },
                { href: 'module-17.html', num: '17', text: 'Evals Deep Dive' }
            ]
        },
        {
            title: 'Phase 6: Advanced Topics',
            links: [
                { href: 'module-18.html', num: '18', text: 'Thinking Models' },
                { href: 'module-19.html', num: '19', text: 'Multi-modal Models' }
            ]
        },
        {
            title: 'Phase 7: Strategy & Career',
            links: [
                { href: 'module-20.html', num: '20', text: 'Traditional ML & AI Tradeoffs' },
                { href: 'module-21.html', num: '21', text: 'Capstone Project' },
                { href: 'module-22.html', num: '22', text: 'Career Goals' }
            ]
        }
    ];

    function renderSidebar() {
        var container = document.getElementById('sidebar');
        if (!container) return;

        var html = '<nav class="sidebar-nav">';
        sidebarData.forEach(function(section) {
            html += '<div class="sidebar-section">';
            html += '<div class="sidebar-section-title">' + section.title + '</div>';
            section.links.forEach(function(link) {
                var active = isActive(link.href) ? ' active' : '';
                var numSpan = link.num ? '<span class="sidebar-link-number">' + link.num + '</span>' : '';
                var iconPrefix = link.icon ? '&#9889; ' : '';
                html += '<a href="' + link.href + '" class="sidebar-link' + active + '">' + numSpan + iconPrefix + link.text + '</a>';
            });
            html += '</div>';
        });
        html += '</nav>';
        container.innerHTML = html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSidebar);
    } else {
        renderSidebar();
    }
})();
