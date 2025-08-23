<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'slug',
        'user_id',
        'action',
        'target_type',
        'target_slug',
        'changes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = 'LOG_' . uniqid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Helper method to create activity logs
    public static function createLog(
        $userId,
        $action,
        $targetType = null,
        $targetSlug = null,
        $changes = null,
        $request = null
    ) {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'target_type' => $targetType,
            'target_slug' => $targetSlug,
            'changes' => $changes,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
        ]);
    }
}
