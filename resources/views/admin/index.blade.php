@extends('layouts.admin')

@section('title')
    Administration
@endsection

@section('content-header')
    <h1>Administrative Overview<small>A quick glance at your system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Index</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box
            @if($version->isLatestPanel())
                box-success
            @else
                box-danger
            @endif
        ">
            <div class="box-header with-border">
                <h3 class="box-title">System Information</h3>
            </div>
            <div class="box-body">
                @if ($version->isLatestPanel())
                    You are running JMF Hosting Theme <code>{{ config('app.fork-version') }}</code> based on Pterodactyl Panel version <code>{{ config('app.version') }}</code>. Your panel is up-to-date!
                @else
                    Your panel is <strong>not up-to-date!</strong> The latest version is <a href="https://github.com/JMF-Hosting/JMF-Hosting-Theme/releases/v{{ $version->getPanel() }}" target="_blank"><code>{{ $version->getPanel() }}</code></a> and you are currently running version <code>{{ config('app.version') }}</code>.
                @endif
            </div>
        </div>
    </div>
</div>

<!-- Statistics Graphs -->
<div class="row">
    <!-- CPU Usage -->
    <div class="col-md-4">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-microchip"></i> CPU Usage</h3>
            </div>
            <div class="box-body">
                <canvas id="cpuChart" height="200"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Memory Usage -->
    <div class="col-md-4">
        <div class="box box-success">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-memory"></i> Memory Usage</h3>
            </div>
            <div class="box-body">
                <canvas id="memoryChart" height="200"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Network Traffic -->
    <div class="col-md-4">
        <div class="box box-info">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-network-wired"></i> Network Traffic</h3>
            </div>
            <div class="box-body">
                <canvas id="networkChart" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="{{ $version->getDiscord() }}"><button class="btn btn-warning" style="width:100%;"><i class="fa fa-fw fa-support"></i> Get Help <small>(via Discord)</small></button></a>
    </div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="https://pterodactyl.io"><button class="btn btn-primary" style="width:100%;"><i class="fa fa-fw fa-link"></i> Documentation</button></a>
    </div>
    <div class="clearfix visible-xs-block">&nbsp;</div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="https://github.com/pterodactyl/panel"><button class="btn btn-primary" style="width:100%;"><i class="fa fa-fw fa-support"></i> Github</button></a>
    </div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="{{ $version->getDonations() }}"><button class="btn btn-success" style="width:100%;"><i class="fa fa-fw fa-money"></i> Support the Project</button></a>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        // Initialize Charts
        document.addEventListener('DOMContentLoaded', function() {
            // CPU Chart
            const cpuCtx = document.getElementById('cpuChart').getContext('2d');
            const cpuChart = new Chart(cpuCtx, {
                type: 'line',
                data: {
                    labels: Array(10).fill('').map((_, i) => `-${10-i}m`),
                    datasets: [{
                        label: 'CPU Usage',
                        data: Array(10).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
                        backgroundColor: 'rgba(49, 130, 206, 0.2)',
                        borderColor: '#3182ce',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
            
            // Memory Chart
            const memoryCtx = document.getElementById('memoryChart').getContext('2d');
            const memoryChart = new Chart(memoryCtx, {
                type: 'line',
                data: {
                    labels: Array(10).fill('').map((_, i) => `-${10-i}m`),
                    datasets: [{
                        label: 'Memory Usage',
                        data: Array(10).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
                        backgroundColor: 'rgba(72, 187, 120, 0.2)',
                        borderColor: '#48bb78',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
            
            // Network Chart
            const networkCtx = document.getElementById('networkChart').getContext('2d');
            const networkChart = new Chart(networkCtx, {
                type: 'bar',
                data: {
                    labels: Array(5).fill('').map((_, i) => `-${5-i}m`),
                    datasets: [
                        {
                            label: 'Download',
                            data: Array(5).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
                            backgroundColor: 'rgba(49, 130, 206, 0.7)',
                            borderColor: '#3182ce',
                            borderWidth: 1
                        },
                        {
                            label: 'Upload',
                            data: Array(5).fill(0).map(() => Math.floor(Math.random() * 40) + 5),
                            backgroundColor: 'rgba(72, 187, 120, 0.7)',
                            borderColor: '#48bb78',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + ' MB/s';
                                }
                            }
                        }
                    }
                }
            });
            
            // Update charts with new data every 30 seconds
            setInterval(() => {
                updateChart(cpuChart);
                updateChart(memoryChart);
                updateNetworkChart(networkChart);
            }, 30000);
            
            function updateChart(chart) {
                chart.data.datasets[0].data.shift();
                chart.data.datasets[0].data.push(Math.floor(Math.random() * 80) + 10);
                chart.update();
            }
            
            function updateNetworkChart(chart) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data.shift();
                    dataset.data.push(Math.floor(Math.random() * (dataset.label === 'Upload' ? 40 : 80)) + 5);
                });
                chart.update();
            }
        });
    </script>
@endsection
