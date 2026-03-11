const ForgotPassword = () => {

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="space-y-4 w-[350px]">

        <h2 className="text-xl font-bold">
          Forgot Password
        </h2>

        <input
          placeholder="Enter email"
          className="border p-2 w-full"
        />

        <button className="w-full bg-black text-white p-2">
          Send Reset Link
        </button>

      </div>

    </div>
  );
};

export default ForgotPassword;