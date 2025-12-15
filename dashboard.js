// Dashboard functionality for Afghanistan Field Intelligence

class OperationalDashboard {
    constructor() {
        this.dashboardElement = document.getElementById('operationalDashboard');
        this.cityData = null;
        this.borderData = null;
        this.infrastructureData = null;
        
        this.init();
    }
    
    init() {
        if (this.dashboardElement) {
            this.loadData();
            this.renderDashboard();
            this.setupEventListeners();
        }
    }
    
    async loadData() {
        // In a real application, this would fetch from your API
        // For now, we'll use mock data
        
        this.cityData = [
            { id: 1, name: 'Kabul', status: 'safe', movement: 'Normal', constraint: 'Increased checkpoints in diplomatic zone' },
            { id: 2, name: 'Herat', status: 'warning', movement: 'Restricted', constraint: 'Evening curfew (8 PM - 5 AM)' },
            { id: 3, name: 'Kandahar', status: 'danger', movement: 'Highly Restricted', constraint: 'District 5 closed to non-residents' },
            { id: 4, name: 'Mazar-e-Sharif', status: 'safe', movement: 'Normal', constraint: 'No major restrictions' },
            { id: 5, name: 'Jalalabad', status: 'warning', movement: 'Moderate', constraint: 'Road closures on Highway A1' },
            { id: 6, name: 'Kunduz', status: 'danger', movement: 'Restricted', constraint: 'Unstable security situation' }
        ];
        
        this.borderData = [
            { id: 1, name: 'Torkham (Pakistan)', status: 'restricted', waitTime: '48+ hours', delayReason: 'New document verification' },
            { id: 2, name: 'Islam Qala (Iran)', status: 'open', waitTime: '2-4 hours', delayReason: 'Normal operations' },
            { id: 3, name: 'Hairatan (Uzbekistan)', status: 'restricted', waitTime: 'N/A', delayReason: 'Passenger crossing closed' },
            { id: 4, name: 'Spin Boldak (Pakistan)', status: 'open', waitTime: '6-8 hours', delayReason: 'Increased security checks' }
        ];
        
        this.infrastructureData = [
            { id: 1, type: 'internet', status: 'partial', coverage: 65, details: 'Restored in major cities, intermittent in provinces' },
            { id: 2, type: 'power', status: 'operational', coverage: 80, details: 'Stable in urban centers, outages in rural areas' },
            { id: 3, type: 'banking', status: 'disrupted', coverage: 40, details: 'Limited hours (8 AM - 12 PM only)' },
            { id: 4, type: 'mobile', status: 'operational', coverage: 75, details: 'Main carriers functional, some coverage gaps' }
        ];
    }
    
    renderDashboard() {
        const html = `
            <div class="dashboard-header">
                <h2>Afghanistan Operational Brief Dashboard</h2>
                <p class="dashboard-subtitle">Live status updates - Updated: ${this.getCurrentTimestamp()}</p>
            </div>
            
            <div class="dashboard-content">
                <div class="status-overview">
                    <div class="overview-card">
                        <h3>Secure Cities</h3>
                        <div class="overview-value">${this.getSafeCityCount()}</div>
                        <div class="overview-change positive">+2 from last week</div>
                    </div>
                    <div class="overview-card">
                        <h3>Open Borders</h3>
                        <div class="overview-value">${this.getOpenBorderCount()}</div>
                        <div class="overview-change negative">-1 from last week</div>
                    </div>
                    <div class="overview-card">
                        <h3>Infrastructure Status</h3>
                        <div class="overview-value">${this.getInfrastructureScore()}%</div>
                        <div class="overview-change positive">+5% from last week</div>
                    </div>
                    <div class="overview-card">
                        <h3>Report Currency</h3>
                        <div class="overview-value">${this.getHoursSinceUpdate()}</div>
                        <div class="overview-change">hours ago</div>
                    </div>
                </div>
                
                <div class="city-status-container">
                    <div class="city-status-header">
                        <h3>City Security Status</h3>
                        <div class="legend">
                            <div class="legend-item">
                                <div class="legend-color safe"></div>
                                <span>Operational</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color warning"></div>
                                <span>Restricted</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color danger"></div>
                                <span>High Risk</span>
                            </div>
                        </div>
                    </div>
                    <div class="city-grid">
                        ${this.renderCityCards()}
                    </div>
                </div>
                
                <div class="border-status-container">
                    <h3>Border Crossing Status</h3>
                    <table class="border-table">
                        <thead>
                            <tr>
                                <th>Border Crossing</th>
                                <th>Status</th>
                                <th>Wait Time</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderBorderRows()}
                        </tbody>
                    </table>
                </div>
                
                <div class="infrastructure-container">
                    <h3>Infrastructure Status</h3>
                    <div class="infrastructure-grid">
                        ${this.renderInfrastructureCards()}
                    </div>
                </div>
            </div>
            
            <div class="dashboard-footer">
                <div class="update-info">
                    <i class="fas fa-sync"></i>
                    <span>Next update: ${this.getNextUpdateTime()}</span>
                </div>
                <div class="subscriber-note">
                    <a href="sample-report.html">View full weekly report for detailed analysis →</a>
                </div>
            </div>
        `;
        
        this.dashboardElement.innerHTML = html;
    }
    
