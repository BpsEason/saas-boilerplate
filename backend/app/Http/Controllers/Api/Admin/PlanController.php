<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PlanStoreRequest;
use App\Http\Requests\Admin\PlanUpdateRequest;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * 獲取所有方案列表 (管理員)
     */
    public function index(Request $request)
    {
        $plans = Plan::latest()->paginate($request->input('per_page', 10));
        return PlanResource::collection($plans);
    }

    /**
     * 創建新方案 (管理員)
     */
    public function store(PlanStoreRequest $request)
    {
        $plan = Plan::create($request->validated());
        return response()->json([
            'message' => 'Plan created successfully',
            'plan' => new PlanResource($plan)
        ], 201);
    }

    /**
     * 顯示單個方案資料 (管理員)
     */
    public function show(Plan $plan)
    {
        return new PlanResource($plan);
    }

    /**
     * 更新方案資料 (管理員)
     */
    public function update(PlanUpdateRequest $request, Plan $plan)
    {
        $plan->update($request->validated());
        return response()->json([
            'message' => 'Plan updated successfully',
            'plan' => new PlanResource($plan)
        ]);
    }

    /**
     * 刪除方案 (管理員)
     */
    public function destroy(Plan $plan)
    {
        $plan->delete();
        return response()->json(['message' => 'Plan deleted successfully'], 204);
    }
}
