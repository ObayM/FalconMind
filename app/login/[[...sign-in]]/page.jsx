import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {


  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign In</h1>
          <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;