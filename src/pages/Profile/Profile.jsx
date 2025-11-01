import "./Profile.css";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import {
  BsFillEyeFill,
  BsPencilFill,
  BsXLg,
  BsImage,
  BsUpload,
} from "react-icons/bs";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../slices/userSlice";
import {
  getUserPhotos,
  publishPhoto,
  resetMessage,
  deletePhoto,
  updatePhoto,
  resetPhotos, // <<< MUDANÇA 1: Importar o resetPhotos
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));

    return () => {
      dispatch(resetPhotos());
    };
  }, [dispatch, id]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    const photoData = { title, image };
    dispatch(publishPhoto(photoData));
    setTitle("");
    setImage(null);
    if (e.target.reset) e.target.reset();
    resetComponentMessage();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
    resetComponentMessage();
  };

  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo.id);
    setEditImage(photo.image);
    setEditTitle(photo.title);
  };

  const handleCancelEdit = () => {
    hideOrShowForms();
    setEditTitle("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const photoData = { title: editTitle, id: editId };
    dispatch(updatePhoto(photoData));
    resetComponentMessage();
    hideOrShowForms();
  };

  if (loading || !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  const isOwner = userAuth && userAuth.user && userAuth.user.id === id;

  return (
    <div id="profile">
      <div className="profile-cover">
        <div className="cover-gradient"></div>
      </div>

      <div className="profile-header-modern">
        <div className="profile-avatar-wrapper">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="profile-avatar-img"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="avatar-badge"></div>
        </div>

        <div className="profile-details">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-bio">{user.bio || "✨ Sem biografia ainda"}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{photos?.length || 0}</span>
              <span className="stat-label">Fotos</span>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="forms-section">
          <div className="new-photo-card glass-card" ref={newPhotoForm}>
            <div className="card-header">
              <BsImage className="card-icon" />
              <h3>Compartilhe um momento</h3>
            </div>

            <form onSubmit={submitHandle} className="modern-form">
              <div className="form-group">
                <label className="form-label">
                  <span>Título da foto</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Digite um título criativo..."
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="file-upload-area">
                  <input
                    type="file"
                    onChange={handleFile}
                    required
                    accept="image/*"
                    className="file-input-hidden"
                  />
                  <div className="file-upload-content">
                    <BsUpload className="upload-icon" />
                    <span className="upload-text">
                      {image ? image.name : "Clique ou arraste uma imagem"}
                    </span>
                    <span className="upload-hint">PNG, JPG até 10MB</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className={`btn-modern btn-primary ${
                  loadingPhoto ? "loading" : ""
                }`}
                disabled={loadingPhoto}
              >
                {loadingPhoto ? (
                  <>
                    <span className="btn-spinner"></span>
                    Publicando...
                  </>
                ) : (
                  <>
                    <BsUpload />
                    Publicar Foto
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="edit-photo-card glass-card hide" ref={editPhotoForm}>
            <div className="card-header">
              <BsPencilFill className="card-icon" />
              <h3>Editar foto</h3>
            </div>

            {editImage && (
              <div className="edit-preview">
                <img src={editImage} alt={editTitle} />
              </div>
            )}

            <form onSubmit={handleUpdate} className="modern-form">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Novo título..."
                  onChange={(e) => setEditTitle(e.target.value)}
                  value={editTitle}
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn-modern btn-primary">
                  Atualizar
                </button>
                <button
                  type="button"
                  className="btn-modern btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </div>
      )}

      <div className="gallery-section">
        <div className="section-header">
          <h2>Galeria</h2>
          <span className="photo-count">
            {photos?.length || 0} {photos?.length === 1 ? "foto" : "fotos"}
          </span>
        </div>

        {photos && photos.length > 0 ? (
          <div className="photos-grid">
            {photos.map((photo) => (
              <div className="photo-item" key={photo.id}>
                <div className="photo-wrapper">
                  <img src={photo.image} alt={photo.title} loading="lazy" />
                  <div className="photo-hover-overlay">
                    <div className="photo-info">
                      <h4 className="photo-title">{photo.title}</h4>
                      <div className="photo-actions">
                        <Link
                          to={`/photos/${photo.id}`}
                          className="action-btn view-btn"
                        >
                          <BsFillEyeFill />
                          <span>Ver</span>
                        </Link>
                        {isOwner && (
                          <>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEdit(photo)}
                            >
                              <BsPencilFill />
                              <span>Editar</span>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(photo.id)}
                            >
                              <BsXLg />
                              <span>Excluir</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BsImage className="empty-icon" />
            <p className="empty-text">
              {isOwner
                ? "Nenhuma foto publicada ainda"
                : "Este usuário ainda não compartilhou fotos"}
            </p>
            {isOwner && (
              <p className="empty-hint">
                Comece compartilhando sua primeira foto acima!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;