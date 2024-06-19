import "next-auth";



declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session{
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'] // default session ke andar ek key hogi "user" ab iske key ke andar values ayegi ya nahi depends
    }
}

declare module 'next-auth/jwt'
{
    interface JWT
    {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}