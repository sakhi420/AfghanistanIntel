// Archive page functionality

class ReportArchive {
    constructor() {
        this.reportsContainer = document.getElementById('reportsContainer');
        this.searchInput = document.getElementById('reportSearch');
        this.monthFilter = document.getElementById('monthFilter');
        this.cityFilter = document.getElementById('cityFilter');
        
        this.reports = [];
        this.filteredReports = [];
        
        this.init();
    }
    
    init() {
        this.loadReports();
        this.setupEventListeners();
        this.renderReports();
    }
    
    loadReports() {
        // Mock data - in a real application, this would come from an API
        this.reports = [
            {
                id: 1,
                title: 'Weekly Afghanistan Field Update - Kabul Focus',
                date: '2024-10-21',
                month: '2024-10',
                cities: ['kabul', 'mazar-e-sharif'],
                excerpt: 'Security situation stabilizes in Kabul with reduced checkpoint operations. Border delays at Torkham continue affecting logistics.',
                highlights: ['Kabul Security', 'Border Delays', 'Infrastructure']
            },
            {
                id: 2,
                title: 'Operational Constraints This Week',
                date: '2024-10-14',
                month: '2024-10',
                cities: ['herat', 'kandahar'],
                excerpt: 'New movement restrictions in Kandahar District 5. Internet restoration progress in Herat reaches 80% completion.',
                highlights: ['Movement Restrictions', 'Internet Status', 'Herat Update']
            },
            {
                id: 3,
                title: 'Border Status & Movement Risks Analysis',
                date: '2024-10-07',
                month: '2024-10',
                cities: ['all'],
                excerpt: 'Comprehensive analysis of all major border crossings with wait times and documentation requirements.',
                highlights: ['Border Crossings', 'Risk Assessment', 'Logistics']
            },
            {
                id: 4,
                title: 'Infrastructure Recovery Report',
                date: '2024-09-30',
                month: '2024-09',
                cities: ['kabul', 'herat', 'mazar-e-sharif'],
                excerpt: 'Power and banking services show significant improvement in major urban centers across Afghanistan.',
                highlights: ['Infrastructure', 'Power Grid', 'Banking Services']
            },
            {
                id: 5,
                title: 'Security Assessment: Northern Provinces',
                date: '2024-09-23',
                month: '2024-09',
                cities: ['mazar-e-sharif', 'kunduz'],
                excerpt: 'Detailed security assessment of northern provinces with movement recommendations for NGOs.',
                highlights: ['Security Assessment', 'NGO Operations', 'Northern Region']
            },
            {
                id: 6,
                title: 'Transportation Network Update',
                date: '2024-09-16',
                month: '2024-09',
                cities: ['kabul', 'jalalabad'],
                excerpt: 'Highway A1 closures impact supply chains. Alternative routes assessed and recommended.',
                highlights: ['Transportation', 'Supply Chain', 'Road Closures']
            }
        ];
        
        this.filteredReports = [...this.reports];
    }
    
    renderReports() {
        if (!this.reportsContainer) return;
        
        if (this.filteredReports.length === 0) {
            this.reportsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No reports found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        this.reportsContainer.innerHTML = this.filteredReports.map(report => `
            <div class="report-card" data-report-id="${report.id}">
                <div class="report-card-header">
                    <h3>${report.title}</h3>
                    <div class="report-date">${this.formatDate(report.date)}</div>
                </div>
                <div class="report-card-body">
                    <p class="report-excerpt">${report.excerpt}</p>
                    <div class="report-highlights">
                        <h4>Key Topics</h4>
                        <div class="highlight-tags">
                            ${report.highlights.map(highlight => 
                                `<span class="tag">${highlight}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="report-card-footer">
                    <span class="access-badge">
                        <i class="fas fa-lock"></i>
                        Full report available to subscribers
                    </span>
                    <button class="btn btn-secondary btn-small request-access" 
                            data-report-id="${report.id}">
                        Request Access
                    </button>
                </div>
            </div>
        `).join('');
        
        // Reattach event listeners for the new buttons
        this.attachReportEventListeners();
    }
    
    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterReports();
            });
        }
        
        if (this.monthFilter) {
            this.monthFilter.addEventListener('change', () => {
                this.filterReports();
            });
        }
        
        if (this.cityFilter) {
            this.cityFilter.addEventListener('change', () => {
                this.filterReports();
            });
        }
    }
    
    attachReportEventListeners() {
        // Request access buttons
        document.querySelectorAll('.request-access').forEach(button => {
            button.addEventListener('click', (e) => {
                const reportId = e.target.dataset.reportId;
                this.handleAccessRequest(reportId);
            });
        });
        
        // Report card clicks
        document.querySelectorAll('.report-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.request-access')) {
                    const reportId = e.currentTarget.dataset.reportId;
                    this.showReportPreview(reportId);
                }
            });
        });
    }
    
    filterReports() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        const selectedMonth = this.monthFilter ? this.monthFilter.value : '';
        const selectedCity = this.cityFilter ? this.cityFilter.value : '';
        
        this.filteredReports = this.reports.filter(report => {
            // Search term filter
            const matchesSearch = !searchTerm || 
                report.title.toLowerCase().includes(searchTerm) ||
                report.excerpt.toLowerCase().includes(searchTerm) ||
                report.highlights.some(h => h.toLowerCase().includes(searchTerm));
            
            // Month filter
            const matchesMonth = !selectedMonth || report.month === selectedMonth;
            
            // City filter
            const matchesCity = !selectedCity || 
                selectedCity === '' ||
                report.cities.includes(selectedCity) ||
                report.cities.includes('all');
            
            return matchesSearch && matchesMonth && matchesCity;
        });
        
        this.renderReports();
        this.updatePagination();
    }
    
    updatePagination() {
        // In a real application, this would handle pagination logic
        const paginationInfo = document.querySelector('.page-info');
        if (paginationInfo) {
            const totalReports = this.filteredReports.length;
            paginationInfo.textContent = `Showing ${Math.min(totalReports, 6)} of ${totalReports} reports`;
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    handleAccessRequest(reportId) {
        const report = this.reports.find(r => r.id == reportId);
        if (!report) return;
        
        // In a real application, this would redirect to contact form with report pre-filled
        const message = `I'm interested in accessing the report: "${report.title}"`;
        const encodedMessage = encodeURIComponent(message);
        
        window.location.href = `contact.html?message=${encodedMessage}&report=${reportId}`;
    }
    
    showReportPreview(reportId) {
        const report = this.reports.find(r => r.id == reportId);
        if (!report) return;
        
        // In a real application, this would show a modal with more details
        // For now, just log to console
        console.log('Report preview:', report);
        
        // Highlight the selected card
        document.querySelectorAll('.report-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`.report-card[data-report-id="${reportId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }
    
    // Method to load more reports (for pagination)
    loadMoreReports() {
        // In a real application, this would fetch the next page of reports
        console.log('Loading more reports...');
    }
}

// Initialize archive when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const archive = new ReportArchive();
    
    // Make archive available globally for debugging
    window.archive = archive;
    
    // Handle pagination buttons
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (prevBtn && !prevBtn.classList.contains('disabled')) {
        prevBtn.addEventListener('click', () => {
            console.log('Previous page');
            // Implement pagination logic
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            archive.loadMoreReports();
        });
    }
});

// Export for module usage
export { ReportArchive };