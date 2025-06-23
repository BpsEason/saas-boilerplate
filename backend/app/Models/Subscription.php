<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'starts_at',
        'ends_at',
        'status', // 例如: 'active', 'cancelled', 'expired'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    /**
     * 訂閱屬於某個用戶
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 訂閱屬於某個方案
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
