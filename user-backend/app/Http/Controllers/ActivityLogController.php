<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of activity logs with pagination and filters.
     */
    public function index(Request $request)
    {
        // Only admins can view activity logs
        if (!auth('api')->check() || auth('api')->user()->role !== 'admin') {
            return $this->forbiddenResponse('Admin access required');
        }

        $query = ActivityLog::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by user if specified
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action if specified
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        // Filter by date range if specified
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->get('per_page', 15);
        $logs = $query->paginate($perPage);

        return $this->successResponse($logs, 'Activity logs retrieved successfully');
    }

    /**
     * Display activity logs for the current user.
     */
    public function myLogs(Request $request)
    {
        $query = ActivityLog::where('user_id', auth('api')->id())
            ->orderBy('created_at', 'desc');

        // Filter by action if specified
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        $perPage = $request->get('per_page', 15);
        $logs = $query->paginate($perPage);

        return $this->successResponse($logs, 'Your activity logs retrieved successfully');
    }
}
