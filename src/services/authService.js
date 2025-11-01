import { supabase } from "./supabaseClient";

const register = async (data) => {
  const { error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (authError) {
    return { errors: [authError.message] };
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (sessionError) {
    return { errors: [sessionError.message] };
  }

  localStorage.setItem("user", JSON.stringify(sessionData));
  return sessionData;
};

const logout = () => {
  localStorage.removeItem("user");
  supabase.auth.signOut();
};

const login = async (data) => {
  const { data: sessionData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { errors: [error.message] };
  }

  localStorage.setItem("user", JSON.stringify(sessionData));
  return sessionData;
};

const authService = {
  register,
  logout,
  login,
};

export default authService;