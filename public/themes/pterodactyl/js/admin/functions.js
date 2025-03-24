// Copyright (c) 2015 - 2017 Dane Everitt <dane@daneeveritt.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
$.urlParam=function(name){var results=new RegExp("[\\?&]"+name+"=([^&#]*)").exec(decodeURIComponent(window.location.href));if(results==null){return null}else{return results[1]||0}};function getPageName(url){var index=url.lastIndexOf("/")+1;var filenameWithExtension=url.substr(index);var filename=filenameWithExtension.split(".")[0];return filename}
// Remeber Active Tab and Navigate to it on Reload
for(var queryParameters={},queryString=location.search.substring(1),re=/([^&=]+)=([^&]*)/g,m;m=re.exec(queryString);)queryParameters[decodeURIComponent(m[1])]=decodeURIComponent(m[2]);$("a[data-toggle='tab']").click(function(){queryParameters.tab=$(this).attr("href").substring(1),window.history.pushState(null,null,location.pathname+"?"+$.param(queryParameters))});
if($.urlParam('tab') != null){$('.nav.nav-tabs a[href="#' + $.urlParam('tab') + '"]').tab('show');}

// Sidebar toggle functionality
$(document).ready(function() {
    // Check if sidebar state is stored in local storage
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'minimized') {
        $('.main-sidebar').addClass('minimized');
    }

    // Toggle sidebar on button click
    $('#toggleSidebar').on('click', function(e) {
        e.preventDefault();
        $('.main-sidebar').toggleClass('minimized');
        
        // Save state to localStorage
        if ($('.main-sidebar').hasClass('minimized')) {
            localStorage.setItem('sidebarState', 'minimized');
        } else {
            localStorage.setItem('sidebarState', 'expanded');
        }
    });

    // Update resource stats periodically
    updateResourceStats();
    setInterval(updateResourceStats, 10000); // Update every 10 seconds
});

// Function to update resource stats
function updateResourceStats() {
    // In a real implementation, this would fetch data from the server
    // For now, we'll just simulate random values
    const cpuUsage = Math.floor(Math.random() * 80) + 10;
    const ramUsage = Math.floor(Math.random() * 70) + 20;
    
    $('.cpu-value').text(cpuUsage + '%');
    $('.cpu-bar').css('width', cpuUsage + '%');
    
    $('.ram-bar').css('width', ramUsage + '%');
}

// Show notification function from preview.html
function showNotification(type, title, message, duration = 5000) {
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colorMap = {
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#3182ce'
    };
    
    $.notify({
        icon: `fa ${iconMap[type] || 'fa-info-circle'}`,
        title: `<strong>${title}</strong>`,
        message: message
    }, {
        type: type,
        delay: duration,
        template: `
            <div data-notify="container" class="alert alert-{0}" role="alert">
                <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
                <span data-notify="icon"></span>
                <span data-notify="title">{1}</span>
                <span data-notify="message">{2}</span>
            </div>
        `,
        placement: {
            from: 'top',
            align: 'right'
        },
        z_index: 9999,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
}

// Server controls functionality
function toggleServer(action) {
    updateServerControls('processing');
    
    switch (action) {
        case 'start':
            showNotification('info', 'Starting Server', 'Initializing server startup...', 3000);
            addConsoleMessage('Starting server...', 'info');
            
            setTimeout(() => {
                try {
                    updateServerControls('online');
                    addConsoleMessage('Server started successfully!', 'success');
                    showNotification('success', 'Server Online', 'Server has been started successfully.', 5000);
                } catch (error) {
                    addConsoleMessage('Failed to start server: ' + error.message, 'error');
                    showNotification('error', 'Start Failed', 'Failed to start the server. Please try again.', 5000);
                    updateServerControls('offline');
                }
            }, 3000);
            break;
            
        case 'stop':
            if (confirm('Are you sure you want to stop the server?')) {
                showNotification('info', 'Stopping Server', 'Gracefully stopping server...', 3000);
                addConsoleMessage('Stopping server...', 'info');
                updateServerControls('stopping');
                
                setTimeout(() => {
                    try {
                        updateServerControls('offline');
                        addConsoleMessage('Server stopped gracefully.', 'success');
                        showNotification('success', 'Server Offline', 'Server has been stopped gracefully.', 5000);
                    } catch (error) {
                        addConsoleMessage('Failed to stop server: ' + error.message, 'error');
                        showNotification('error', 'Stop Failed', 'Failed to stop the server. Please try again.', 5000);
                    }
                }, 3000);
            }
            break;

        case 'restart':
            showNotification('info', 'Server Restarting', 'Initiating server restart...', 3000);
            addConsoleMessage('Restarting server...', 'info');
            updateServerControls('stopping');
            
            setTimeout(() => {
                try {
                    addConsoleMessage('Server stopped.', 'warning');
                    showNotification('warning', 'Server Stopped', 'Preparing for restart...', 3000);
                    
                    setTimeout(() => {
                        addConsoleMessage('Starting server...', 'info');
                        showNotification('info', 'Server Starting', 'Reinitializing server...', 3000);
                        
                        setTimeout(() => {
                            try {
                                updateServerControls('online');
                                addConsoleMessage('Server restarted successfully!', 'success');
                                showNotification('success', 'Restart Complete', 'Server has been restarted successfully!', 5000);
                            } catch (error) {
                                addConsoleMessage('Failed to complete restart: ' + error.message, 'error');
                                showNotification('error', 'Restart Failed', 'Failed to complete the restart. Please try again.', 5000);
                                updateServerControls('offline');
                            }
                        }, 3000);
                    }, 2000);
                } catch (error) {
                    addConsoleMessage('Failed to stop server for restart: ' + error.message, 'error');
                    showNotification('error', 'Restart Failed', 'Failed to stop the server for restart. Please try again.', 5000);
                }
            }, 3000);
            break;
    }
}

// Update server controls based on status
function updateServerControls(status) {
    const startBtn = $('#startBtn');
    const stopBtn = $('#stopBtn');
    const restartBtn = $('#restartBtn');
    const statusIndicator = $('#serverStatus');
    
    switch (status) {
        case 'online':
            statusIndicator.html('<span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span> Online');
            startBtn.prop('disabled', true);
            stopBtn.prop('disabled', false);
            restartBtn.prop('disabled', false);
            break;
            
        case 'offline':
            statusIndicator.html('<span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span> Offline');
            startBtn.prop('disabled', false);
            stopBtn.prop('disabled', true);
            restartBtn.prop('disabled', true);
            break;
            
        case 'stopping':
        case 'starting':
        case 'processing':
            const label = status.charAt(0).toUpperCase() + status.slice(1);
            statusIndicator.html(`<span class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span> ${label}...`);
            startBtn.prop('disabled', true);
            stopBtn.prop('disabled', true);
            restartBtn.prop('disabled', true);
            break;
    }
}

// Add message to console
function addConsoleMessage(message, type = 'info') {
    if (!$('.console-output').length) return;
    
    const colorMap = {
        info: 'text-blue-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    
    const typePrefix = {
        info: '[INFO]',
        success: '[SUCCESS]',
        warning: '[WARNING]',
        error: '[ERROR]'
    };
    
    const line = $(`<div class="console-line"><span class="${colorMap[type]}">${typePrefix[type]}</span> ${message}</div>`);
    $('.console-output').append(line);
    
    // Auto-scroll to bottom
    const consoleOutput = $('.console-output')[0];
    if (consoleOutput) {
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
}