    renderCityCards() {
        return this.cityData.map(city => `
            <div class="city-card ${city.status}" data-city-id="${city.id}">
                <div class="city-name">${city.name}</div>
                <div class="city-status ${city.status}">
                    ${this.getStatusIcon(city.status)} ${this.getStatusText(city.status)}
                </div>
                <div class="city-movement">${city.movement}</div>
            </div>
        `).join('');
    }
    
    renderBorderRows() {
        return this.borderData.map(border => `
            <tr>
                <td><strong>${border.name}</strong></td>
                <td>
                    <div class="border-status-cell">
                        <div class="status-icon ${border.status}">
                            ${this.getBorderStatusIcon(border.status)}
                        </div>
                        <span>${this.getBorderStatusText(border.status)}</span>
                    </div>
                </td>
                <td class="wait-time ${this.getWaitTimeClass(border.waitTime)}">
                    ${border.waitTime}
                </td>
                <td>${border.delayReason}</td>
            </tr>
        `).join('');
    }
    
    renderInfrastructureCards() {
        return this.infrastructureData.map(infra => `
            <div class="infrastructure-card">
                <div class="infrastructure-header">
                    <i class="fas fa-${this.getInfrastructureIcon(infra.type)}"></i>
                    <h3>${this.capitalizeFirstLetter(infra.type)}</h3>
                </div>
                <div class="infrastructure-status">
                    <span class="status-label">Status:</span>
                    <span class="status-value ${infra.status}">
                        ${this.getInfrastructureStatusText(infra.status)}
                    </span>
                </div>
                <div class="status-label">Coverage: ${infra.coverage}%</div>
                <div class="progress-bar">
                    <div class="progress-fill ${this.getCoverageClass(infra.coverage)}" 
                         style="width: ${infra.coverage}%"></div>
                </div>
                <p class="infrastructure-details">${infra.details}</p>
            </div>
        `).join('');
    }
    
    // Helper methods
    getCurrentTimestamp() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    getSafeCityCount() {
        return this.cityData.filter(city => city.status === 'safe').length;
    }
    
    getOpenBorderCount() {
        return this.borderData.filter(border => border.status === 'open').length;
    }
    
    getInfrastructureScore() {
        const total = this.infrastructureData.reduce((sum, infra) => sum + infra.coverage, 0);
        return Math.round(total / this.infrastructureData.length);
    }
    
    getHoursSinceUpdate() {
        // Mock data - in real app, calculate from actual update time
        return 3;
    }
    
    getNextUpdateTime() {
        const now = new Date();
        const nextUpdate = new Date(now);
        nextUpdate.setHours(now.getHours() + 6);
        return nextUpdate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    getStatusIcon(status) {
        const icons = {
            safe: '✓',
            warning: '!',
            danger: '✗'
        };
        return icons[status] || '?';
    }
    
    getStatusText(status) {
        const texts = {
            safe: 'Operational',
            warning: 'Restricted',
            danger: 'High Risk'
        };
        return texts[status] || 'Unknown';
    }
    
    getBorderStatusIcon(status) {
        const icons = {
            open: '✓',
            restricted: '!',
            closed: '✗'
        };
        return icons[status] || '?';
    }
    
    getBorderStatusText(status) {
        const texts = {
            open: 'Open',
            restricted: 'Restricted',
            closed: 'Closed'
        };
        return texts[status] || 'Unknown';
    }
    
    getWaitTimeClass(waitTime) {
        if (waitTime.includes('+') || waitTime.includes('48')) return 'high';
        if (waitTime.includes('6-8')) return 'medium';
        return 'low';
    }
    
    getInfrastructureIcon(type) {
        const icons = {
            internet: 'wifi',
            power: 'bolt',
            banking: 'university',
            mobile: 'mobile-alt'
        };
        return icons[type] || 'cog';
    }
    
    getInfrastructureStatusText(status) {
        const texts = {
            operational: 'Operational',
            partial: 'Partial',
            disrupted: 'Disrupted'
        };
        return texts[status] || 'Unknown';
    }
    
    getCoverageClass(coverage) {
        if (coverage >= 80) return 'high';
        if (coverage >= 50) return 'medium';
        return 'low';
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    setupEventListeners() {
        // City card click events
        setTimeout(() => {
            document.querySelectorAll('.city-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const cityId = e.currentTarget.dataset.cityId;
                    this.showCityDetails(cityId);
                });
            });
        }, 100);
    }
    
    showCityDetails(cityId) {
        const city = this.cityData.find(c => c.id == cityId);
        if (!city) return;
        
        // In a real application, this would show a modal with detailed information
        console.log(`Showing details for ${city.name}:`, city);
        
        // For now, just highlight the card
        document.querySelectorAll('.city-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`.city-card[data-city-id="${cityId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            selectedCard.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                selectedCard.style.transform = '';
            }, 300);
        }
    }
    
    // Method to refresh dashboard data
    refreshData() {
        this.loadData().then(() => {
            this.renderDashboard();
            this.setupEventListeners();
            
            // Show refresh notification
            this.showNotification('Dashboard updated with latest data', 'success');
        });
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        this.dashboardElement.parentNode.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new OperationalDashboard();
    
    // Make dashboard available globally for debugging
    window.dashboard = dashboard;
    
    // Auto-refresh every 5 minutes (300000 ms)
    // setInterval(() => dashboard.refreshData(), 300000);
});

// Export for module usage
export { OperationalDashboard };