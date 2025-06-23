<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // 定義一個 'manage-users' 的 Gate，只有管理員可以執行
        Gate::define('manage-users', function (User $user) {
            return $user->isAdmin();
        });

        // 定義一個 'manage-plans' 的 Gate，只有管理員可以執行
        Gate::define('manage-plans', function (User $user) {
            return $user->isAdmin();
        });
    }
}
