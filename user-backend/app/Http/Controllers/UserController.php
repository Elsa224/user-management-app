<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
    public function store(Request $request)
    {
        // Check if user is admin
        if (auth('api')->user()->role !== 'admin') {
            return $this->forbiddenResponse('Admin access required');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $user = User::create([
            'slug' => 'USR_' . uniqid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'active' => $request->get('active', true)
        ]);

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
    public function update(Request $request, string $slug)
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
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|in:admin,user',
            'active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $updateData = $request->only(['name', 'email', 'role', 'active']);

        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

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

        $user->delete();

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
}
