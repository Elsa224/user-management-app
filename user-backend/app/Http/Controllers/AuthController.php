<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return $this->unauthorizedResponse('Invalid credentials');
        }

        $user = auth('api')->user();

        if (!$user->active) {
            auth('api')->logout();
            return $this->unauthorizedResponse('Account is inactive');
        }

        // Log successful login
        ActivityLog::createLog(
            $user->id,
            'user_login',
            null,
            null,
            ['email' => $user->email],
            $request
        );

        return $this->respondWithToken($token);
    }

    public function me()
    {
        return $this->successResponse(auth('api')->user(), 'User profile retrieved successfully');
    }

    public function logout()
    {
        $user = auth('api')->user();
        
        // Log logout activity
        if ($user) {
            ActivityLog::createLog(
                $user->id,
                'user_logout',
                null,
                null,
                ['email' => $user->email],
                request()
            );
        }
        
        auth('api')->logout();

        return $this->successResponse(null, 'Successfully logged out');
    }

    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    protected function respondWithToken($token)
    {
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()
        ];

        return $this->successResponse($data, 'User authenticated successfully');
    }

    /**
     * Change user password (requires current password)
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $user = auth('api')->user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password is incorrect', null, 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return $this->successResponse(null, 'Password changed successfully');
    }

    /**
     * Send password reset link to email
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        // Check if user exists and is active
        $user = User::where('email', $request->email)->where('active', true)->first();
        
        if (!$user) {
            return $this->errorResponse('No active user found with this email address', null, 404);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->successResponse(null, 'Password reset link sent to your email');
        }

        return $this->errorResponse('Unable to send password reset link', null, 500);
    }

    /**
     * Reset password using token
     */
    public function resetPasswordConfirm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->successResponse(null, 'Password reset successfully');
        }

        return $this->errorResponse('Invalid or expired reset token', null, 400);
    }
}
