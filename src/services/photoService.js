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

const publishPhoto = async (photoData, tokenData) => {
  const imagePath = await uploadImage("photos", photoData.image);

  if (!imagePath) {
    return { errors: ["Houve um erro no upload da imagem."] };
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      title: photoData.title,
      image_url: imagePath,
      user_id: tokenData.user.id,
    })
    .select(
      `
      *,
      profiles ( name, profile_image ),
      likes ( user_id ) 
    `
    )
    .single();

  if (error) {
    return { errors: [error.message] };
  }

  const formattedData = {
    ...data,
    userName: data.profiles.name,
    image: `${uploadsUrl}/photos/${data.image_url}`,
    likes: data.likes || [],
  };
  delete formattedData.profiles;

  return formattedData;
};

const getPhotos = async () => {
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      profiles ( name, profile_image ),
      likes ( user_id )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { errors: [error.message] };
  }

  const formattedData = data.map((photo) => ({
    ...photo,
    userName: photo.profiles.name,
    image: `${uploadsUrl}/photos/${photo.image_url}`,
    likes: photo.likes || [],
  }));

  return formattedData;
};

const getPhoto = async (id) => {
  const idAsString = String(id); 
  
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      profiles ( name, profile_image ),
      comments ( *, profiles ( name, profile_image ) ),
      likes ( user_id )
    `
    )
    .eq("id", idAsString)
    .single();

  if (error) {
    return { errors: ["Foto não encontrada."] };
  }

  const formattedData = {
    ...data,
    userName: data.profiles.name,
    image: `${uploadsUrl}/photos/${data.image_url}`,
    likes: data.likes || [],
    comments:
      data.comments.map((comment) => ({
        ...comment,
        comment: comment.comment_text,
        userName: comment.profiles.name,
        userImage: comment.profiles.profile_image
          ? `${uploadsUrl}/profile_images/${comment.profiles.profile_image}`
          : null,
      })) || [],
  };

  return formattedData;
};

const deletePhoto = async (id, tokenData) => {
  const idAsString = String(id);

  const { data: photoData, error: getError } = await supabase
    .from("photos")
    .select("image_url, user_id")
    .eq("id", idAsString)
    .single();

  if (getError || !photoData) {
    return { errors: ["Foto não encontrada."] };
  }

  if (photoData.user_id !== tokenData.user.id) {
    return { errors: ["Operação não autorizada."] };
  }

  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .eq("id", idAsString);

  if (deleteError) {
    return { errors: [deleteError.message] };
  }

  const { error: storageError } = await supabase.rpc('delete_storage_object', {
      bucket_name: 'photos',
      object_name: photoData.image_url
  });
  
  if (storageError) {
      console.error("Erro ao deletar do storage:", storageError);
  }

  return { id: id, message: "Foto excluída com sucesso." };
};

const updatePhoto = async (data, id, tokenData) => {
  const idAsString = String(id);
  
  const { data: updatedData, error } = await supabase
    .from("photos")
    .update({ title: data.title })
    .eq("id", idAsString)
    .eq("user_id", tokenData.user.id)
    .select()
    .single();

  if (error) {
    return { errors: ["Houve um erro, tente novamente."] };
  }

  return { photo: updatedData, message: "Foto atualizada com sucesso." };
};

const like = async (id, tokenData) => {
  const { data, error } = await supabase.rpc('handle_like', {
    photo_id_param: id, 
  });

  if (error) {
    return { errors: [error.message] };
  }

  const liked = data[0].liked;
  
  return {
    photoId: id,
    userId: tokenData.user.id,
    type: liked ? "like" : "unlike",
  };
};

const comment = async (data, id, tokenData) => {
  const { data: commentData, error } = await supabase
    .from("comments")
    .insert({
      comment_text: data.comment,
      photo_id: id,
      user_id: tokenData.user.id,
    })
    .select(
      `
      *,
      profiles ( name, profile_image )
    `
    )
    .single();

  if (error) {
    return { errors: [error.message] };
  }

  const formattedComment = {
    comment: commentData.comment_text,
    userName: commentData.profiles.name,
    userId: commentData.user_id,
    userImage: commentData.profiles.profile_image
      ? `${uploadsUrl}/profile_images/${commentData.profiles.profile_image}`
      : null,
  };

  return {
    comment: formattedComment,
  };
};

const searchPhotos = async (query) => {
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      profiles ( name ),
      likes ( user_id )
    `
    )
    .ilike("title", `%${query}%`);

  if (error) {
    return { errors: [error.message] };
  }

  const formattedData = data.map((photo) => ({
    ...photo,
    userName: photo.profiles.name,
    image: `${uploadsUrl}/photos/${photo.image_url}`,
    likes: photo.likes || [],
  }));

  return formattedData;
};

const getUserPhotos = async (id) => {
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      profiles ( name ),
      likes ( user_id )
    `
    )
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return { errors: [error.message] };
  }

  const formattedData = data.map((photo) => ({
    ...photo,
    userName: photo.profiles.name,
    image: `${uploadsUrl}/photos/${photo.image_url}`,
    likes: photo.likes || [],
  }));

  return formattedData;
};

const photoService = {
  publishPhoto,
  getPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto,
  like,
  comment,
  searchPhotos,
  getUserPhotos,
};

export default photoService;