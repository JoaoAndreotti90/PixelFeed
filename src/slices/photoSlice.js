import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

const getToken = (thunkAPI) => {
  return thunkAPI.getState().auth.user;
};

export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const tokenData = getToken(thunkAPI);
    const data = await photoService.publishPhoto(photo, tokenData);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    if (!id || id === "undefined") {
      return thunkAPI.rejectWithValue("ID de usuário inválido.");
    }

    const data = await photoService.getUserPhotos(id);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getPhoto = createAsyncThunk(
  "photo/getphoto",
  async (id, thunkAPI) => {
    const data = await photoService.getPhoto(id);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const tokenData = getToken(thunkAPI);
    const data = await photoService.deletePhoto(id, tokenData);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const tokenData = getToken(thunkAPI);
    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      tokenData
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const like = createAsyncThunk("photo/like", async (id, thunkAPI) => {
  const tokenData = getToken(thunkAPI);
  const data = await photoService.like(id, tokenData);

  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

export const comment = createAsyncThunk(
  "photo/comment",
  async (photoData, thunkAPI) => {
    const tokenData = getToken(thunkAPI);
    const data = await photoService.comment(
      { comment: photoData.comment },
      photoData.id,
      tokenData
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getPhotos = createAsyncThunk(
  "photo/getall",
  async (_, thunkAPI) => {
    const data = await photoService.getPhotos();

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const data = await photoService.searchPhotos(query);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    resetPhotos: (state) => {
      state.photos = [];
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(getUserPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photos = [];
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(getPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo.id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const photoToUpdate = state.photos.find(
          (photo) => photo.id === action.payload.photo.id
        );
        if (photoToUpdate) {
          photoToUpdate.title = action.payload.photo.title;
        }

        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const { photoId, userId, type } = action.payload;

        if (state.photo.id === photoId) {
          if (!state.photo.likes) state.photo.likes = [];
          if (type === "like") {
            state.photo.likes.push({ user_id: userId });
          } else {
            state.photo.likes = state.photo.likes.filter(
              (like) => like.user_id !== userId
            );
          }
        }

        const photoInList = state.photos.find((photo) => photo.id === photoId);
        if (photoInList) {
          if (!photoInList.likes) photoInList.likes = [];
          if (type === "like") {
            photoInList.likes.push({ user_id: userId });
          } else {
            photoInList.likes = photoInList.likes.filter(
              (like) => like.user_id !== userId
            );
          }
        }
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        if (!state.photo.comments) state.photo.comments = [];
        state.photo.comments.push(action.payload.comment);
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage, resetPhotos } = photoSlice.actions;
export default photoSlice.reducer;