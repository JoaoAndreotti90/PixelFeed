import { supabase } from "./supabaseClient";
import { uploadsUrl } from "../utils/config";
import { v4 as uuidv4 } from "uuid";

const uploadImage = async (bucket, file) => {
  const fileName = `${uuidv4()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return null;
  }

  return data.path;
};

const profile = async (tokenData) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", tokenData.user.id)
    .single();

  if (error) {
    return { errors: [error.message] };
  }

  if (data.profile_image) {
     data.profileImage = `${uploadsUrl}/profile_images/${data.profile_image}`;
  }

  return data;
};

const updateProfile = async (data, tokenData) => {
  let imagePath = null;

  if (data.profileImage) {
    imagePath = await uploadImage("profile_images", data.profileImage);
    if (!imagePath) {
      return { errors: ["Houve um erro no upload da imagem de perfil."] };
    }
  }

  const updateData = {
    name: data.name,
  };

  if (data.bio !== undefined) {
    updateData.bio = data.bio;
  }

  if (imagePath) {
    updateData.profile_image = imagePath;
  }

  const { data: updatedData, error: profileError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", tokenData.user.id)
    .select()
    .single();

  if (profileError) {
    return { errors: [profileError.message] };
  }

  if (data.password && data.password.trim() !== "") {
    if (data.password.length < 6) {
      return { errors: ["A senha deve ter pelo menos 6 caracteres."] };
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (passwordError) {
      return { errors: [`Erro ao atualizar senha: ${passwordError.message}`] };
    }
  }

  if (updatedData.profile_image) {
    updatedData.profileImage = `${uploadsUrl}/profile_images/${updatedData.profile_image}`;
  }

  return updatedData;
};

const getUserDetails = async (id) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) {
    return { errors: ["Usuário não encontrado."] };
  }

  if (data.profile_image) {
    data.profileImage = `${uploadsUrl}/profile_images/${data.profile_image}`;
  }

  return data;
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
};

export default userService;