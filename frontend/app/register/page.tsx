import React from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const RegisterPage: React.FC = () => {
    return (
        <div className="max-w-md mx-auto p-8">
            <h1 className="text-center text-2xl font-bold mb-6">Create an account</h1>
            
            <div className="mb-6">
                <Button className="w-full bg-blue-500 text-white py-3 rounded-md mb-3 hover:bg-blue-600 transition">
                    Sign up with Google
                </Button>
                <Button className='w-full' variant="outline">Sign up with Apple</Button>
            </div>

            <div className="flex items-center justify-center mb-6">
                <div className="w-full border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">or</span>
                <div className="w-full border-t border-gray-300"></div>
            </div>

            <form>
                <div className="mb-4">
                    <Label htmlFor="email">Name</Label>
                    <Input type="text" placeholder="Name" className="mt-1 w-full" />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="E-mail" name="email" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-6">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" placeholder="Password" name="password" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition">
                    Sign up
                </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account? <a href="#" className="text-blue-500 hover:underline">Log in</a>
            </p>
        </div>
    );
};

export default RegisterPage;