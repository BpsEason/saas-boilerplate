<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\PlanController as AdminPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| | is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 公開路由
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 受保護的路由 (需要認證)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']); // 獲取當前認證用戶資訊

    // 管理員專用路由
    Route::middleware('can:manage-users')->group(function () {
        Route::apiResource('admin/users', AdminUserController::class); // 管理員用戶管理
    });

    Route::middleware('can:manage-plans')->group(function () {
        Route::apiResource('admin/plans', AdminPlanController::class); // 管理員方案管理
    });

    // 這裡可以添加普通用戶的受保護路由
    // Route::get('/subscriptions', [SubscriptionController::class, 'index']);
});
