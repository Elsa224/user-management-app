<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Traits\ApiResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use \App\Traits\ApiResponse;

    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::where('active', true)->count();
            $adminUsers = User::where('role', 'admin')->count();
            $recentUsers = User::where('created_at', '>=', Carbon::now()->subDays(7))->count();

            // Activity logs stats (if available)
            $recentActivities = 0;
            if (class_exists(ActivityLog::class)) {
                $recentActivities = ActivityLog::where('created_at', '>=', Carbon::now()->subDays(7))->count();
            }

            $stats = [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $totalUsers - $activeUsers,
                'admin_users' => $adminUsers,
                'regular_users' => $totalUsers - $adminUsers,
                'recent_users' => $recentUsers,
                'recent_activities' => $recentActivities,
                'growth_rate' => $this->calculateGrowthRate(),
            ];

            return $this->successResponse($stats, 'Dashboard stats retrieved successfully', );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve dashboard stats', null, 500);
        }
    }

    /**
     * Get recent users for dashboard
     */
    public function recentUsers(Request $request)
    {
        try {
            $limit = $request->get('limit', 5);

            $recentUsers = User::select('slug', 'name', 'email', 'role', 'active', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return $this->successResponse($recentUsers, 'Recent users retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve recent users', null, 500);
        }
    }

    /**
     * Get user activity chart data
     */
    public function userActivityChart(Request $request)
    {
        try {
            $days = $request->get('days', 7);
            $startDate = Carbon::now()->subDays($days);

            $data = [];
            for ($i = 0; $i < $days; $i++) {
                $date = Carbon::now()->subDays($days - 1 - $i);
                $count = User::whereDate('created_at', $date->toDateString())->count();

                $data[] = [
                    'date' => $date->format('Y-m-d'),
                    'label' => $date->format('M j'),
                    'users' => $count
                ];
            }

            return $this->successResponse($data, 'User activity chart data retrieved successfully', );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve chart data', null, 500);
        }
    }

    /**
     * Calculate user growth rate
     */
    private function calculateGrowthRate()
    {
        try {
            $thisWeek = User::where('created_at', '>=', Carbon::now()->startOfWeek())->count();
            $lastWeek = User::whereBetween('created_at', [
                Carbon::now()->subWeek()->startOfWeek(),
                Carbon::now()->subWeek()->endOfWeek()
            ])->count();

            if ($lastWeek == 0) {
                return $thisWeek > 0 ? 100 : 0;
            }

            return round((($thisWeek - $lastWeek) / $lastWeek) * 100, 2);
        } catch (\Exception $e) {
            return 0;
        }
    }
}