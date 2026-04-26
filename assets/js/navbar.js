// Shared Navbar Component
// Renders consistent navigation bar across all pages
(function() {
    'use strict';

    var courses = [
        { href: 'coding-rounds/index.html', text: 'Coding' },
        { href: 'system-design/index.html', text: 'System Design' },
        { href: 'low-level-design/index.html', text: 'LLD' },
        { href: 'company-specific/index.html', text: 'Companies' },
        { href: 'behavioral/index.html', text: 'Behavioral' },
        { href: 'generative-ai/index.html', text: 'Gen AI' },
        { href: 'harness-engineering/index.html', text: 'Harness' },
        { href: 'metrics-tradeoffs/index.html', text: 'Metrics' },
        { href: 'platform-engineering/index.html', text: 'Platform Eng' }
    ];

    function renderNavbar() {
        var container = document.getElementById('main-navbar');
        if (!container) return;

        // Detect base path from data attribute or auto-detect
        var basePath = container.getAttribute('data-base') || '';

        // Apply extra CSS classes if specified
        var extraClass = container.getAttribute('data-class');
        if (extraClass) container.className += ' ' + extraClass;

        // Detect active course from current path
        var path = window.location.pathname.toLowerCase();
        var activeCourse = '';
        if (path.includes('/system-design')) activeCourse = 'system-design';
        else if (path.includes('/coding-rounds')) activeCourse = 'coding-rounds';
        else if (path.includes('/low-level-design')) activeCourse = 'low-level-design';
        else if (path.includes('/company-specific')) activeCourse = 'company-specific';
        else if (path.includes('/behavioral')) activeCourse = 'behavioral';
        else if (path.includes('/generative-ai')) activeCourse = 'generative-ai';
        else if (path.includes('/harness-engineering')) activeCourse = 'harness-engineering';
        else if (path.includes('/metrics-tradeoffs')) activeCourse = 'metrics-tradeoffs';
        else if (path.includes('/platform-engineering')) activeCourse = 'platform-engineering';

        var html = '<div class="nav-container">';
        html += '<a href="' + basePath + 'index.html" class="logo">StaffEngPrep</a>';
        html += '<ul class="nav-links">';
        courses.forEach(function(c) {
            var courseKey = c.href.split('/')[0];
            var activeStyle = (courseKey === activeCourse) ? ' style="color: var(--primary-color);"' : '';
            html += '<li><a href="' + basePath + c.href + '"' + activeStyle + '>' + c.text + '</a></li>';
        });
        html += '</ul></div>';
        container.innerHTML = html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }
})();
