"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../auth";
import {
  ICreateUserResult,
  IRegisterUser,
} from "../../models/register-user.model";
import { AuthErrors } from "../../enums/auth-errors.enum";
import { useToast } from "@/app/components/toast/toast.hook";
import { AuthMessages } from "../../enums/auth-messages.enum";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

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

      showToast(AuthMessages.REGISTER_SUCCESS, "success");

      router.push("/home");
    } catch (error: unknown) {
      throw new Error(AuthErrors.UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
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
          className="mt-1 block w-full rounded border p-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Min 8 characters, with uppercase, lowercase, number, and special
          character
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="mt-1 block w-full rounded border p-2"
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
  );
}
