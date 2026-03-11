const ResetPassword = () => {

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="space-y-4 w-[350px]">

        <h2 className="text-xl font-bold">
          Reset Password
        </h2>

        <input
          placeholder="New Password"
          className="border p-2 w-full"
        />

        <button className="w-full bg-black text-white p-2">
          Reset Password
        </button>

      </div>

    </div>
  );
};

export default ResetPassword;