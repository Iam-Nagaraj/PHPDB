<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SocialLoginRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		$request = [
			'name' => 'required',
			'email' => 'required|email:rfc,dns|unique:users,email',
			'password' => 'nullable',
			'provider_id' => 'required',
			'type' => 'required',
		];
		return $request;
	}
}
