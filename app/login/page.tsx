import { signIn, signUp } from "@/app/auth/(lib)/actions";
import { GearIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signInAction = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { user, error } = await signIn({ email, password });

    if (error)
      return redirect("/login?message=Could not authenticate user");
    else if (!user)
      return redirect("/login?message=User not found");
    else
      return redirect("/configuration");
  };

  const signUpAction = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { user, error } = await signUp({ email, password });

    if (error)
      return redirect(`/login?message=${error.message}`);
    else
      return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col px-8 self-center justify-center items-center gap-2">
      <div className="flex items-center mb-16">
        <GearIcon className="w-12 h-12 mr-4"/>
        <h1 className="text-4xl font-bold">Supaconfig</h1>
      </div>
      <form
        className="animate-in flex flex-col w-full justify-center gap-2 text-foreground"
        action={signInAction}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Sign In
        </button>
        <button
          formAction={signUpAction}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign Up
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
