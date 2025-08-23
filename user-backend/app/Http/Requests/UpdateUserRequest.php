<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Always return true - let the controller handle authorization
        // This prevents the FormRequest from throwing a redirect exception in API routes
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'sometimes|required|string|max:255|min:2',
            'email' => 'sometimes|required|string|email|max:255',
            'role' => 'sometimes|in:admin,user',
            'active' => 'sometimes|boolean',
        ];

        // Only validate password if provided
        if ($this->has('password') && !empty($this->password)) {
            $rules['password'] = 'string|min:6|max:50';
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'name.max' => 'The name must not exceed 255 characters.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.min' => 'The password must be at least 6 characters.',
            'password.max' => 'The password must not exceed 50 characters.',
            'role.required' => 'The role field is required.',
            'role.in' => 'The selected role is invalid. Must be admin or user.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $currentUser = auth('api')->user();
            $userToUpdate = User::where('slug', $this->route('slug'))->first();

            // Prevent non-admin users from changing role/active fields
            if ($currentUser->role !== 'admin' && $userToUpdate && $currentUser->id === $userToUpdate->id) {
                if ($this->has('role') && $this->role !== $userToUpdate->role) {
                    $validator->errors()->add('role', 'You cannot change your own role.');
                }
                if ($this->has('active') && $this->active !== $userToUpdate->active) {
                    $validator->errors()->add('active', 'You cannot change your own active status.');
                }
            }
        });
    }
}
