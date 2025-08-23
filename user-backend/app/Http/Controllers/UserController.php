<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource with search and pagination.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->successResponse($users, 'Users retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Check if user is admin
        if (!auth('api')->check() || auth('api')->user()->role !== 'admin') {
            return $this->forbiddenResponse('Only administrators can create new users');
        }

        $user = User::create([
            'slug' => 'USR_' . uniqid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'active' => $request->get('active', true)
        ]);

        // Log the activity
        ActivityLog::createLog(
            auth('api')->id(),
            'created_user',
            'User',
            $user->slug,
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'active' => $user->active
            ],
            $request
        );

        return $this->successResponse($user, 'User created successfully', 201);
    }

    /**
     * Display the specified resource by slug.
     */
    public function show(string $slug)
    {
        $user = User::where('slug', $slug)->first();

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        return $this->successResponse($user, 'User retrieved successfully');
    }

    /**
     * Update the specified resource in storage by slug.
     */
    public function update(UpdateUserRequest $request, string $slug)
    {
        $currentUser = auth('api')->user();
        $user = User::where('slug', $slug)->first();

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        // Check authorization: admin can update any user, user can only update themselves
        if (!$currentUser || ($currentUser->role !== 'admin' && $currentUser->id !== $user->id)) {
            return $this->forbiddenResponse('You do not have permission to update this user');
        }

        // Additional validation for email uniqueness
        if ($request->has('email') && $request->email !== $user->email) {
            $existingUser = User::where('email', $request->email)->where('id', '!=', $user->id)->first();
            if ($existingUser) {
                return $this->validationErrorResponse(['email' => ['The email has already been taken.']], 'Validation failed');
            }
        }

        // Store original values for logging
        $originalData = $user->only(['name', 'email', 'role', 'active']);

        $updateData = $request->only(['name', 'email']);

        // Only admin can update role and active status
        if ($currentUser->role === 'admin') {
            if ($request->has('role')) {
                $updateData['role'] = $request->role;
            }
            if ($request->has('active')) {
                $updateData['active'] = $request->active;
            }
        }

        if ($request->has('password') && !empty($request->password)) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Log the activity with changes
        $changes = [];
        foreach (['name', 'email', 'role', 'active'] as $field) {
            if (isset($updateData[$field]) && $originalData[$field] !== $updateData[$field]) {
                $changes[$field] = [
                    'from' => $originalData[$field],
                    'to' => $updateData[$field]
                ];
            }
        }

        if ($request->has('password') && !empty($request->password)) {
            $changes['password'] = ['changed' => true];
        }

        if (!empty($changes)) {
            ActivityLog::createLog(
                $currentUser->id,
                'updated_user',
                'User',
                $user->slug,
                $changes,
                $request
            );
        }

        return $this->successResponse($user, 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage by slug.
     */
    public function destroy(string $slug)
    {
        // Check if user is admin
        if (auth('api')->user()->role !== 'admin') {
            return $this->forbiddenResponse('Admin access required');
        }

        $user = User::where('slug', $slug)->first();

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        // Prevent admin from deleting themselves
        if ($user->id === auth('api')->user()->id) {
            return $this->forbiddenResponse('Cannot delete your own account');
        }

        // Store user data for logging before deletion
        $userData = [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'active' => $user->active
        ];

        $user->delete();

        // Log the activity
        ActivityLog::createLog(
            auth('api')->id(),
            'deleted_user',
            'User',
            $slug,
            $userData,
            request()
        );

        return $this->successResponse(null, 'User deleted successfully');
    }

    /**
     * Update user status (active/inactive) by slug.
     */
    public function changeStatus(Request $request, string $slug)
    {
        // Check if user is admin
        if (auth('api')->user()->role !== 'admin') {
            return $this->forbiddenResponse('Admin access required');
        }

        $user = User::where('slug', $slug)->first();

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        $validator = Validator::make($request->all(), [
            'active' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        // Prevent admin from deactivating themselves
        if ($user->id === auth('api')->user()->id && !$request->active) {
            return $this->forbiddenResponse('Cannot deactivate your own account');
        }

        $user->update([
            'active' => $request->active
        ]);

        $message = $request->active ? 'User activated successfully' : 'User deactivated successfully';

        return $this->successResponse($user, $message);
    }

    /**
     * Upload profile photo for current user
     */
    public function uploadProfilePhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,webp,jpg,gif|max:2048' // 2MB max
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $user = auth('api')->user();

            // Delete old photo if exists
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            // Store the new photo
            $file = $request->file('photo');
            $filename = 'profile_photos/' . $user->slug . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('', $filename, 'public');

            // Update user profile photo path
            $user->update([
                'profile_photo' => $path
            ]);

            // Log the activity
            ActivityLog::createLog(
                $user->id,
                'updated_profile_photo',
                'User',
                $user->slug,
                ['profile_photo' => 'updated'],
                $request
            );

            return $this->successResponse([
                'profile_photo' => $path,
                'profile_photo_url' => asset('storage/' . $path)
            ], 'Profile photo uploaded successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to upload profile photo', null, 500);
        }
    }

    /**
     * Delete profile photo for current user
     */
    public function deleteProfilePhoto(Request $request)
    {
        try {
            $user = auth('api')->user();

            if (!$user->profile_photo) {
                return $this->errorResponse('No profile photo found', null, 404);
            }

            // Delete the photo file
            Storage::disk('public')->delete($user->profile_photo);

            // Update user profile photo path
            $user->update([
                'profile_photo' => null
            ]);

            // Log the activity
            ActivityLog::createLog(
                $user->id,
                'deleted_profile_photo',
                'User',
                $user->slug,
                ['profile_photo' => 'deleted'],
                $request
            );

            return $this->successResponse(null, 'Profile photo deleted successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete profile photo', null, 500);
        }
    }

    /**
     * Get user profile with photo URL
     */
    public function profile()
    {
        try {
            $user = auth('api')->user();

            $userData = $user->toArray();

            if ($user->profile_photo) {
                $userData['profile_photo_url'] = asset('storage/' . $user->profile_photo);
            } else {
                $userData['profile_photo_url'] = null;
            }

            return $this->successResponse($userData, 'Profile retrieved successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve profile', null, 500);
        }
    }
}
