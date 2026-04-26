// System Design Course - Shared Sidebar Component
// Renders consistent sidebar navigation across all pages
(function() {
    'use strict';

    // Detect if we're in a subdirectory (problems/ or papers/)
    const path = window.location.pathname;
    const inSubdir = /\/(problems|papers)\//.test(path);
    const sdBase = inSubdir ? '../' : '';
    const probBase = inSubdir ? '' : 'problems/';
    const paperBase = inSubdir ? '' : 'papers/';

    // Determine active page from filename
    const currentFile = path.split('/').pop() || 'index.html';
    const currentDir = inSubdir ? path.split('/').slice(-2, -1)[0] : '';

    function isActive(href) {
        const hrefFile = href.split('/').pop();
        if (inSubdir) {
            // In subdir: match exact filename for same-dir links, never match parent-dir links
            const hrefDir = href.includes('/') ? href.split('/').slice(-2, -1)[0] : '';
            if (href.startsWith('../') && !href.includes('/' + currentDir + '/')) {
                return hrefFile === currentFile && hrefDir === '';
            }
            return hrefFile === currentFile;
        }
        return hrefFile === currentFile && !href.includes('/');
    }

    const sidebarData = [
        {
            title: 'Getting Started',
            links: [
                { href: sdBase + 'index.html', text: 'Introduction' },
                { href: sdBase + 'cheat-sheet.html', text: 'Cheat Sheet', icon: true }
            ]
        },
        {
            title: 'Phase 1: Foundations',
            links: [
                { href: sdBase + 'module-10.html', num: '1', text: 'Numbers & Estimation' },
                { href: sdBase + 'module-01.html', num: '2', text: 'Scalability Fundamentals' },
                { href: sdBase + 'module-13.html', num: '3', text: 'Caching Deep Dive' },
                { href: sdBase + 'module-02.html', num: '4', text: 'Database Systems' },
                { href: sdBase + 'module-09.html', num: '5', text: 'API Design & Networking' }
            ]
        },
        {
            title: 'Phase 2: Distributed Systems',
            links: [
                { href: sdBase + 'module-03.html', num: '6', text: 'Distributed Systems Core' },
                { href: sdBase + 'module-14.html', num: '7', text: 'Data Consistency Patterns' },
                { href: sdBase + 'module-15.html', num: '8', text: 'Message Queues & EDA' },
                { href: sdBase + 'module-04.html', num: '9', text: 'Storage & Stream Processing' }
            ]
        },
        {
            title: 'Phase 3: Architecture',
            links: [
                { href: sdBase + 'module-11.html', num: '10', text: 'Real-time Communication' },
                { href: sdBase + 'module-12.html', num: '11', text: 'Rate Limiting & Throttling' },
                { href: sdBase + 'module-16.html', num: '12', text: 'Microservices & Service Arch' },
                { href: sdBase + 'module-17.html', num: '13', text: 'Search & Indexing' },
                { href: sdBase + 'module-18.html', num: '14', text: 'Monitoring & Reliability' }
            ]
        },
        {
            title: 'Phase 4: Staff-Level',
            links: [
                { href: sdBase + 'module-19.html', num: '15', text: 'Security & Authentication' },
                { href: sdBase + 'module-20.html', num: '16', text: 'Staff-Level Design Thinking' }
            ]
        },
        {
            title: 'Phase 5: Interview Execution',
            links: [
                { href: sdBase + 'module-07.html', num: '17', text: 'RESHADE Framework Mastery' },
                { href: sdBase + 'module-08.html', num: '18', text: 'Mock Interviews & Practice' }
            ]
        },
        {
            title: 'Problem Breakdowns',
            links: [
                { href: sdBase + probBase + 'url-shortener.html', text: 'URL Shortener' },
                { href: sdBase + probBase + 'news-feed.html', text: 'News Feed' },
                { href: sdBase + probBase + 'chat-system.html', text: 'Chat System' },
                { href: sdBase + probBase + 'video-streaming.html', text: 'Video Streaming' },
                { href: sdBase + probBase + 'vector-storage.html', text: 'Vector Storage' },
                { href: sdBase + probBase + 'airbnb-booking.html', text: 'Airbnb Booking' },
                { href: sdBase + probBase + 'notification-system.html', text: 'Notification System' },
                { href: sdBase + probBase + 'distributed-cache.html', text: 'Distributed Cache' },
                { href: sdBase + probBase + 'payment-system.html', text: 'Payment System' },
                { href: sdBase + probBase + 'ride-sharing.html', text: 'Ride-Sharing (Uber)' }
            ]
        },
        {
            title: 'Deep Dive Papers',
            links: [
                { href: sdBase + paperBase + 'dynamo.html', text: 'Amazon Dynamo' },
                { href: sdBase + paperBase + 'gfs.html', text: 'Google GFS' },
                { href: sdBase + paperBase + 'bigtable.html', text: 'Google BigTable' },
                { href: sdBase + paperBase + 'kafka.html', text: 'Apache Kafka' },
                { href: sdBase + paperBase + 'spanner.html', text: 'Google Spanner' },
                { href: sdBase + paperBase + 'memcache.html', text: 'Facebook Memcache' },
                { href: sdBase + paperBase + 'mapreduce.html', text: 'Google MapReduce' },
                { href: sdBase + paperBase + 'flink.html', text: 'Apache Flink' }
            ]
        },
        {
            title: 'Reference',
            links: [
                { href: sdBase + 'module-05.html', text: 'Seminal Papers Guide' },
                { href: sdBase + 'module-06.html', text: 'Common Problems Hub' }
            ]
        }
    ];

    function renderSidebar() {
        const container = document.getElementById('sd-sidebar');
        if (!container) return;

        let html = '<nav class="sidebar-nav">';
        sidebarData.forEach(function(section) {
            html += '<div class="sidebar-section">';
            html += '<div class="sidebar-section-title">' + section.title + '</div>';
            section.links.forEach(function(link) {
                const active = isActive(link.href) ? ' active' : '';
                const numSpan = link.num ? '<span class="sidebar-link-number">' + link.num + '</span>' : '';
                const iconPrefix = link.icon ? '&#128203; ' : '';
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
