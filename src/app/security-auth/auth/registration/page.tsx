"use client";

import { useState } from "react";
import { AuthErrors } from "../../enums/auth-errors.enum";
import { useToast } from "@/app/components/toast/toast.hook";
import { AuthMessages } from "../../enums/auth-messages.enum";
import { useSkipLocationRouter } from "@/contexts/router.context";
import { ICreateUserResult, IRegisterUser } from "../../models/register-user.model";
import { createUser } from "../auth";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useSkipLocationRouter();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registrationUser: IRegisterUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const userCreationResponse: ICreateUserResult = await createUser(
        registrationUser
      );

      if (!userCreationResponse.success) {
        setLoading(false);
        throw new Error(
          userCreationResponse.error || AuthErrors.REGISTER_FAILED
        );
      }

      showToast(AuthMessages.REGISTER_SUCCESS_NAVIGATE, "success");

      setTimeout(() => {
        handleNavigation("/login");
      }, 6000);
    } catch (error: unknown) {
      throw new Error(
        (!!error && error.toString()) || AuthErrors.UNEXPECTED_ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded border p-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded border p-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full rounded border p-2 text-gray-900"
            />

            <p className="text-xs text-gray-500 mt-1">
              Min 8 characters, with uppercase, lowercase, number, and special
              character
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mt-1 block w-full rounded border p-2 text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
