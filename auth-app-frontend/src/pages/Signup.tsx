import { useForm } from "react-hook-form";
import { registerUser } from "../auth/authService";

const Signup = () => {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data:any) => {
    await registerUser(data);
  };

  return (

    <div className="flex items-center justify-center min-h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-[400px]"
      >

        <input
          placeholder="Name"
          {...register("name")}
          className="border p-2 w-full"
        />

        <input
          placeholder="Email"
          {...register("email")}
          className="border p-2 w-full"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="border p-2 w-full"
        />

        <button className="bg-black text-white w-full p-2">
          Signup
        </button>

      </form>

    </div>
  );
};

export default Signup;