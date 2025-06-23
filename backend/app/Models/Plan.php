<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'features', // 儲存為 JSON 格式的功能列表
        'is_active',
    ];

    protected $casts = [
        'features' => 'array', // 將 features 欄位自動轉換為陣列
        'is_active' => 'boolean',
    ];

    /**
     * 一個方案可以有多個訂閱
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
