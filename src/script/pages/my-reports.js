// Dados das denúncias (simulação de API)
        const reportsData = {
            'report-1': {
                id: '#2025-001',
                title: 'Buraco na via principal da Rua das Flores',
                status: 'Em análise',
                statusClass: 'bg-yellow-500 text-yellow-900',
                region: 'Granja Vianna',
                date: '15/01/2025',
                user: 'João Silva',
                description: 'Há um grande buraco na via principal da Rua das Flores, próximo ao número 150. O buraco tem aproximadamente 1 metro de diâmetro e está causando transtornos para pedestres e veículos. A situação se agravou após as últimas chuvas e necessita reparo urgente para evitar acidentes.',
                address: 'Rua das Flores, 150',
                coordinates: '-23.5505, -46.6333',
                tags: ['OBRAS', 'ASFALTO'],
                tagClasses: ['bg-red-900 text-red-200', 'bg-blue-900 text-blue-200'],
                timeline: [
                    { event: 'Denúncia criada', date: '15/01/2025 às 14:30', status: 'completed' },
                    { event: 'Em análise pelo departamento de obras', date: '16/01/2025 às 09:15', status: 'current' },
                    { event: 'Aguardando próximas atualizações...', status: 'pending' }
                ]
            },
            'report-2': {
                id: '#2025-002',
                title: 'Lixo acumulado na praça central',
                status: 'Resolvido',
                statusClass: 'bg-green-500 text-green-900',
                region: 'Centro',
                date: '10/01/2025',
                user: 'Maria Santos',
                description: 'Grande acúmulo de lixo na praça central do bairro, causando mau cheiro e atraindo insetos. A situação está prejudicando o uso da praça pelos moradores e pode causar problemas de saúde pública.',
                address: 'Praça Central, s/n',
                coordinates: '-23.5489, -46.6388',
                tags: ['MEIO AMBIENTE', 'LIMPEZA'],
                tagClasses: ['bg-green-900 text-green-200', 'bg-gray-700 text-gray-200'],
                timeline: [
                    { event: 'Denúncia criada', date: '10/01/2025 às 10:15', status: 'completed' },
                    { event: 'Análise iniciada', date: '11/01/2025 às 08:30', status: 'completed' },
                    { event: 'Equipe de limpeza enviada', date: '12/01/2025 às 07:00', status: 'completed' },
                    { event: 'Problema resolvido', date: '12/01/2025 às 16:45', status: 'completed' }
                ]
            },
            'report-3': {
                id: '#2025-003',
                title: 'Semáforo com defeito na Av. Principal',
                status: 'Rejeitado',
                statusClass: 'bg-red-500 text-red-900',
                region: 'Panorama',
                date: '08/01/2025',
                user: 'Carlos Oliveira',
                description: 'Semáforo da Av. Principal não está funcionando corretamente, permanecendo sempre no amarelo. Isso está causando confusão no trânsito e pode ocasionar acidentes.',
                address: 'Av. Principal, 500',
                coordinates: '-23.5520, -46.6280',
                tags: ['TRÂNSITO', 'SINALIZAÇÃO'],
                tagClasses: ['bg-blue-900 text-blue-200', 'bg-purple-900 text-purple-200'],
                timeline: [
                    { event: 'Denúncia criada', date: '08/01/2025 às 16:20', status: 'completed' },
                    { event: 'Análise técnica realizada', date: '09/01/2025 às 11:30', status: 'completed' },
                    { event: 'Denúncia rejeitada - Problema já está sendo tratado por outro órgão', date: '10/01/2025 às 14:00', status: 'completed' }
                ]
            }
        };

        // Classe principal da aplicação
        class ReportsManager {
            constructor() {
                this.currentReport = 'report-1';
                this.filters = {
                    region: 'all',
                    department: 'all',
                    status: 'all'
                };
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.updateReportDetails(this.currentReport);
                this.setupMobileView();
            }

            setupEventListeners() {
                // Event listeners para itens da lista
                document.querySelectorAll('.report-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        this.selectReport(item.id);
                    });
                });

                // Event listeners para filtros
                document.querySelectorAll('select').forEach(select => {
                    select.addEventListener('change', (e) => {
                        this.updateFilters();
                    });
                });

                // Event listener para botão de filtrar
                document.querySelector('.bg-green-primary').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.applyFilters();
                });

                // Event listeners para botões de ação
                document.querySelectorAll('button').forEach(button => {
                    if (button.querySelector('svg[viewBox="0 0 24 24"]')) {
                        button.addEventListener('click', (e) => {
                            this.handleActionButton(e.target.closest('button'));
                        });
                    }
                });

                // Event listeners para navegação desktop
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        this.handleNavigation(e);
                    });
                });

                // Event listeners para campo de busca no header
                const headerSearchInput = document.querySelector('input[type="search"]');
                if (headerSearchInput) {
                    let searchTimeout;
                    headerSearchInput.addEventListener('input', (e) => {
                        clearTimeout(searchTimeout);
                        searchTimeout = setTimeout(() => {
                            this.searchReports(e.target.value);
                        }, 500);
                    });
                }

                // Event listeners para navegação mobile
                document.querySelectorAll('nav a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        this.handleNavigation(e);
                    });
                });

                // Responsive handling
                window.addEventListener('resize', () => {
                    this.handleResize();
                });
            }

            selectReport(reportId) {
                // Remove seleção anterior
                document.querySelectorAll('.report-item').forEach(item => {
                    item.classList.remove('active', 'border-green-primary');
                    item.classList.add('border-dark-border');
                });

                // Adiciona seleção atual
                const selectedItem = document.getElementById(reportId);
                selectedItem.classList.add('active', 'border-green-primary');
                selectedItem.classList.remove('border-dark-border');

                // Atualiza detalhes
                this.currentReport = reportId;
                this.updateReportDetails(reportId);

                // Anima transição
                this.animateSelection(selectedItem);
            }

            updateReportDetails(reportId) {
                const report = reportsData[reportId];
                if (!report) return;

                const detailsContainer = document.getElementById('report-details');
                
                detailsContainer.innerHTML = `
                    <div class="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 border-b border-dark-border">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-xl font-bold text-white mb-2">${report.title}</h2>
                                <div class="flex items-center space-x-4">
                                    <span class="${report.statusClass} px-3 py-1 rounded-full text-sm font-medium">
                                        ${report.status}
                                    </span>
                                    <span class="text-gray-text text-sm">ID: ${report.id}</span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" onclick="reportsManager.editReport('${reportId}')">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                    </svg>
                                </button>
                                <button class="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors" onclick="reportsManager.deleteReport('${reportId}')">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-6">
                        <div class="grid lg:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div class="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-family='sans-serif' font-size='16'%3EImagem da denúncia%3C/text%3E%3C/svg%3E" 
                                         alt="Imagem da denúncia" class="w-full h-full object-cover">
                                </div>
                                <div class="flex justify-between text-sm text-gray-text">
                                    <span>Enviado por: ${report.user}</span>
                                    <span>${report.date}</span>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-white mb-2">Descrição</h3>
                                    <p class="text-gray-300 leading-relaxed">${report.description}</p>
                                </div>
                                
                                <div class="flex flex-wrap gap-2">
                                    ${report.tags.map((tag, index) => 
                                        `<span class="${report.tagClasses[index]} px-3 py-1 rounded-lg text-sm">${tag}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-green-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                Localização
                            </h3>
                            <div class="grid lg:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <p class="text-white"><strong>Endereço:</strong> ${report.address}</p>
                                    <p class="text-white"><strong>Região:</strong> ${report.region}</p>
                                    <p class="text-gray-text"><strong>Coordenadas:</strong> ${report.coordinates}</p>
                                </div>
                                <div class="aspect-video bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer" onclick="reportsManager.openMap('${report.coordinates}')">
                                    <div class="text-center text-gray-400 hover:text-green-primary transition-colors">
                                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                        </svg>
                                        <p>Ver no mapa</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Histórico da Denúncia</h3>
                            <div class="space-y-4">
                                ${report.timeline.map(item => `
                                    <div class="flex items-start space-x-3">
                                        <div class="w-3 h-3 ${this.getTimelineColor(item.status)} rounded-full mt-2"></div>
                                        <div>
                                            <p class="text-white font-medium">${item.event}</p>
                                            ${item.date ? `<p class="text-gray-text text-sm">${item.date}</p>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }

            getTimelineColor(status) {
                switch(status) {
                    case 'completed': return 'bg-green-primary';
                    case 'current': return 'bg-yellow-primary';
                    case 'pending': return 'bg-gray-500';
                    default: return 'bg-gray-500';
                }
            }

            updateFilters() {
                const selects = document.querySelectorAll('select');
                this.filters.region = selects[0].value;
                this.filters.department = selects[1].value;
                this.filters.status = selects[2].value;
            }

            applyFilters() {
                this.showNotification('Filtros aplicados com sucesso!', 'success');
                
                // Simular filtragem (em uma aplicação real, faria requisição à API)
                const reports = document.querySelectorAll('.report-item');
                reports.forEach(report => {
                    // Lógica de filtragem seria implementada aqui
                    report.style.display = 'block';
                });
            }

            animateSelection(element) {
                element.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            }

            editReport(reportId) {
                this.showNotification('Funcionalidade de edição em desenvolvimento', 'info');
            }

            deleteReport(reportId) {
                if (confirm('Tem certeza que deseja excluir esta denúncia?')) {
                    this.showNotification('Denúncia excluída com sucesso!', 'success');
                    // Lógica de exclusão seria implementada aqui
                }
            }

            openMap(coordinates) {
                this.showNotification('Abrindo localização no mapa...', 'info');
                // Integração com Google Maps ou outro serviço seria implementada aqui
            }

            handleActionButton(button) {
                const svg = button.querySelector('svg');
                if (svg) {
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 100);
                }
            }

            handleNavigation(e) {
                e.preventDefault();
                const link = e.target.closest('a');
                const href = link.getAttribute('href');
                
                // Remove seleção anterior da navegação mobile
                document.querySelectorAll('nav a').forEach(l => {
                    l.classList.remove('text-green-primary');
                    l.classList.add('text-gray-text');
                });
                
                // Remove seleção anterior da navegação desktop
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('nav-link-active', 'bg-white/20', 'text-white');
                    l.classList.add('text-white/80');
                });
                
                // Simular navegação baseada no href
                switch(href) {
                    case '/dashboard':
                        this.showNotification('Redirecionando para Dashboard...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/dashboard';
                            console.log('Navegação para Dashboard');
                        }, 1000);
                        break;
                    case '/map':
                        this.showNotification('Redirecionando para Mapa...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/map';
                            console.log('Navegação para Mapa');
                        }, 1000);
                        break;
                    case '/create':
                        this.showNotification('Redirecionando para Nova Denúncia...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/create';
                            console.log('Navegação para Criar Denúncia');
                        }, 1000);
                        break;
                    case '/analytics':
                        this.showNotification('Redirecionando para Relatórios...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/analytics';
                            console.log('Navegação para Relatórios');
                        }, 1000);
                        break;
                    case '/notifications':
                        this.showNotification('Redirecionando para Notificações...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/notifications';
                            console.log('Navegação para Notificações');
                        }, 1000);
                        break;
                    case '/settings':
                        this.showNotification('Redirecionando para Configurações...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/settings';
                            console.log('Navegação para Configurações');
                        }, 1000);
                        break;
                    case '/help':
                        this.showNotification('Redirecionando para Ajuda...', 'info');
                        setTimeout(() => {
                            // window.location.href = '/help';
                            console.log('Navegação para Ajuda');
                        }, 1000);
                        break;
                    default:
                        // Para navegação mobile
                        if (link.closest('.lg\\:hidden')) {
                            link.classList.add('text-green-primary');
                            link.classList.remove('text-gray-text');
                        }
                        this.showNotification('Navegando...', 'info');
                }
            }

            setupMobileView() {
                if (window.innerWidth < 1024) {
                    document.querySelector('.lg\\:flex').classList.add('hidden');
                }
            }

            handleResize() {
                if (window.innerWidth >= 1024) {
                    document.querySelector('.lg\\:flex').classList.remove('hidden');
                } else {
                    document.querySelector('.lg\\:flex').classList.add('hidden');
                }
            }

            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                const colors = {
                    success: 'bg-green-600',
                    error: 'bg-red-600',
                    info: 'bg-blue-600',
                    warning: 'bg-yellow-600'
                };
                
                notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
                notification.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <span>${message}</span>
                        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.remove('translate-x-full');
                }, 100);
                
                setTimeout(() => {
                    notification.classList.add('translate-x-full');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }

            // Método para adicionar nova denúncia (simulação)
            addNewReport(reportData) {
                this.showNotification('Nova denúncia adicionada!', 'success');
                // Lógica para adicionar nova denúncia seria implementada aqui
            }

            // Método para buscar denúncias (simulação de API)
            async searchReports(query) {
                this.showNotification('Buscando...', 'info');
                
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Filtrar denúncias baseado na query
                const results = Object.values(reportsData).filter(report => 
                    report.title.toLowerCase().includes(query.toLowerCase()) ||
                    report.description.toLowerCase().includes(query.toLowerCase())
                );
                
                this.showNotification(`${results.length} resultado(s) encontrado(s)`, 'success');
                return results;
            }
        }

        // Inicializar aplicação
        let reportsManager;
        document.addEventListener('DOMContentLoaded', function() {
            reportsManager = new ReportsManager();
            
            // Adicionar funcionalidade de busca (se houver campo de busca)
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        reportsManager.searchReports(e.target.value);
                    }, 500);
                });
            }
        });

        });

        // Funcionalidades adicionais que estavam faltando
        
        // Método para inicializar gráficos e estatísticas
        initializeCharts() {
            this.updateStatistics();
            this.renderStatusChart();
            this.renderRegionChart();
        }

        // Atualizar estatísticas em tempo real
        updateStatistics() {
            const reports = Object.values(reportsData);
            const totalReports = reports.length;
            const resolvedReports = reports.filter(r => r.status === 'Resolvido').length;
            const pendingReports = reports.filter(r => r.status === 'Em análise').length;
            const rejectedReports = reports.filter(r => r.status === 'Rejeitado').length;

            // Atualizar elementos de estatística na sidebar (se existirem)
            const statsElements = {
                total: document.querySelector('[data-stat="total"]'),
                resolved: document.querySelector('[data-stat="resolved"]'),
                pending: document.querySelector('[data-stat="pending"]'),
                rejected: document.querySelector('[data-stat="rejected"]')
            };

            if (statsElements.total) statsElements.total.textContent = totalReports;
            if (statsElements.resolved) statsElements.resolved.textContent = resolvedReports;
            if (statsElements.pending) statsElements.pending.textContent = pendingReports;
            if (statsElements.rejected) statsElements.rejected.textContent = rejectedReports;

            // Calcular e atualizar taxa de resolução
            const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
            const rateElement = document.querySelector('[data-stat="rate"]');
            const rateBar = document.querySelector('[data-stat="rate-bar"]');
            
            if (rateElement) rateElement.textContent = `${resolutionRate}%`;
            if (rateBar) rateBar.style.width = `${resolutionRate}%`;
        }

        // Renderizar gráfico de status
        renderStatusChart() {
            const chartContainer = document.querySelector('#status-chart');
            if (!chartContainer) return;

            const reports = Object.values(reportsData);
            const statusCount = {
                'Em análise': reports.filter(r => r.status === 'Em análise').length,
                'Resolvido': reports.filter(r => r.status === 'Resolvido').length,
                'Rejeitado': reports.filter(r => r.status === 'Rejeitado').length
            };

            // Criar gráfico simples com CSS
            chartContainer.innerHTML = `
                <div class="space-y-3">
                    ${Object.entries(statusCount).map(([status, count]) => `
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-300">${status}</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div class="h-full ${this.getStatusColor(status)} transition-all duration-500" 
                                         style="width: ${(count / reports.length) * 100}%"></div>
                                </div>
                                <span class="text-sm font-semibold text-white w-6">${count}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Renderizar gráfico de regiões
        renderRegionChart() {
            const chartContainer = document.querySelector('#region-chart');
            if (!chartContainer) return;

            const reports = Object.values(reportsData);
            const regionCount = {};
            
            reports.forEach(report => {
                regionCount[report.region] = (regionCount[report.region] || 0) + 1;
            });

            chartContainer.innerHTML = `
                <div class="grid grid-cols-2 gap-2">
                    ${Object.entries(regionCount).map(([region, count]) => `
                        <div class="bg-gray-800 p-3 rounded-lg text-center">
                            <div class="text-lg font-bold text-green-primary">${count}</div>
                            <div class="text-xs text-gray-400">${region}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Obter cor baseada no status
        getStatusColor(status) {
            switch(status) {
                case 'Resolvido': return 'bg-green-primary';
                case 'Em análise': return 'bg-yellow-primary';
                case 'Rejeitado': return 'bg-red-primary';
                default: return 'bg-gray-500';
            }
        }

        // Exportar dados das denúncias
        exportReports(format = 'csv') {
            const reports = Object.values(reportsData);
            
            if (format === 'csv') {
                const csvData = this.convertToCSV(reports);
                this.downloadFile(csvData, 'denuncias.csv', 'text/csv');
            } else if (format === 'json') {
                const jsonData = JSON.stringify(reports, null, 2);
                this.downloadFile(jsonData, 'denuncias.json', 'application/json');
            }
            
            this.showNotification(`Dados exportados em formato ${format.toUpperCase()}`, 'success');
        }

        // Converter dados para CSV
        convertToCSV(data) {
            const headers = ['ID', 'Título', 'Status', 'Região', 'Data', 'Usuário'];
            const csvContent = [
                headers.join(','),
                ...data.map(report => [
                    report.id,
                    `"${report.title}"`,
                    report.status,
                    report.region,
                    report.date,
                    report.user
                ].join(','))
            ].join('\n');
            
            return csvContent;
        }

        // Download de arquivo
        downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.URL.revokeObjectURL(url);
        }

        // Filtrar denúncias por data
        filterByDateRange(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            const filteredReports = Object.values(reportsData).filter(report => {
                const reportDate = new Date(report.date.split('/').reverse().join('-'));
                return reportDate >= start && reportDate <= end;
            });
            
            this.displayFilteredReports(filteredReports);
            this.showNotification(`${filteredReports.length} denúncias encontradas no período`, 'info');
        }

        // Exibir denúncias filtradas
        displayFilteredReports(reports) {
            const reportsContainer = document.querySelector('.reports-list');
            if (!reportsContainer) return;

            // Esconder todos os reports primeiro
            document.querySelectorAll('.report-item').forEach(item => {
                item.style.display = 'none';
            });

            // Mostrar apenas os reports filtrados
            reports.forEach(report => {
                const reportId = Object.keys(reportsData).find(key => reportsData[key].id === report.id);
                const reportElement = document.getElementById(reportId);
                if (reportElement) {
                    reportElement.style.display = 'block';
                }
            });
        }

        // Resetar filtros
        resetFilters() {
            // Resetar selects
            document.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });

            // Resetar filtros internos
            this.filters = {
                region: 'all',
                department: 'all',
                status: 'all'
            };

            // Mostrar todos os reports
            document.querySelectorAll('.report-item').forEach(item => {
                item.style.display = 'block';
            });

            this.showNotification('Filtros resetados', 'info');
        }

        // Adicionar comentário a uma denúncia
        addComment(reportId, comment) {
            if (!reportsData[reportId]) return;

            const now = new Date();
            const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            // Adicionar comentário ao timeline
            reportsData[reportId].timeline.push({
                event: `Comentário adicionado: ${comment}`,
                date: formattedDate,
                status: 'completed'
            });

            // Atualizar exibição se for o report atual
            if (this.currentReport === reportId) {
                this.updateReportDetails(reportId);
            }

            this.showNotification('Comentário adicionado com sucesso', 'success');
        }

        // Alterar status de uma denúncia
        changeReportStatus(reportId, newStatus) {
            if (!reportsData[reportId]) return;

            const oldStatus = reportsData[reportId].status;
            reportsData[reportId].status = newStatus;

            // Atualizar classe do status
            const statusClasses = {
                'Em análise': 'bg-yellow-500 text-yellow-900',
                'Resolvido': 'bg-green-500 text-green-900',
                'Rejeitado': 'bg-red-500 text-red-900'
            };
            reportsData[reportId].statusClass = statusClasses[newStatus];

            // Adicionar ao timeline
            const now = new Date();
            const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            reportsData[reportId].timeline.push({
                event: `Status alterado de "${oldStatus}" para "${newStatus}"`,
                date: formattedDate,
                status: 'completed'
            });

            // Atualizar exibições
            this.updateReportDetails(reportId);
            this.updateStatistics();
            this.renderStatusChart();

            this.showNotification(`Status alterado para "${newStatus}"`, 'success');
        }

        // Método para imprimir detalhes da denúncia
        printReport(reportId) {
            const report = reportsData[reportId];
            if (!report) return;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Denúncia ${report.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
                        .section { margin-bottom: 20px; }
                        .timeline { border-left: 3px solid #10B981; padding-left: 15px; }
                        .timeline-item { margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${report.title}</h1>
                        <p><strong>ID:</strong> ${report.id} | <strong>Status:</strong> ${report.status}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Informações Gerais</h3>
                        <p><strong>Região:</strong> ${report.region}</p>
                        <p><strong>Data:</strong> ${report.date}</p>
                        <p><strong>Usuário:</strong> ${report.user}</p>
                        <p><strong>Endereço:</strong> ${report.address}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Descrição</h3>
                        <p>${report.description}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Histórico</h3>
                        <div class="timeline">
                            ${report.timeline.map(item => `
                                <div class="timeline-item">
                                    <strong>${item.event}</strong>
                                    ${item.date ? `<br><small>${item.date}</small>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.print();
        }

        // Método para configurar atalhos de teclado
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + F para focar na busca
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[type="search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }

                // Teclas de seta para navegar entre denúncias
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    const reports = Array.from(document.querySelectorAll('.report-item'));
                    const currentIndex = reports.findIndex(r => r.id === this.currentReport);
                    
                    let newIndex;
                    if (e.key === 'ArrowDown') {
                        newIndex = (currentIndex + 1) % reports.length;
                    } else {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : reports.length - 1;
                    }
                    
                    if (reports[newIndex]) {
                        this.selectReport(reports[newIndex].id);
                        reports[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }

                // Esc para resetar filtros
                if (e.key === 'Escape') {
                    this.resetFilters();
                }
            });
        }

        // Método para configurar drag and drop para ordenação
        setupDragAndDrop() {
            const reportsList = document.querySelector('.reports-list');
            if (!reportsList) return;

            let draggedElement = null;

            document.querySelectorAll('.report-item').forEach(item => {
                item.draggable = true;

                item.addEventListener('dragstart', (e) => {
                    draggedElement = item;
                    item.style.opacity = '0.5';
                });

                item.addEventListener('dragend', (e) => {
                    item.style.opacity = '1';
                    draggedElement = null;
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (draggedElement && draggedElement !== item) {
                        const rect = item.getBoundingClientRect();
                        const midpoint = rect.top + rect.height / 2;
                        
                        if (e.clientY < midpoint) {
                            item.parentNode.insertBefore(draggedElement, item);
                        } else {
                            item.parentNode.insertBefore(draggedElement, item.nextSibling);
                        }
                        
                        this.showNotification('Ordem das denúncias alterada', 'info');
                    }
                });
            });
        }

        // Método para configurar notificações push (simulado)
        setupPushNotifications() {
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            this.showNotification('Notificações ativadas', 'success');
                        }
                    });
                }
            }
        }

        // Simular nova denúncia chegando
        simulateNewReport() {
            const newReportId = `report-${Date.now()}`;
            const newReport = {
                id: `#2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                title: 'Nova denúncia simulada',
                status: 'Em análise',
                statusClass: 'bg-yellow-500 text-yellow-900',
                region: 'Centro',
                date: new Date().toLocaleDateString('pt-BR'),
                user: 'Usuário Teste',
                description: 'Esta é uma denúncia de teste criada automaticamente pelo sistema.',
                address: 'Endereço de Teste, 123',
                coordinates: '-23.5505, -46.6333',
                tags: ['TESTE'],
                tagClasses: ['bg-purple-900 text-purple-200'],
                timeline: [
                    { event: 'Denúncia criada', date: new Date().toLocaleString('pt-BR'), status: 'completed' },
                    { event: 'Em análise pelo departamento responsável', status: 'current' }
                ]
            };

            reportsData[newReportId] = newReport;
            this.updateStatistics();
            
            // Notificação push simulada
            if (Notification.permission === 'granted') {
                new Notification('Nova Denúncia', {
                    body: newReport.title,
                    icon: '/favicon.ico'
                });
            }
            
            this.showNotification('Nova denúncia recebida!', 'info');
        }

        // Método para inicializar todas as funcionalidades extras
        initializeAdvancedFeatures() {
            this.initializeCharts();
            this.setupKeyboardShortcuts();
            this.setupDragAndDrop();
            this.setupPushNotifications();
            
            // Simular nova denúncia a cada 30 segundos (para demonstração)
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% de chance
                    this.simulateNewReport();
                }
            }, 30000);
        }
    }

    // Extensão da inicialização
    document.addEventListener('DOMContentLoaded', function() {
        reportsManager = new ReportsManager();
        
        // Inicializar funcionalidades avançadas
        setTimeout(() => {
            reportsManager.initializeAdvancedFeatures();
        }, 1000);
        
        // Configurar botões de ação adicionais
        const exportBtn = document.querySelector('[data-action="export"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                reportsManager.exportReports('csv');
            });
        }

        const printBtn = document.querySelector('[data-action="print"]');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                reportsManager.printReport(reportsManager.currentReport);
            });
        }

        const resetFiltersBtn = document.querySelector('[data-action="reset-filters"]');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                reportsManager.resetFilters();
            });
        }

        // Configurar formulário de comentários (se existir)
        const commentForm = document.querySelector('#comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const commentInput = commentForm.querySelector('textarea');
                if (commentInput && commentInput.value.trim()) {
                    reportsManager.addComment(reportsManager.currentReport, commentInput.value.trim());
                    commentInput.value = '';
                }
            });
        }

        // Configurar seletor de status (se existir)
        const statusSelect = document.querySelector('#status-change');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    reportsManager.changeReportStatus(reportsManager.currentReport, e.target.value);
                }
            });
        }
    });
    