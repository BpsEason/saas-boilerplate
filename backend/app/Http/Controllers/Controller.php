<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="SaaS Boilerplate API 文件",
 * description="這是 SaaS Boilerplate 專案的 API 文件。",
 * @OA\Contact(
 * email="support@example.com"
 * )
 * )
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="API Server"
 * )
 * @OA\SecurityScheme(
 * type="http",
 * description="透過 Bearer Token 進行身份驗證",
 * name="Bearer Authentication",
 * in="header",
 * scheme="bearer",
 * bearerFormat="JWT",
 * securityScheme="bearerAuth",
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
