import "./EditProfile.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profile, updateProfile, resetMessage } from "../../slices/userSlice";
import Message from "../../components/Message";
import { BsCamera, BsUpload } from "react-icons/bs";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, message, error, loading } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || ""); 
      setBio(user.bio || ""); 
    }
    if (authUser) {
      setEmail(authUser.user.email || ""); 
    }
  }, [user, authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    await dispatch(updateProfile(userData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e) => {
    const image = e.target.files[0];

    if (image) {
      setPreviewImage(URL.createObjectURL(image));
      setProfileImage(image);
    }
  };

  return (
    <div id="edit-profile">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h2>Editar Perfil</h2>
          <p className="subtitle">
            Personalize seu perfil com uma foto e compartilhe um pouco sobre você
          </p>
        </div>

        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            {user.profileImage || previewImage ? (
              <img
                className="profile-image"
                src={previewImage ? previewImage : user.profileImage}
                alt={user.name}
              />
            ) : (
              <div className="profile-image-placeholder">
                <span>{name?.charAt(0).toUpperCase() || "?"}</span>
              </div>
            )}
            <label htmlFor="profile-image-input" className="image-upload-badge">
              <BsCamera />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-edit">
            <label>
              <span>Nome</span>
              <input
                type="text"
                placeholder="Digite seu nome"
                onChange={(e) => setName(e.target.value)}
                value={name || ""} 
              />
            </label>
          </div>

          <div className="form-group-edit">
            <label>
              <span>E-mail</span>
              <input
                type="email"
                placeholder="E-mail"
                disabled
                value={email || ""} 
              />
              <span className="helper-text">O e-mail não pode ser alterado</span>
            </label>
          </div>

          <div className="form-group-edit">
            <span className="form-label-text">Imagem de Perfil</span>
            <input
              type="file"
              id="profile-image-input"
              onChange={handleFile}
              accept="image/*"
              className="file-upload-input"
            />
            <label htmlFor="profile-image-input" className="file-upload-button">
              <BsUpload />
              {profileImage ? profileImage.name : "Escolher arquivo"}
            </label>
            {profileImage && (
              <span className="file-selected">
                ✓ Imagem selecionada: {profileImage.name}
              </span>
            )}
          </div>

          <div className="form-group-edit">
            <label>
              <span>Bio</span>
              <textarea
                placeholder="Conte um pouco sobre você..."
                onChange={(e) => setBio(e.target.value)}
                value={bio || ""} 
                maxLength={200}
              />
              <span className="helper-text">
                {bio?.length || 0}/200 caracteres
              </span>
            </label>
          </div>

          <div className="password-section">
            <h3>Alterar Senha</h3>
            <div className="form-group-edit">
              <label>
                <span>Nova Senha (opcional)</span>
                <input
                  type="password"
                  placeholder="Digite sua nova senha"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password || ""} 
                />
                <span className="helper-text">
                  Deixe em branco para manter a senha atual
                </span>
              </label>
            </div>
          </div>

          {!loading && <input type="submit" value="Salvar Alterações" />}
          {loading && <input type="submit" disabled value="Salvando..." />}

          {error && <Message msg={error} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;