"use server";

import { hash } from "bcryptjs";
import { findUserByEmail, insertUser } from "../database";
import { signIn } from "@/auth";

export const logInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
    const {email, password} = params;
    
    try {
        const result = await signIn('credentials', {email, password, redirect: false});

        if(result?.error) {
            return {success: false, error: result.error};
        }

        return {success: true};
    } catch(error) {
        console.log(error, 'Log in error')
        return {success: false, error: "Log in error"}
    }
}

export const signUp = async (params: AuthCredentials) => {
    const { firstName, lastName, email, password, } = params;

    if (findUserByEmail(email)) {
        return { success: false, error: "User with this email already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        insertUser({
            id: email,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });
        
        await logInWithCredentials({email, password});

        return {success: true};
    } catch(error) {
        console.log(error, 'Signup   error')
        return {success: false, error: "Sign up error"}
    }
}